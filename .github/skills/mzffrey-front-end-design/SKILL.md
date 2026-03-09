---
name: mzffrey-front-end-design
description: 'Design or refine pages and components for mzffreyvazov.me. Use when working on frontend layout, typography, article UI, navigation, spacing, motion, or responsive polish in this repo. Preserves the site''s quiet editorial style, markdown-first structure, restrained light palette, and subtle interaction patterns.'
argument-hint: 'Describe the page, section, component, or redesign goal.'
user-invocable: true
---

# Mzffrey Front-End Design

Use this skill only for this repository when designing, restyling, or extending the frontend.

Before making design decisions, load and follow [the exact design system reference](./references/design-system.md).

## Outcome

Produce frontend changes that feel native to this site:
- editorial, calm, and content-led rather than app-like
- light-only and low-chroma, with the `rurikon` scale as the base palette
- typography-driven, with narrow reading widths and deliberate whitespace
- interactive only where it improves reading, navigation, or media inspection

## Core Design Baseline

Start from these project truths before proposing any UI changes.

If a request asks for exact values, defaults, or reusable specs, treat [the exact design system reference](./references/design-system.md) as the source of truth.

### Visual Direction

- The site is intentionally restrained. Avoid glossy SaaS styling, oversized cards, loud gradients, neon accents, glassmorphism, or heavy shadows.
- The background stays near `#fcfcfc`, with soft gray-blue text and borders from the `rurikon` palette.
- Contrast increases through weight, spacing, and hierarchy more than through saturated color.
- Borders are thin and quiet. Rounded corners are used sparingly and usually stay small.

### Typography

- Sans: Inter variable for primary interface and body text.
- Serif: Lora italic variable for emphasis, quotes, sidenotes, and more literary moments.
- Mono: Iosevka for code.
- Prefer typographic hierarchy over decorative containers.
- Preserve the existing reading rhythm: compact headers, relaxed paragraph leading, subtle tracking, and balanced line lengths.

### Layout

- The global shell is a simple two-part composition: slim right-aligned nav column plus a single reading column.
- Main content should stay narrow and readable. Do not expand pages into wide dashboard layouts unless the task explicitly requires it.
- Mobile behavior should stack the nav above the content cleanly without adding dense chrome.
- Favor flow content over nested panels.

### Interaction

- Motion is progressive enhancement. Existing transitions are subtle crossfades using the View Transitions API.
- Hover states should be quiet: text darkening, underline strengthening, border shifts, or opacity changes.
- Interactive affordances should feel lightweight and immediate.
- For media, zoom/lightbox behavior is acceptable because it supports reading and inspection.

### Content Model

- Markdown and article rendering are central to the product, not an edge case.
- Article pages should prioritize title, metadata, prose, images, code blocks, and table-of-contents behavior.
- Search and filtering should remain minimal and keyboard-friendly.

## Canonical Patterns In This Repo

Use these as the default references when making design decisions.

- `app/layout.tsx`: global shell, fonts, reading width, light-only viewport.
- `app/globals.css`: palette, typography primitives, blockquote treatment, code styling, transitions, and editorial utilities.
- `components/navbar.tsx`: sparse lowercase navigation with active-state darkening instead of heavy indicators.
- `components/markdown-renderer.tsx`: article hierarchy, inline code, code blocks, embeds, captions, and quiet component chrome.
- `components/block-sidetitle.tsx`: sidenote-style annotation pattern.
- `app/thoughts/[slug]/page.tsx`: article header, metadata, tags, and prose-first detail page structure.
- `components/thoughts-list-with-search.tsx` and `components/search-bar.tsx`: low-chrome archive browsing and lightweight filtering.
- `components/table-of-contents.tsx`: long-form reading aid with understated progress indication.

## Procedure

### 1. Classify the Task

Place the request into one of these buckets before changing anything:

