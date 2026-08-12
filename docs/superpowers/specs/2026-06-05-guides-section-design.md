# Guides Section — Design

**Date:** 2026-06-05
**Author:** Zeeshan Adil (with Claude Code)
**Status:** Approved

## Purpose

Add a "Guides" section to the Dev Weekends website: a home for long-form,
curated guides authored by Dev Weekends and used by the whole community.
Guides are markdown files organized by category, with some marked as featured.
Two existing guides ship at launch:

- *A grad's guide to cracking tech roles* → **Career & Tech Roles**
- *Building Better Habits and a Balanced Schedule* → **Productivity & Habits**

Both launch as **featured**.

## Approach

Mirror the existing markdown-driven blog system (`content/blog/*.md` rendered
with `gray-matter` + `react-markdown` + `remark-gfm`). This keeps the codebase
consistent and means future guides are added by dropping a markdown file in a
folder — no code changes required.

## Content model

New folder `content/guides/*.md`. Each file is one guide. Frontmatter:

```yaml
title: string            # required
description: string      # required — shown on cards
category: string         # required — one of the categories below
featured: boolean        # default false
order: number            # default 999, lower sorts first
date: string             # YYYY-MM-DD
icon: string             # optional — lucide icon name for the card eyebrow
readingTime: string      # optional — e.g. "12 min read"
```

The markdown body is the guide content. Inline images use standard markdown
image syntax and resolve from `public/`.

## Categories (launch set)

1. **Career & Tech Roles**
2. **Productivity & Habits**
3. **Open Source**
4. **Mindset & Growth**

The two source guides fill the first two. Open Source and Mindset & Growth ship
empty but ready, so new guides slot in without code changes. A category tab with
zero guides shows an empty state rather than disappearing, so the structure is
visible.

## Pages

### `/guides` — listing
- Styled to match `/blog` for visual consistency (light background, serif
  headings, generous spacing).
- Hero: "Guides" headline with a one-line subtitle ("Curated by Dev Weekends,
  used by all").
- **Featured slider** — Swiper carousel of `featured: true` guides, same
  component setup as the blog featured slider.
- **Category tabs** — one tab per category with a count. Selecting a tab filters
  the card grid below. Empty categories show a friendly empty state.
- **Cards** — category eyebrow, title, description, reading time. Link to the
  reader page.

### `/guides/[slug]` — reader
- Matches the blog post layout: back link, uppercase category eyebrow, serif
  title, optional reading time/date, prose body via `react-markdown` with the
  same component overrides (headings, lists, blockquote, links, images).
- Renders the custom SVG illustrations inline.
- Missing slug → "Guide not found" with a link back to `/guides`.

## Custom SVGs

The grad guide and habits guide originally referenced screenshots (Trello
weekday/weekend boards, a daily reflection template, a "things I learned" list,
a note-taking setup) that are not in the source text. Replace these with
minimal, clean, custom line-style SVG illustrations:

- Single accent color: Signal green `#22C55E` (matches the Dev Weekends brand),
  on a neutral/transparent background so they read in both light and dark.
- Simple, schematic representations (e.g. a kanban board with three columns, a
  reflection checklist, a notes panel) — illustrative, not pixel-perfect
  recreations.
- Stored under `public/guides/` and referenced from the markdown.

## Conversion principle

Stay faithful to the original text and the author's first-person voice. Fix only
markdown formatting (headings, lists, link syntax), preserve the resource links
(YouTube talks, GitHub roadmap), and insert the custom SVGs where the original
pointed to a visual.

## Navigation

Add a standalone **Guides** link to the navbar:
- Desktop: append to the `routes` array, placed right after "News & Blog" so the
  content links sit together.
- Mobile: appears in the same routes loop in the mobile menu.

## Files

Created:
- `content/guides/cracking-tech-roles.md`
- `content/guides/better-habits-balanced-schedule.md`
- `app/guides/page.tsx`
- `app/guides/guidesClient.tsx`
- `app/guides/[slug]/page.tsx`
- `public/guides/*.svg` (custom illustrations)

Modified:
- `components/navbar.tsx` (add Guides link)

Source `.txt` files at repo root are removed after conversion (their content
lives in the markdown guides).

## Out of scope (YAGNI)

- No CMS/admin UI for guides — markdown files only, like the blog.
- No search, no tags beyond category, no author pages.
- No pagination — the guide count is small.
