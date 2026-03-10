import React, { Fragment } from 'react'
import Link from '@/components/transition-link'
import { notFound } from 'next/navigation'
import cn from 'clsx'
import TocFloatingButton from '@/components/toc-floating-button'
import MarkdownRenderer from '@/components/markdown-renderer'
import PortableTextRenderer from '@/components/portable-text-renderer'
import { getAllArticleSlugs, getArticleBySlug } from '@/lib/articles'

// Enable ISR with 1 hour revalidation, but can be overridden by on-demand revalidation
export const revalidate = 3600

export default async function Page(props: {
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="relative">
      <div
        className={cn(article.chinese && 'text-justify font-zh')}
        lang={article.chinese ? 'zh-Hans' : 'en'}
      >
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="font-bold text-2xl text-rurikon-700 text-balance">
            {article.title}
          </h1>
          
          {/* Metadata section */}
          <div className="mt-3 space-y-1 text-sm">
            {article.description && (
              <p className="text-rurikon-400 italic">
                {article.description}
              </p>
            )}
            
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap">
                <span className="text-rurikon-300 mr-1 self-center">topics:</span>
                {article.tags.map((tag: string, index: number) => (
                  <Fragment key={tag}>
                    {index > 0 && <span className="text-rurikon-300 mr-1">,</span>}
                    <Link 
                      href={`/thoughts?tag=${encodeURIComponent(tag)}`}
                      className="text-rurikon-500 hover:text-rurikon-700 border-b border-rurikon-200 hover:border-rurikon-400 transition-colors"
                    >
                      {tag}
                    </Link>
                  </Fragment>
                ))}
              </div>
            )}
            
            {article.date && (
              <p className="text-rurikon-300">
                {article.date}
              </p>
            )}
          </div>
        </header>
        
        {article.body.kind === 'markdown' ? (
          <MarkdownRenderer>{article.body.markdown}</MarkdownRenderer>
        ) : (
          <PortableTextRenderer value={article.body.content} />
        )}
      </div>
      <TocFloatingButton />
    </div>
  )
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata(props: {
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }

  return {
    title: article.title,
    description: article.description,
  }
}