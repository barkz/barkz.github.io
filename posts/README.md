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
2. Commit and push it to `main`.
3. The **Build site** action (`.github/workflows/build-site.yml`) runs
   `tools/build-site.py`, commits the new `blog/your-topic.html` and the
   updated `blog.html` as github-actions[bot], and deploys. It takes a
   minute or two; watch it in the repo's Actions tab.
4. `git pull`, so your copy has the bot's commit before you push again.

To see a post before publishing, run `python3 tools/build-site.py` and open
`blog/your-topic.html`. Committing the built pages yourself is fine too; the
action then finds nothing to do.

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
