/* ==========================================================================
   WuBu — blog
   Posts are plain .md files in posts/, named topic-YYYY-MM-DD.md.
   posts/posts.json is the index the browser reads; regenerate it with
   `python3 tools/build-blog-index.py` after adding or renaming a post.
   No build step, no dependencies — the markdown is rendered here.
   ========================================================================== */

/* ---------- a small markdown renderer ----------------------------------- */
/* Raw HTML in posts is escaped rather than passed through, on purpose:
   posts render on the same origin as the rest of the site. */
function renderMarkdown(src) {
    var stash = [];
    function keep(html) { return '@@WB' + (stash.push(html) - 1) + '@@'; }

    function url(u) {
        u = u.trim();
        if (/^\s*javascript:/i.test(u)) return '#';
        return u.replace(/"/g, '%22');
    }

    function inline(t) {
        return t
            .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, function (_, alt, u) {
                return '<img src="' + url(u) + '" alt="' + alt + '" loading="lazy">';
            })
            .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, function (_, txt, u) {
                return '<a href="' + url(u) + '">' + txt + '</a>';
            })
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>')
            .replace(/(^|[^_\w])_([^_\n]+)_/g, '$1<em>$2</em>');
    }

    var text = String(src).replace(/\r\n?/g, '\n')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    /* fenced code, then inline code, are parked so nothing else touches them */
    text = text.replace(/^```[^\n]*\n([\s\S]*?)^```[ \t]*$/gm, function (_, code) {
        return keep('<pre><code>' + code.replace(/\n$/, '') + '</code></pre>');
    });
    text = text.replace(/`([^`\n]+)`/g, function (_, code) { return keep('<code>' + code + '</code>'); });

    var out = text.split(/\n{2,}/).map(function (block) {
        block = block.replace(/^\n+|\n+$/g, '');
        if (!block) return '';
        if (/^@@WB\d+@@$/.test(block)) return block;              /* a parked code block */

        var m = block.match(/^(#{1,6})\s+([\s\S]+)$/);
        if (m) {
            var tag = 'h' + Math.min(m[1].length + 1, 4);
            return '<' + tag + '>' + inline(m[2].replace(/\n/g, ' ')) + '</' + tag + '>';
        }
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(block)) return '<hr>';
        if (/^&gt;/.test(block)) {
            return '<blockquote>' + inline(block.replace(/^&gt;[ \t]?/gm, '').replace(/\n/g, ' ')) + '</blockquote>';
        }
        if (/^[-*+][ \t]+/.test(block)) {
            return '<ul>' + block.split(/\n(?=[-*+][ \t]+)/).map(function (li) {
                return '<li>' + inline(li.replace(/^[-*+][ \t]+/, '').replace(/\n\s*/g, ' ')) + '</li>';
            }).join('') + '</ul>';
        }
        if (/^\d+[.)][ \t]+/.test(block)) {
            return '<ol>' + block.split(/\n(?=\d+[.)][ \t]+)/).map(function (li) {
                return '<li>' + inline(li.replace(/^\d+[.)][ \t]+/, '').replace(/\n\s*/g, ' ')) + '</li>';
            }).join('') + '</ol>';
        }
        return '<p>' + inline(block.replace(/\n/g, ' ')) + '</p>';
    }).join('\n');

    return out.replace(/@@WB(\d+)@@/g, function (_, i) { return stash[i]; });
}

/* ---------- filenames carry the metadata -------------------------------- */
var MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY',
              'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

function longDate(iso) {
    var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!p) return '';
    return MONTHS[+p[2] - 1] + ' ' + (+p[3]) + ', ' + p[1];
}

/* topic-YYYY-MM-DD  ->  { topic, date } */
function splitSlug(slug) {
    var m = /^(.*)-(\d{4}-\d{2}-\d{2})$/.exec(slug);
    return m ? { topic: m[1], date: m[2] } : { topic: slug, date: '' };
}

function titleFromTopic(topic) {
    var t = topic.replace(/[-_]+/g, ' ').trim();
    return t.charAt(0).toUpperCase() + t.slice(1);
}

/* Pull the leading "# Title" off the body if there is one. */
function splitTitle(body, slug) {
    var text = String(body).replace(/^﻿/, '').replace(/^\s+/, '');
    var m = /^#\s+(.+)\n?/.exec(text);
    if (m) return { title: m[1].trim(), body: text.slice(m[0].length) };
    return { title: titleFromTopic(splitSlug(slug).topic), body: text };
}

function readingTime(body) {
    return Math.max(1, Math.round(body.split(/\s+/).length / 220));
}

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ---------- the index page ---------------------------------------------- */
function renderBlogIndex(mount) {
    fetch('posts/posts.json', { cache: 'no-cache' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (data) {
            var posts = (data.posts || []).slice().sort(function (a, b) {
                return (b.date || '').localeCompare(a.date || '');
            });
            if (!posts.length) {
                mount.innerHTML = '<p class="empty">Nothing written yet. Soon.</p>';
                return;
            }
            mount.innerHTML = posts.map(function (p) {
                return '<a class="post-row rev" href="post.html?p=' + encodeURIComponent(p.slug) + '">' +
                    '<div class="when">' + esc(longDate(p.date)) + '</div>' +
                    '<h2>' + esc(p.title) + '</h2>' +
                    (p.excerpt ? '<p>' + esc(p.excerpt) + '</p>' : '') +
                    '<span class="more">READ &rarr;' +
                    (p.minutes ? '<em>' + p.minutes + ' MIN</em>' : '') + '</span>' +
                    '</a>';
            }).join('');
            studioReveal(mount);
        })
        .catch(function () {
            mount.innerHTML = '<p class="empty">The post index could not be loaded. ' +
                'If you just added a post, run <code>python3 tools/build-blog-index.py</code>.</p>';
        });
}

/* ---------- a single post ------------------------------------------------ */
function renderPost() {
    var slug = new URLSearchParams(location.search).get('p') || '';
    var head = document.getElementById('post-head');
    var body = document.getElementById('post-body');

    function fail(msg) {
        head.innerHTML = '<div class="kicker"><span class="ln"></span>// NOT FOUND</div>' +
            '<h1><span class="ln-mask"><span>That post is not here.</span></span></h1>';
        body.innerHTML = '<p>' + msg + ' <a href="blog.html">Back to all posts</a>.</p>';
        document.body.classList.add('ready');
    }

    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug) || slug.indexOf('..') !== -1) {
        fail('That link does not point at a post.');
        return;
    }

    fetch('posts/' + slug + '.md', { cache: 'no-cache' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function (text) {
            var parts = splitTitle(text, slug);
            var when = longDate(splitSlug(slug).date);

            document.title = parts.title + ' -- WuBu, LLC';
            head.innerHTML =
                '<div class="kicker"><span class="ln"></span>' +
                (when ? esc(when) : '// FROM THE DESK') +
                '<span class="dot">&middot;</span>' + readingTime(parts.body) + ' MIN' +
                '</div>' +
                '<h1><span class="ln-mask"><span>' + esc(parts.title) + '</span></span></h1>';
            body.innerHTML = renderMarkdown(parts.body);
            document.body.classList.add('ready');
            neighbours(slug);
        })
        .catch(function () { fail('We could not find <code>posts/' + esc(slug) + '.md</code>.'); });
}

/* previous / next, in date order */
function neighbours(slug) {
    fetch('posts/posts.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : { posts: [] }; })
        .then(function (data) {
            var posts = (data.posts || []).slice().sort(function (a, b) {
                return (b.date || '').localeCompare(a.date || '');
            });
            var i = -1;
            posts.forEach(function (p, n) { if (p.slug === slug) i = n; });
            if (i === -1) return;
            var nav = document.getElementById('post-nav');
            var newer = posts[i - 1], older = posts[i + 1], html = '';
            if (newer) html += '<a class="newer" href="post.html?p=' + encodeURIComponent(newer.slug) + '">' +
                '<span>&larr; NEWER</span>' + esc(newer.title) + '</a>';
            if (older) html += '<a class="older" href="post.html?p=' + encodeURIComponent(older.slug) + '">' +
                '<span>OLDER &rarr;</span>' + esc(older.title) + '</a>';
            nav.innerHTML = html;
        })
        .catch(function () { /* neighbours are a nicety */ });
}
