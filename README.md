# wubu.ai

The website for **WuBu, LLC** — a small studio making Mac utilities and iPhone
games. Hand-written HTML, no build step, no dependencies.

**Live:** <https://wubu.ai> · **Deploy:** push to `main`, GitHub Pages does the rest.

## Run it locally

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. Use a server, not `file://` — the blog fetches its
posts, and browsers block that on file URLs.

## Write a post

```sh
vi posts/your-topic-2026-09-14.md   # name it topic-YYYY-MM-DD.md
python3 tools/build-blog-index.py   # rebuilds posts/posts.json
```

Commit both files. Full rules: [posts/README.md](posts/README.md).

## What is what

| Path | |
|---|---|
| `index.html` | home — hero, the pinned Clocktastic frame, releases, quiet rules |
| `blog.html` · `post.html` | blog index, and the single-post reader (`?p=slug`) |
| `who.html` · `support.html` · `privacy.html` | interior pages |
| `studio.css` | the design system: palette, type, nav, prose, footer |
| `studio.js` | ambient canvas, nav state, scroll reveals |
| `blog.js` | markdown renderer and blog rendering |
| `posts/` | posts as markdown + the generated `posts.json` |
| `tools/` | `build-blog-index.py` |

`.nojekyll` keeps GitHub Pages from touching the markdown. `CNAME` holds the domain.
