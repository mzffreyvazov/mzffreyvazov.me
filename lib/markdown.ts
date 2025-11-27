// lib/markdown.ts
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkDirective from 'remark-directive'
import { remark } from 'remark'
import { ReactElement } from 'react'
import React from 'react'

// Shortcode component mapping
export interface ShortcodeComponents {
  [key: string]: React.ComponentType<any>
}

// Parse markdown content with YAML frontmatter
export function parseMarkdown(content: string) {
  const { data: metadata, content: markdownContent } = matter(content)
  
  // Remove the first h1 heading if it exists (since we display title from frontmatter)
  // Trim first to handle any leading whitespace after frontmatter
  const trimmedContent = markdownContent.trim()
  const contentWithoutFirstH1 = trimmedContent.replace(/^#\s+.+(\r?\n)+/, '')
  
  return { metadata, markdownContent: contentWithoutFirstH1 }
}

// Transform directive nodes to JSX
function transformDirectives() {
  return (tree: any) => {
    const { visit } = require('unist-util-visit')
    
    visit(tree, ['textDirective', 'leafDirective', 'containerDirective'], (node: any) => {
      if (node.type === 'textDirective' || node.type === 'leafDirective') {
        // Transform ::alert{type="warning"} to <Alert type="warning" />
        const data = node.data || (node.data = {})
        const hName = node.name
        const hProperties = node.attributes || {}
        
        data.hName = hName
        data.hProperties = hProperties
      } else if (node.type === 'containerDirective') {
        // Transform :::alert{type="info"} ... ::: to <Alert type="info">...</Alert>
        const data = node.data || (node.data = {})
        const hName = node.name
        const hProperties = node.attributes || {}
        
        data.hName = hName
        data.hProperties = hProperties
      }
    })
  }
}

// Process markdown with shortcodes
export async function processMarkdownWithShortcodes(
  markdownContent: string, 
  shortcodes: ShortcodeComponents = {}
) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(transformDirectives)
  
  const ast = processor.parse(markdownContent)
  const transformedAst = await processor.run(ast)
  
  return { ast: transformedAst, shortcodes }
}

// Metadata type definition
export interface ArticleMetadata {
  title: string
  date?: string
  description?: string
  tags?: string[]
  hidden?: boolean
  chinese?: boolean
}
