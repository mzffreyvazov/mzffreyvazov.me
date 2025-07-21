// app/thoughts/[slug]/page.tsx
import { promises as fs } from 'fs'
import path from 'path'
import React, { Fragment } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import cn from 'clsx'
import TableOfContents from '@/components/table-of-contents'
import MobileTableOfContents from '@/components/mobile-table-of-contents'
import MarkdownRenderer from '@/components/markdown-renderer'
import { parseMarkdown } from '@/lib/markdown'

// Enable ISR with 1 hour revalidation, but can be overridden by on-demand revalidation
export const revalidate = 3600

export default async function Page(props: {
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params
  const articlesDirectory = path.join(process.cwd(), 'app', 'thoughts', '_articles')
  
  // Check if .md file exists first (new format)
  const mdFilePath = path.join(articlesDirectory, `${params.slug}.md`)
  const mdxFilePath = path.join(articlesDirectory, `${params.slug}.mdx`)
  
  let metadata
  let content: React.ReactNode
  
  try {
    // Try to read .md file first
    const fileContent = await fs.readFile(mdFilePath, 'utf8')
    const parsed = parseMarkdown(fileContent)
    metadata = parsed.metadata
    content = <MarkdownRenderer>{parsed.markdownContent}</MarkdownRenderer>
  } catch (mdError) {
    // If .md file doesn't exist, try .mdx file (legacy format)
    try {
      const { default: MDXContent, metadata: mdxMetadata } = await import(
        /* webpackInclude: /\.mdx$/ */
        '../_articles/' + `${params.slug}.mdx`
      )
      metadata = mdxMetadata
      content = <MDXContent />
    } catch (mdxError) {
      // If neither .md nor .mdx file exists, return 404
      notFound()
    }
  }

  return (
    <div className="relative">
      <div
        className={cn(metadata.chinese && 'text-justify font-zh')}
        lang={metadata.chinese ? 'zh-Hans' : 'en'}
      >
        {metadata.tags && metadata.tags.length > 0 && (
          <div className="flex flex-wrap mb-4">
            <span className="text-sm text-rurikon-300 mr-1 self-center">topics:</span>
            {metadata.tags.map((tag: string, index: number) => (
              <Fragment key={tag}>
                {index > 0 && <span className="text-sm text-rurikon-300 mr-1">,</span>}
                <Link 
                  href={`/thoughts?tag=${encodeURIComponent(tag)}`}
                  className="text-sm text-rurikon-500 hover:text-rurikon-700 border-b border-rurikon-200 hover:border-rurikon-400 transition-colors"
                >
                  {tag}
                </Link>
              </Fragment>
            ))}
          </div>
        )}
        {content}
      </div>
      <TableOfContents />
      <MobileTableOfContents />
    </div>
  )
}

export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), 'app', 'thoughts', '_articles')
  const articles = await fs.readdir(articlesDirectory)

  const params = []
  
  for (const name of articles) {
    if (!name.endsWith('.mdx') && !name.endsWith('.md')) continue
    
    let metadata
    
    try {
      if (name.endsWith('.md')) {
        // Handle .md files with YAML frontmatter
        const filePath = path.join(articlesDirectory, name)
        const fileContent = await fs.readFile(filePath, 'utf8')
        const parsed = parseMarkdown(fileContent)
        metadata = parsed.metadata
      } else if (name.endsWith('.mdx')) {
        // Handle .mdx files (legacy format) - only try to import .mdx files
        try {
          const { metadata: mdxMetadata } = await import(
            /* webpackInclude: /\.mdx$/ */
            '../_articles/' + name.replace('.mdx', '.mdx')
          )
          metadata = mdxMetadata
        } catch (error) {
          console.error(`Failed to import ${name}:`, error)
          continue
        }
      }
      
      // Check if the article is hidden
      if (metadata?.hidden === true) continue
      
      params.push({
        params: {
          slug: name.replace(/\.(mdx|md)$/, ''),
        },
      })
    } catch (error) {
      // Skip files that can't be processed (e.g., file was deleted during build)
      console.warn(`Skipping ${name} due to error:`, error)
      continue
    }
  }
  
  return params
}

export async function generateMetadata(props: {
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params
  const articlesDirectory = path.join(process.cwd(), 'app', 'thoughts', '_articles')
  
  try {
    // Check if .md file exists first
    const mdFilePath = path.join(articlesDirectory, `${params.slug}.md`)
    
    try {
      const fileContent = await fs.readFile(mdFilePath, 'utf8')
      const parsed = parseMarkdown(fileContent)
      return {
        title: parsed.metadata.title,
        description: parsed.metadata.description,
      }
    } catch (mdError) {
      // If .md file doesn't exist, try .mdx file
      const metadata = (await import(
        /* webpackInclude: /\.mdx$/ */
        '../_articles/' + `${params.slug}.mdx`
      )).metadata
      return {
        title: metadata.title,
        description: metadata.description,
      }
    }
  } catch (error) {
    // Return default metadata if file doesn't exist
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }
}