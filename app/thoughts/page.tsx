import { promises as fs } from 'fs'
import path from 'path'
import ThoughtsListWithSearch from '@/components/thoughts-list-with-search'

export const metadata = {
  title: 'Thoughts',
}

// In the future we can have a pagination here e.g. /1/*.mdx
const articlesDirectory = path.join(
  process.cwd(),
  'app',
  'thoughts',
  '_articles'
)

export default async function Page() {
  const articles = await fs.readdir(articlesDirectory)

  const items = []
  for (const article of articles) {
    if (!article.endsWith('.mdx')) continue
    const module = await import('./_articles/' + article)

    if (!module.metadata) throw new Error('Missing `metadata` in ' + article)

    // Skip hidden articles
    if (module.metadata.hidden === true) continue

    items.push({
      slug: article.replace(/\.mdx$/, ''),
      title: module.metadata.title,
      date: module.metadata.date || '-',
      description: module.metadata.description || '',
      tags: module.metadata.tags || [],
      sort: Number(module.metadata.date?.replaceAll('.', '') || 0),
      hidden: module.metadata.hidden || false
    })
  }
  items.sort((a, b) => b.sort - a.sort)

  return (
    <div>
      <ThoughtsListWithSearch items={items} />
    </div>
  )
}
