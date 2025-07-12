import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import cn from 'clsx'

export default async function Page(props: {
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params
  
  try {
    const { default: MDXContent, metadata } = await import(
      '../_articles/' + `${params.slug}.mdx`
    )

    return (
      <div
        className={cn(metadata.chinese && 'text-justify font-zh')}
        lang={metadata.chinese ? 'zh-Hans' : 'en'}
      >
        {metadata.tags && metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="text-sm text-rurikon-300 mr-0 self-center">topics:</span>
            {metadata.tags.map((tag: string) => (
              <Link 
                key={tag} 
                href={`/thoughts?tag=${encodeURIComponent(tag)}`}
                className="text-sm text-rurikon-500 hover:text-rurikon-700 border-b border-rurikon-200 hover:border-rurikon-400 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        <MDXContent />
      </div>
    )
  } catch (error) {
    // If the article file doesn't exist, show 404
    throw new Error(`Article not found: ${params.slug}`)
  }
}

export async function generateStaticParams() {
  const articles = await fs.readdir(
    path.join(process.cwd(), 'app', 'thoughts', '_articles')
  )

  return articles
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => ({
      params: {
        slug: name.replace(/\.mdx$/, ''),
      },
    }))
}

export async function generateMetadata(props: {
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params
  
  try {
    const metadata = (await import('../_articles/' + `${params.slug}.mdx`))
      .metadata
    return {
      title: metadata.title,
      description: metadata.description,
    }
  } catch (error) {
    // Return default metadata if file doesn't exist
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }
}
