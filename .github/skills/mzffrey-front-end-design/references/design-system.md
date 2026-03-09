# Exact Design System Reference

This file converts the current implementation into prescriptive numbers the agent can reuse.

Use these values unless the user explicitly asks for a departure.

## 1. Variable And Token Mapping

### Core Colors

Primary site palette from `app/globals.css`:

- `--color-rurikon-50`: `#ebedef`
- `--color-rurikon-100`: `#d8dbdf`
- `--color-rurikon-200`: `#b3b9c1`
- `--color-rurikon-300`: `#8c95a1`
- `--color-rurikon-400`: `#697381`
- `--color-rurikon-500`: `#4a515b`
- `--color-rurikon-600`: `#3b4149`
- `--color-rurikon-700`: `#2b3035`
- `--color-rurikon-800`: `#1e2125`
- `--color-rurikon-900`: `#0e0f11`
- `--color-rurikon-950`: `#07080a`
- `--color-rurikon-border`: `#d8dbdfb3`

Global non-palette colors:

- `--background`: `#fcfcfc`
- Selection background: `#95a5ac40`
- Selection text: `#485a74`
- Code foreground: `#414141`
- Code background: `#f7f7f7`
- Content fade gradient end: `#fcfcfc00`
- Lightbox overlay: `rgba(0, 0, 0, 0.9)` from `bg-black/90`
- TOC backdrop: `rgba(255, 255, 255, 0.8)` from `bg-white/80`
- White surface: `#ffffff`

Syntax highlighting tokens:

- Comment: `hsl(215deg 32% 37% / 45%)`
- Punctuation: `hsl(215deg 32% 37% / 65%)`
- Keyword: `hsl(215deg 32% 37% / 85%)`
- Function: `hsl(223deg 85% 46%)`
- String: `#0fb359`
- String expression: `#0fb359`
- Constant: `hsl(215deg 32% 26%)`
- Link token: `#0fb359`
- Parameter: `#ff9800`

Semantic accent colors used only in alert shortcodes:

- Info: `bg-blue-50 border-blue-200 text-blue-800`
- Warning: `bg-yellow-50 border-yellow-200 text-yellow-800`
- Error: `bg-red-50 border-red-200 text-red-800`
- Success: `bg-green-50 border-green-200 text-green-800`

### Typography Tokens

Font families from `app/layout.tsx` and `app/globals.css`:

- Sans primary: `InterVariable.woff2` as `--sans`
- Serif accent: `LoraItalicVariable.woff2` as `--serif`
- Mono: `IosevkaFixedCurly-ExtendedMedium.woff2` as `--mono`
- Chinese fallback stack: `PingFang SC`, `Hiragino Sans GB`, `Source Han Sans CN`, sans-serif

Font feature settings:

- `--font-features`: `'cpsp' 1, 'cv01', 'cv03', 'cv04', 'calt', 'ss03', 'liga', 'ordn'`
- `--sans-variation`: `'opsz' 32`

Font-weight mapping in utility layer:

- `font-thin`: `wght 100`
- `font-extralight`: `wght 200`
- `font-light`: `wght 300`
- `font-normal`: `wght 440`
- `font-medium`: `wght 500`
- `font-semibold`: `wght 600`
- `font-bold`: `wght 640`
- `font-extrabold`: `wght 700`
- `font-black`: `wght 800`

Body defaults:

- Base body size at mobile: `14px / 24px` from `text-sm leading-6`
- Small breakpoint body size: `15px / 28px` from `sm:text-[15px] sm:leading-7`
- Medium breakpoint body size: `16px / 28px` from `md:text-base md:leading-7`
- Body weight: `440`
- Body letter-spacing: `0.0085em`
- Body word-spacing: `-0.04em`
- Serif/em/nav/sidenote letter-spacing: `-0.006em`
- Serif/em/nav/sidenote weight: `400` with optical sizing enabled

Heading sizes in article rendering:

- `h1`: `24px`, `font-bold`, color `rurikon-700`, margin bottom `12px`
- `h2`: `20px`, `font-semibold`, color `rurikon-600`, margin top `48px`, margin bottom `12px`
- `h3`: `18px`, `font-semibold`, color `rurikon-600`, margin top `40px`, margin bottom `8px`
- `h4`: `16px`, `font-semibold`, color `rurikon-600`, margin top `32px`, margin bottom `8px`
- `h5`: `16px`, `font-medium`, color `rurikon-500`, margin top `24px`, margin bottom `8px`
- Body paragraph: top margin `16px`, `leading-relaxed`, color `rurikon-500`
- Caption/sidenote size: `12px` mobile, `14px` at `sm`

Inline code:

- Font: mono
- Size: `14px` from `text-sm`
- Padding: `6px 2px` equivalent from `px-1.5 py-0.5`
- Radius: `4px` from `rounded`
- Border: `1px solid var(--color-rurikon-100)`
- Text color: `rurikon-600`
- Background: `rurikon-50`

