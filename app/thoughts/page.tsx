import ThoughtsListWithSearch from '@/components/thoughts-list-with-search'
import { getAllArticles } from '@/lib/articles'

// Enable ISR with 1 hour revalidation, but can be overridden by on-demand revalidation
export const revalidate = 3600

export const metadata = {
  title: 'Thoughts',
}

export default async function Page() {
  const items = await getAllArticles()

  return (
    <div>
      <ThoughtsListWithSearch items={items} />
    </div>
  )
}
