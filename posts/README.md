# Posts

One markdown file per post, named `topic-YYYY-MM-DD.md`:

    posts/why-a-floating-clock-2026-07-12.md
          └─ topic ──────────┘ └─ date ──┘

Each post becomes its own page at `blog/topic.html`
(`wubu.ai/blog/why-a-floating-clock.html`), and `blog.html` lists every
post, newest first. The date drives the ordering and the byline. The first
`# Heading` in the file is the title (without one, the topic is used, with
hyphens turned into spaces). The first paragraph becomes the excerpt on the
blog index and the page's description in link previews.

## Adding a post

1. Write `posts/your-topic-2026-09-14.md`.
2. Run `python3 tools/build-site.py`. It writes `blog/your-topic.html` and
   updates the list on `blog.html`. **A post that has not been built will
   not appear.**
3. Commit and push the markdown, the new page in `blog/` and `blog.html`.

Renaming or deleting a post's markdown removes its old page on the next
build. Two posts cannot share a topic, since they would share a page.
Generated pages say so at the top: edit the markdown, not the HTML.

## What renders

- `# Title` on the first line is the post title.
- `##` starts a section (`#` in the body does too), `###` a subsection,
  `####` a minor heading. Every heading gets an anchor, so long posts can
  link to a section: `[see below](#the-rule-we-set-first)`.
- **Bold**, *italic*, `inline code` and fenced code blocks.
- Links and images. Write relative paths from the site root, such as
  `[support](support.html)` or `![screenshot](images/clock.png)`. They are
  adjusted for the `blog/` folder.
- Bullet and numbered lists (one level), blockquotes and horizontal rules.

Raw HTML is escaped rather than rendered, on purpose.
