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
  
  const mdFilePath = path.join(articlesDirectory, `${params.slug}.md`)
  
  let metadata
  let content: React.ReactNode
  
  try {
    // Read .md file
    const fileContent = await fs.readFile(mdFilePath, 'utf8')
    const parsed = parseMarkdown(fileContent)
    metadata = parsed.metadata
    content = <MarkdownRenderer>{parsed.markdownContent}</MarkdownRenderer>
  } catch {
    // If .md file doesn't exist, return 404
    notFound()
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
    // Only handle .md files
    if (!name.endsWith('.md')) continue
    
    try {
      const filePath = path.join(articlesDirectory, name)
      const fileContent = await fs.readFile(filePath, 'utf8')
      const parsed = parseMarkdown(fileContent)
      const metadata = parsed.metadata
      
      // Check if the article is hidden
      if (metadata?.hidden === true) continue
      
      params.push({
        params: {
          slug: name.replace(/\.md$/, ''),
        },
      })
    } catch (error) {
      // Skip files that can't be processed
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
    } catch {
      // If .md file doesn't exist, return default metadata
      // Note: MDX files should be migrated to .md format
      return {
        title: params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        description: '',
      }
    }
  } catch {
    // Return default metadata if file doesn't exist
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }
}