### Spacing And Layout Tokens

The project does not follow a strict 8px-only system. The actual working scale is mixed editorial spacing plus Tailwind utilities.

Core spacing values used in layout and CSS:

- `2px`: `rounded-sm`, fine image corners
- `4px`: `rounded`, summary spacing, micro offsets
- `6px`: `p-1.5`, `rounded-md`
- `8px`: `p-2`, `gap-2`, `py-2`, `details` vertical padding
- `12px`: `p-3`, `px-3`, `mb-3`, `mt-3`
- `14px`: `0.875rem`, default framed-media padding
- `16px`: `p-4`, `m-4`, paragraph rhythm steps
- `24px`: `p-6`, main mobile shell padding, `mt-6`
- `28px`: `1.75rem`, figure spacing, `mt-7`
- `32px`: `mt-8`, `text-2xl` line box
- `40px`: `p-10`, `mt-10`, large section rhythm
- `48px`: `mt-12`, floating action button width and height
- `56px`: `p-14`, desktop shell padding
- `64px`: `w-64`, TOC panel width and max-height utility name base
- `80px`: body bottom padding for floating TOC clearance

Other exact numeric constraints from CSS and layout:

- `max-w-2xl`: article column max width is `42rem / 672px`
- `mobile` breakpoint: `420px`
- `text` breakpoint: `1220px`
- `min-h-[60vh]`: article area minimum height `60vh`
- TOC sticky default top: `192px`
- Grain tile size: `200px x 200px`
- Default framed media padding variable: `0.875rem / 14px`
- Blockquote line: `1px` desktop, `2px` mobile
- Floating TOC trigger inset: `16px` from right and bottom
- Floating TOC panel inset: `16px` right, `80px` bottom

### Motion Tokens

- Route transition old view: `0.4s cubic-bezier(0.6, 0, 0.8, 1)`
- Route transition new view: `0.6s ease` with `0.2s` delay
- Blur amount in transitions: `4px`
- Floating UI transitions: `150ms` to `200ms`

## 2. Standard Component Spec

These are the default component geometries the agent should reuse.

### Primary Button

There is no generic button component in the repo. The closest primary action pattern is the floating TOC trigger in `components/toc-floating-button.tsx`.

Use this as the primary button spec when a strong action is required:

- Height: `48px`
- Width: `48px` for icon-only, otherwise keep height `48px` and use horizontal padding `12px` to `16px`
- Border radius: `9999px` for floating icon button, `6px` for inline text buttons
- Background: `rurikon-700`
- Text/icon color: `#ffffff`
- Font weight: `600` for emphasized text buttons
- Shadow: `shadow-lg`
- Hover behavior: scale to `1.05`
- Active behavior: scale to `0.95`

If the button is not a strong floating action, prefer a text/list button instead of a filled button.

### Secondary Or List Button

Derived from TOC list items and copy button patterns:

- Padding: `12px 8px` for list rows from `px-3 py-2`
- Small icon button padding: `6px` from `p-1.5`
- Border radius: `6px`
- Font size: `14px`
- Font weight inactive: `440`
- Font weight active/emphasized: `600`
- Background active: `rurikon-50`
- Text inactive: `rurikon-500`
- Text hover: `rurikon-600`
- Borders: usually none

### Input

Canonical input geometry comes from `components/search-bar.tsx`.

- Width: `100%`
- Left icon inset: `12px`
- Text padding left: `40px` from `pl-10`
- Text padding right: `16px` from `pr-4`
- Vertical padding: `8px` from `py-2`
- Font size: `14px`
- Border style: bottom border only
- Border width: `1px`
- Border radius: `0`
- Background: transparent
- Focus treatment: no ring, border darkens

Color note:

- The current input uses `gray-200` and `gray-400` utilities instead of `rurikon` tokens.
- For future work, preserve the same geometry but prefer `rurikon-200` and `rurikon-400` to keep the palette consistent.

### Card / Surface

Two surface patterns are canonical.

Editorial card pattern from `components/tweet-card.tsx`:

- Border: `1px solid var(--color-rurikon-border)`
- Radius: `8px` from `rounded-lg`
- Overflow: clipped
- Hover: background shifts to white only, no heavy transform
- Internal content spacing: `16px` outer margins with tighter top/bottom trims

Utility panel pattern from `components/toc-floating-button.tsx` and code block wrappers:

- Border: `1px solid rurikon-100` or `rurikon-200`
- Radius: `8px`
- Background: `#ffffff` or `rurikon-50` header with `#fafafa` body
- Shadow: `shadow-lg` only for floating overlays, otherwise no shadow
- Header padding: `12px` or `16px horizontal / 6px vertical`
- Body padding: `16px`

