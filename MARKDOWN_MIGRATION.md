# Blog Migration to Markdown with YAML Frontmatter

## Overview

Your blog has been successfully migrated to support standard Markdown files with YAML frontmatter, making it fully compatible with Obsidian and other Markdown editors. The system now supports both the old MDX format and the new Markdown format simultaneously.

## New Features

### 1. YAML Frontmatter Support
Instead of using JavaScript exports, you can now use YAML frontmatter at the top of your files:

```markdown
---
title: 'Your Article Title'
date: '2025.07.21'
description: 'Article description'
tags: ['tag1', 'tag2']
hidden: false
---

# Your Article Title

Your content here...
```

### 2. Standard Markdown Format
- Files use `.md` extension instead of `.mdx`
- Standard Markdown syntax throughout
- Compatible with Obsidian, GitHub, and other Markdown editors

### 3. React Components Support (Future)
The foundation has been laid for shortcode support, which will allow you to embed React components using a directive syntax like:

```markdown
:::alert{type="warning"}
This is a warning message
:::

::youtube{id="VIDEO_ID"}
```

## File Structure Changes

### Articles Directory
- Old: Only `.mdx` files supported
- New: Both `.mdx` and `.md` files supported
- Migration path: Gradually convert `.mdx` files to `.md` files

### Converted Files
1. `ielts-mini-course.md` - Converted from MDX to Markdown with YAML frontmatter
2. `adlerian-trauma.md` - Converted from MDX to Markdown with YAML frontmatter  
3. `shortcodes-example.md` - Example of new Markdown format

## Implementation Details

### New Components
- `lib/markdown.ts` - Utilities for parsing Markdown with YAML frontmatter
- `components/markdown-renderer.tsx` - React component for rendering Markdown content

### Updated Pages
- `app/thoughts/page.tsx` - Now handles both `.mdx` and `.md` files
- `app/thoughts/[slug]/page.tsx` - Detects file type and renders accordingly

### Package Dependencies
Added packages for Markdown processing:
- `gray-matter` - YAML frontmatter parsing
- `react-markdown` - Markdown to React component conversion
- `remark` and related packages - Markdown processing pipeline

## Workflow

### For Obsidian Writing
1. Create new `.md` files in `app/thoughts/_articles/`
2. Use YAML frontmatter for metadata
3. Write in standard Markdown
4. Push to repository
5. Blog automatically renders the new content

### Existing MDX Files
- Continue to work as before
- Can be gradually migrated to Markdown format
- Both formats work simultaneously

## Metadata Schema

```yaml
---
title: 'Required: Article title'
date: '2025.07.21'  # Format: YYYY.MM.DD
description: 'Optional: Meta description'
tags: ['tag1', 'tag2']  # Optional: Array of tags
hidden: false  # Optional: Hide from listing (default: false)
chinese: false  # Optional: Chinese language flag (default: false)
---
```

## Supported Markdown Features

### Standard Elements
- Headers (H1-H6) with auto-generated IDs
- Paragraphs with proper spacing
- **Bold** and *italic* text
- Links (internal and external)
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Inline code
- Blockquotes
- Horizontal rules
- Images (processed through Next.js Image component)

### Custom Styling
All elements use your existing Tailwind CSS classes and maintain the same visual appearance as the MDX version.

## Future Enhancements

### Planned Shortcodes
- Alert boxes (`:::alert{type="info"}`)
- YouTube embeds (`::youtube{id="VIDEO_ID"}`)
- Callout blocks (`:::callout`)
- Tweet embeds
- Image galleries
- Math expressions (already supported via KaTeX)

### Obsidian Integration
- Wikilink support for internal references
- Tag autocompletion
- Template snippets for new articles
- Live preview of how articles will look on the website

## Migration Guide

### Converting Existing MDX to Markdown

1. **Change the metadata format:**
   ```diff
   - export const metadata = {
   -   title: 'Article Title',
   -   date: '2025.07.21',
   -   tags: ['tag1']
   - }
   + ---
   + title: 'Article Title'
   + date: '2025.07.21'
   + tags: ['tag1']
   + ---
   ```

2. **Remove MDX-specific imports:**
   ```diff
   - import { Component } from '@/components/component'
   ```

3. **Convert JSX to Markdown or shortcodes:**
   ```diff
   - <Component prop="value">Content</Component>
   + :::component{prop="value"}
   + Content
   + :::
   ```

4. **Rename file extension:**
   ```
   article.mdx → article.md
   ```

## Testing

To test your new Markdown articles:

1. Start the development server: `pnpm dev`
2. Navigate to `/thoughts` to see the article list
3. Click on any converted article to verify rendering
4. Check that both MDX and Markdown articles appear correctly

The system is backward compatible, so your existing MDX articles will continue to work while you gradually migrate to the new Markdown format.
