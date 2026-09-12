<div align="center">

<img src=".github/assets/banner.jpg" alt="wubu.ai — built by hand, on purpose" width="100%">

<p>
  <a href="https://wubu.ai"><b>Visit the site</b></a>
  &nbsp;·&nbsp;
  <a href="https://wubu.ai/blog.html">Read the blog</a>
  &nbsp;·&nbsp;
  <a href="https://wubu.ai/who.html">Who we are</a>
  &nbsp;·&nbsp;
  <a href="https://wubu.ai/support.html">Support</a>
</p>

<p>
  <a href="https://wubu.ai"><img src="https://img.shields.io/badge/live-wubu.ai-C49EEF?style=flat-square&labelColor=0a0a0a" alt="Live at wubu.ai"></a>
  <img src="https://img.shields.io/badge/build%20step-none-FFB870?style=flat-square&labelColor=0a0a0a" alt="No build step">
  <img src="https://img.shields.io/badge/dependencies-0-7B3FBF?style=flat-square&labelColor=0a0a0a" alt="Zero dependencies">
  <img src="https://img.shields.io/badge/hosted-GitHub%20Pages-5B2D8E?style=flat-square&labelColor=0a0a0a" alt="Hosted on GitHub Pages">
</p>

</div>

> **WuBu, LLC** makes Mac utilities and iPhone games, slowly and on purpose.
> This is the website — built the same way: hand-written HTML, nothing to
> install, nothing to compile, no framework to keep up with.

---

## See it

|  |  |
|:--:|:--:|
| <img src=".github/assets/home.jpg" width="100%"><br><sub>**Home** — editorial hero, live clock</sub> | <img src=".github/assets/clocktastic.jpg" width="100%"><br><sub>**The moment** — pinned and grown to full bleed on scroll</sub> |
| <img src=".github/assets/blog.jpg" width="100%"><br><sub>**Blog** — markdown files, rendered in the browser</sub> | <img src=".github/assets/post.jpg" width="100%"><br><sub>**A post** — one `.md` file, no CMS</sub> |

---

## Why it is built like this

| Nothing to install | One design system | Writing, not tooling |
|---|---|---|
| No node_modules, no bundler, no CI. Clone it, open a file, read the whole thing in an afternoon. | `studio.css` holds the palette, the type and every shared component. Change a custom property, the site follows. | A post is a markdown file with a date in its name. Two commands and it is live. |

---

## Quick start

```sh
git clone https://github.com/barkz/barkz.github.io.git
cd barkz.github.io
python3 -m http.server 8000     # then open http://localhost:8000
```

> [!IMPORTANT]
> Serve it over http — do not open the files directly. The blog `fetch()`es its
> own posts, and browsers block that on `file://` URLs, so the blog looks empty.

## Publish a post

```sh
vi posts/your-topic-2026-09-14.md     # name it topic-YYYY-MM-DD.md
python3 tools/build-blog-index.py     # rebuilds posts/posts.json
git add posts && git commit -m "New post" && git push
```

The date orders the posts and sets the byline. The first `# Heading` is the
title, the first paragraph is the excerpt. Full rules: [posts/README.md](posts/README.md).

<details>
<summary><b>Everything in the repo</b></summary>

<br>

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
| `CNAME` · `.nojekyll` | the domain, and "Pages, hands off the markdown" |

</details>

---

## The palette

![#0a0a0a](https://img.shields.io/badge/%230a0a0a-0a0a0a?style=flat-square)
![#5B2D8E](https://img.shields.io/badge/%235B2D8E-5B2D8E?style=flat-square)
![#7B3FBF](https://img.shields.io/badge/%237B3FBF-7B3FBF?style=flat-square)
![#9668C2](https://img.shields.io/badge/%239668C2-9668C2?style=flat-square)
![#C49EEF](https://img.shields.io/badge/%23C49EEF-C49EEF?style=flat-square)
![#FFB870](https://img.shields.io/badge/%23FFB870-FFB870?style=flat-square)
![#e6def0](https://img.shields.io/badge/%23e6def0-e6def0?style=flat-square)

Fraunces for display · Inter for text · Press Start 2P for the pixel accents.

<div align="center">
<br>
<sub>© 2026 WuBu, LLC — polished over fast, tools not traps.</sub>
</div>