## 3. Spatial Logic

### Layout Constraints

- The site shell is always nav column plus a single reading column.
- Nav remains slim: `mobile:w-16` equals `4rem / 64px` on horizontal layouts.
- Main content max width is `672px`.
- Outer page padding is `24px` mobile, `40px` on `sm`, `56px` on `md`.
- Content inset from divider is `24px` on mobile-horizontal layouts, `40px` on `sm`, `56px` on `md`.

### Spacing Rules The Agent Should Follow

- Use the existing scale, not an invented one. Default to `6, 8, 12, 16, 24, 28, 40, 48, 56`.
- Use `16px` as the default internal padding for content surfaces.
- Use `24px` as the default vertical separation before standalone media, code blocks, and embeds.
- Use `28px` for figure and editorial block spacing where the codebase already uses `1.75rem`.
- Use `40px` to `48px` to separate heading levels and larger reading sections.
- Do not introduce dense `10px`, `18px`, `22px`, or other off-scale values unless required by dynamic runtime calculation.
- Avoid widening the reading column past `672px` for prose pages.

### Border And Radius Rules

- Standard border width: `1px`
- Standard border color: `rurikon-100`, `rurikon-200`, or `rurikon-border`
- Standard small radius: `2px`
- Standard medium radius: `6px`
- Standard large radius: `8px`
- Full radius is reserved for floating icon buttons

## 4. Visual Vocabulary

The correct style description for this project is:

- Quiet editorial
- Low-chroma minimalist
- Typographic and content-led
- Light-only
- Softly structured rather than flat or decorative

How that translates into UI decisions:

- Borders replace most fills
- Shadows are rare and reserved for overlays or floating affordances
- Most interface state changes happen through text tone, underline, or border shifts
- Panels should feel like tools supporting reading, not like a dashboard system
- The visual system is intentionally sparse; extra ornament usually makes the result worse

Border usage:

- Inline and content boundaries use `rurikon-border`, `rurikon-100`, or `rurikon-200`
- Dividers are hairline-like and low-contrast
- Blockquotes use a single inset vertical rule instead of a boxed container

Shadow usage:

- Default: no shadow
- Allowed: `shadow-lg` on floating TOC surfaces and modal-like media states
- Avoid stacking multiple shadow utilities or using dramatic ambient shadows

## 5. Code Patterns

### Styling Approach

- Primary styling system: Tailwind utility classes directly in JSX
- Global design tokens and editorial rules: `app/globals.css`
- No CSS modules found
- No styled-components or CSS-in-JS system found
- Inline styles are used only for runtime values the utility system cannot express cleanly

### Inline Style Patterns In Use

- `viewTransitionName` wrapper in `components/view-transition.tsx`
- Dynamic `paddingLeft` for nested TOC levels in `components/toc-floating-button.tsx`
- Explicit sans stack override for TOC panel in `components/toc-floating-button.tsx`

### Class Pattern Rules

- Compose layout and spacing with Tailwind utilities in the component
- Keep global CSS for shared typography, tokens, motion, and markdown-specific rules
- Use `clsx` when state swaps utility sets
- Prefer semantic reuse of existing utility combinations over introducing new abstractions too early

## 6. Three Golden Examples

### Golden Example 1: Global Shell

File: `app/layout.tsx`

Why it is canonical:

- Sets the exact responsive outer padding: `24 / 40 / 56`
- Sets the exact body typography ramp: `14/24`, `15/28`, `16/28`
- Keeps the page in a narrow reading-column layout with a slim nav rail
- Uses a single quiet divider instead of boxed page chrome

### Golden Example 2: Editorial Code Block Surface

File: `components/markdown-renderer.tsx`

Why it is canonical:

- Uses the project-standard surface geometry: `8px` radius, `1px` border, `16px` body padding
- Uses subdued palette choices: `rurikon-50`, `rurikon-100`, `#fafafa`
- Uses a tiny uppercase label and a low-chrome copy affordance instead of decorative framing
- Solves a dense UI problem without breaking the editorial language

### Golden Example 3: Floating TOC Control

File: `components/toc-floating-button.tsx`

Why it is canonical:

- Shows the correct way to use shadow and filled color sparingly
- Uses exact dimensions consistently: `48px` trigger, `256px` panel width, `8px` large radius, `6px` row radius
- Keeps interaction lightweight through small transitions and tonal state changes
- Functions as a utility overlay without looking like a separate design system

## 7. Rules For The Agent

When generating new frontend code for this repo:

- Use `rurikon` tokens before introducing any other color family
- Default to Inter-based text styling with the existing body ramp
- Default to `16px` content padding and `8px` surface radius
- Keep prose pages within the current reading width
- Prefer borders and typography to colored boxes
- Use shadows only for overlays, modals, and floating affordances
- Match existing spacing values exactly instead of approximating them