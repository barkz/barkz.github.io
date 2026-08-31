# Posts

One markdown file per post, named `topic-YYYY-MM-DD.md`:

    posts/why-a-floating-clock-2026-07-12.md
          └─ topic ──────────┘ └─ date ──┘

The date drives the ordering and the byline. The first `# Heading` in the
file is the title (without one, the topic part of the filename is used,
with hyphens turned into spaces). The first paragraph becomes the excerpt
on the blog index.

## Adding a post

1. Write `posts/your-topic-2026-09-14.md`.
2. Run `python3 tools/build-blog-index.py` — this rewrites `posts.json`,
   which is the index the blog page reads. **A post that is not in
   posts.json will not appear.**
3. Commit and push both the post and `posts.json`.

## What renders

Headings, **bold**, *italic*, `inline code`, fenced code blocks, links,
images, bullet and numbered lists, blockquotes and horizontal rules.

Raw HTML is escaped rather than rendered, on purpose — posts are shown on
the same origin as the rest of the site.
