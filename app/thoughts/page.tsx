import { promises as fs } from 'fs'
import path from 'path'
import { parseMarkdown } from '@/lib/markdown'
import ThoughtsListWithSearch from '@/components/thoughts-list-with-search'

export const metadata = {
  title: 'Thoughts',
}

// Directory containing both .mdx and .md articles
const articlesDirectory = path.join(
  process.cwd(),
  'app',
  'thoughts',
  '_articles'
)

export default async function Page() {
  const articles = await fs.readdir(articlesDirectory)

  const items = []
  const processedSlugs = new Set() // Track processed slugs to avoid duplicates

  for (const article of articles) {
    let metadata
    const slug = article.replace(/\.(mdx|md)$/, '')

    // Skip if we already processed this slug
    if (processedSlugs.has(slug)) continue

    // Prefer .md files over .mdx files (new format over legacy)
    const mdFile = `${slug}.md`
    const mdxFile = `${slug}.mdx`
    
    if (articles.includes(mdFile)) {
      // Handle Markdown files with YAML frontmatter (new format)
      const filePath = path.join(articlesDirectory, mdFile)
      const fileContent = await fs.readFile(filePath, 'utf8')
      const parsed = parseMarkdown(fileContent)
      metadata = parsed.metadata
      processedSlugs.add(slug)
    } else if (articles.includes(mdxFile)) {
      // Handle MDX files (legacy format) - only import .mdx files
      const module = await import(
        /* webpackInclude: /\.mdx$/ */
        `./_articles/${mdxFile}`
      )
      if (!module.metadata) throw new Error('Missing `metadata` in ' + mdxFile)
      metadata = module.metadata
      processedSlugs.add(slug)
    } else {
      continue // Skip non-markdown files
    }

    // Skip hidden articles
    if (metadata.hidden === true) continue

    items.push({
      slug,
      title: metadata.title,
      date: metadata.date || '-',
      description: metadata.description || '',
      tags: metadata.tags || [],
      sort: Number(metadata.date?.replaceAll('.', '') || 0),
      hidden: metadata.hidden || false
    })
  }
  items.sort((a, b) => b.sort - a.sort)

  return (
    <div>
      <ThoughtsListWithSearch items={items} />
    </div>
  )
}