- Article surface: markdown renderer, article page, TOC, embeds, code, captions, notes.
- Archive or navigation surface: navbar, search, lists, tags, filters, links.
- Static page surface: home, projects, guestbook, not-found, visuals.
- Global system surface: layout shell, typography, color tokens, spacing, motion.

### 2. Identify the Existing Pattern To Reuse

Before inventing a new component or layout, ask:

- Can this be expressed as markdown content instead of a custom UI?
- Can this reuse existing article primitives like headings, block side titles, alerts, figures, or code blocks?
- Can this fit inside the current single-column reading width?
- Can this use text treatment, rules, and spacing instead of cards or panels?

If the answer is yes, reuse the existing pattern.

### 3. Apply This Design Logic

When adding or revising UI, follow these rules:

- Start with typography and spacing first.
- Use color last, and only to clarify hierarchy or state.
- Prefer border-bottom, underline, weight, or tone shifts over filled buttons and boxed sections.
- Keep page compositions airy. Remove unnecessary wrappers.
- Make decorative choices serve reading, scanning, or structure.
- If a section feels noisy, simplify rather than embellish.

### 4. Handle Exceptions Deliberately

If the task genuinely needs a stronger visual treatment, keep it within the site language:

- Use restrained tonal backgrounds from the existing palette instead of introducing new bright brand colors.
- Keep motion soft and optional.
- Avoid full-screen hero treatments unless the page is being intentionally re-conceived.
- For unfinished sections like `visuals`, do not treat the placeholder as permission to break the site language without explicit direction.

### 5. Verify Responsive Behavior

Check the result against the current layout philosophy:

- On mobile, the nav/content stack should remain clear and light.
- Paragraphs, headings, lists, and code blocks should remain readable without cramped spacing.
- Search, TOC access, and image viewing should remain usable without adding clutter.
- Horizontal overflow should only appear where content truly requires it, such as code.

## Decision Points

### When to introduce a new component

Create a new component only if at least one of these is true:

- the pattern repeats across multiple pages
- markdown cannot express the structure cleanly
- interactivity or state makes inline markup awkward
- the UI would otherwise duplicate existing logic in more than one place

Otherwise, keep the solution local and simple.

### When to use boxed UI

Use borders, cards, or filled surfaces only when they communicate a distinct object such as:

- code blocks
- alerts
- media frames
- overlays or modal states

Do not wrap ordinary prose sections or navigation items in boxes just to make them feel designed.

### When to add motion

Add motion only if it helps orientation or continuity:

- route changes
- opening or dismissing focused media
- subtle hover feedback

Skip motion when it is merely ornamental.

## Completion Checks

The work is not done until these are true:

- The result still looks like part of the same quiet editorial website.
- The design reads well before it decorates well.
- Typography, spacing, and hierarchy do most of the work.
- New colors, shadows, and containers are minimal and justified.
- Existing interactions remain subtle and functional.
- Mobile layout remains clean.
- The page does not drift toward dashboard, template, or generic blog-theme aesthetics.

## Anti-Patterns For This Repo

Avoid these unless the user explicitly asks for a new direction:

- hero sections with oversized marketing copy and CTA buttons
- card grids replacing prose lists without a clear content need
- saturated accent colors or dark mode treatments
- heavy blur, large drop shadows, or oversized radii
- over-animated microinteractions
- default Tailwind component-library styling that ignores the typography system
- widening the content area so much that long-form reading suffers

## Suggested Workflow For Future Requests

When invoked, respond in this order:

1. Name the existing project pattern being extended.
2. State the minimal design move that preserves the site language.
3. Implement or describe the UI using the current typography, spacing, and palette system.
4. Check mobile and reading flow.
5. Call out any place where the request conflicts with the current design language.

## Ambiguities To Confirm When Relevant

Ask targeted questions only if the request depends on them:

- Should `visuals` continue the editorial language, or is it the one area allowed to become more visual and portfolio-like?
- Should `guestbook` stay as a markdown-first page, or evolve into a more interactive product surface?
- Is the current light-only design a hard constraint, or can a future redesign introduce another theme?
