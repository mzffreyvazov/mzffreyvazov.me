---
title: 'Shortcodes Demo - Markdown with Interactive Components'
date: '2025.07.21'
description: 'Demonstration of using shortcodes to embed React components in Markdown'
tags:
  - demo
  - shortcodes
  - markdown
hidden: true
---

# Shortcodes Demo - Markdown with Interactive Components

This article demonstrates how you can use standard Markdown with YAML frontmatter while still embedding interactive React components using shortcodes.

## Regular Markdown Works Great

All standard Markdown features work perfectly:

- **Bold text** and *italic text*
- [Links to external sites](https://example.com)
- `inline code` and code blocks
- Lists, quotes, and more

```javascript
// Code blocks work perfectly
function hello() {
  console.log("Hello from Markdown!");
}
```

## Interactive Components via Shortcodes

Now here's the magic - you can embed React components using directive syntax:

:::alert{type="info"}
This is an info alert. You can include **bold text** and other Markdown inside.
:::

:::alert{type="warning"}
This is a warning alert. These shortcodes are perfect for when you want to add interactive elements to your Obsidian notes.
:::

:::alert{type="error"}
Error alerts help highlight important issues or mistakes to avoid.
:::

:::alert{type="success"}
Success alerts are great for highlighting achievements or positive outcomes!
:::

## Video Embeds

You can also embed YouTube videos:

::youtube{id="dQw4w9WgXcQ"}

## Benefits of This Approach

1. **Obsidian Compatible**: Write in standard Markdown with YAML frontmatter
2. **Version Control Friendly**: No weird export formats
3. **Interactive Elements**: Still embed React components where needed
4. **Portable**: Your content works in any Markdown editor
5. **Flexible**: Easy to extend with new shortcode components

## Blockquotes Still Work

> This is a regular blockquote. All your standard Markdown formatting continues to work seamlessly alongside the interactive components.

## Conclusion

This system gives you the best of both worlds: the simplicity and portability of Markdown, combined with the power of React components when you need them.
