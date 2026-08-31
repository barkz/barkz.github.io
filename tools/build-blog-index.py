#!/usr/bin/env python3
"""Regenerate posts/posts.json from the .md files in posts/.

Posts are named topic-YYYY-MM-DD.md — the date in the filename is the
publish date and drives the ordering. The first "# Heading" in the file is
the title; without one, the topic part of the filename is used. The first
paragraph becomes the excerpt on the blog index.

    python3 tools/build-blog-index.py
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(ROOT, "posts")
INDEX = os.path.join(POSTS, "posts.json")

NAME = re.compile(r"^(?P<topic>[a-z0-9][a-z0-9._-]*)-(?P<date>\d{4}-\d{2}-\d{2})\.md$")
EXCERPT_CHARS = 190


def strip_markdown(text):
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)          # images
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)      # links
    text = re.sub(r"`([^`]*)`", r"\1", text)                  # code spans
    text = re.sub(r"[*_]{1,3}(\S.*?\S|\S)[*_]{1,3}", r"\1", text)
    text = re.sub(r"^\s*[>#-]+\s*", "", text)
    return re.sub(r"\s+", " ", text).strip()


def excerpt(body):
    for block in re.split(r"\n\s*\n", body):
        block = block.strip()
        if not block or block.startswith("#") or block.startswith("```"):
            continue
        flat = strip_markdown(block)
        if not flat:
            continue
        if len(flat) <= EXCERPT_CHARS:
            return flat
        cut = flat[:EXCERPT_CHARS].rsplit(" ", 1)[0]
        return cut.rstrip(",;:.") + "..."
    return ""


def main():
    if not os.path.isdir(POSTS):
        sys.exit("no posts/ directory next to %s" % os.path.basename(ROOT))

    posts, skipped = [], []
    for name in sorted(os.listdir(POSTS)):
        if not name.endswith(".md") or name.startswith("_") or name == "README.md":
            continue
        m = NAME.match(name)
        if not m:
            skipped.append(name)
            continue

        with open(os.path.join(POSTS, name), encoding="utf-8") as fh:
            raw = fh.read().lstrip("﻿").strip()

        head = re.match(r"^#\s+(.+)\s*\n?", raw)
        if head:
            title = head.group(1).strip()
            body = raw[head.end():]
        else:
            title = m.group("topic").replace("-", " ").replace("_", " ").strip()
            title = title[:1].upper() + title[1:]
            body = raw

        words = len(body.split())
        posts.append({
            "slug": name[:-3],
            "file": name,
            "date": m.group("date"),
            "title": title,
            "excerpt": excerpt(body),
            "minutes": max(1, round(words / 220)),
        })

    posts.sort(key=lambda p: (p["date"], p["slug"]), reverse=True)

    with open(INDEX, "w", encoding="utf-8") as fh:
        json.dump({"posts": posts}, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print("wrote %s (%d post%s)" % (
        os.path.relpath(INDEX, ROOT), len(posts), "" if len(posts) == 1 else "s"))
    for p in posts:
        print("  %s  %s" % (p["date"], p["title"]))
    for name in skipped:
        print("  SKIPPED %s — expected topic-YYYY-MM-DD.md" % name, file=sys.stderr)


if __name__ == "__main__":
    main()
