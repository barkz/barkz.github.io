# Partials

Shared markup that `tools/build-site.py` copies into every page. Edit a
file here, run the build, and every page that uses it updates.

| File | Where it goes |
|---|---|
| `head.html` | each page's `<head>`: title, description, link preview tags, fonts, stylesheet |
| `nav.html` | the top nav |
| `orb.html` | the live orb clock and its orbits |
| `footer.html` | the footer |
| `mail.html` | an email address with its Copy button |
| `post-row.html` | one post in the list on `blog.html` |
| `post.html` | the whole page for a blog post |

In these files, `{{key}}` inserts a value from `site.json` (dotted keys reach
inside it, such as `{{launch.short}}` or `{{email.askus}}`), escaped for
HTML. `{{root}}` is the path back to the site root (`../` on blog posts).
`{{current blog}}` marks the nav link for the page whose `nav` key in
`site.json` is `blog`.

On the pages themselves, shared pieces sit between markers:

    <!-- build:nav --> ... <!-- /build -->
    <!-- build:mail askus --> ... <!-- /build -->
    <!-- build:text launch.short -->Dec 15, 2026<!-- /build -->

The build rewrites what is between the markers and nothing else. Edit
everything outside them as normal. To use a shared value somewhere new, add
a marker with an empty middle, `<!-- build:text year --><!-- /build -->`,
and run the build.

`python3 tools/build-site.py --check` changes nothing and exits with an
error if any page is out of date.

You don't have to run the build before pushing: the **Build site** action
rebuilds after every push to `main` and commits whatever changed. Run
`git pull` afterwards.
