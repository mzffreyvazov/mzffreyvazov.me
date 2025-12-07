'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from '@/components/transition-link'
import SearchBar from '@/components/search-bar'

interface SearchItem {
  slug: string
  title: string
  date: string
  description?: string
  tags?: string[]
  sort: number
  hidden?: boolean
}

interface SearchBarWrapperProps {
  items: SearchItem[]
}

// Create a client component that uses useSearchParams
function ThoughtsListContent({ items }: SearchBarWrapperProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tagParam = searchParams.get('tag')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>(items)
  
  useEffect(() => {
    if (tagParam) {
      filterByTag(tagParam)
    } else {
      handleSearch(searchQuery)
    }
  }, [tagParam, items])
  
  const filterByTag = (tag: string) => {
    setSearchQuery('')
    const filtered = items.filter((item: SearchItem) => 
      item.tags && item.tags.includes(tag)
    )
    setFilteredItems(filtered)
  }
  
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (!query && !tagParam) {
      setFilteredItems(items)
      return
    }
    
    // Check if the search is a tag-specific search
    if (query.toLowerCase().startsWith('topic:')) {
      const tagQuery = query.substring(6).trim().toLowerCase()
      if (tagQuery) {
        const filtered = items.filter((item: SearchItem) => 
          item.tags && item.tags.some(tag => tag.toLowerCase().includes(tagQuery))
        )
        setFilteredItems(filtered)
      } else {
        setFilteredItems(items)
      }
      return
    }
    
    // Regular search - don't include tag search here
    const searchTerm = query.toLowerCase()
    const filtered = items.filter((item: SearchItem) => 
      item.title.toLowerCase().includes(searchTerm) || 
      (item.description && item.description.toLowerCase().includes(searchTerm))
    )
    setFilteredItems(filtered)
  }
  
  const clearTagFilter = () => {
    router.push('/thoughts')
  }

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      
      {tagParam && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-rurikon-400">Filtered by topics:</span>
          <span className="text-xs text-rurikon-500 border-b border-rurikon-200">
            {tagParam}
          </span>
          {/* <button 
            onClick={clearTagFilter}
            className="text-xs text-rurikon-400 hover:text-rurikon-600 ml-2"
          >
          </button> */}
        </div>
      )}
      
      {searchQuery.toLowerCase().startsWith('topic:') && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-rurikon-400">Searching by topic:</span>
          <span className="text-xs text-rurikon-500 border-b border-rurikon-200">
            {searchQuery.substring(6).trim()}
          </span>
        </div>
      )}
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-8 text-rurikon-200">
          No articles found.
        </div>
      ) : (
        <ul>
          {filteredItems.map((item: SearchItem) => (
            <li key={item.slug} className='font-medium'>
              <Link
                href={`/thoughts/${item.slug}`}
                className='group flex gap-1 justify-between items-center'
                draggable={false}
              >
                <span className='block text-rurikon-500 group-hover:text-rurikon-700'>
                  {item.title}
                </span>
                <span className='text-sm dot-leaders flex-1 text-rurikon-100 font-normal group-hover:text-rurikon-500 transition-colors group-hover:transition-none leading-none' />
                <time className='block text-rurikon-200 tabular-nums font-normal tracking-tighter group-hover:text-rurikon-500 transition-colors group-hover:transition-none self-start'>
                  {item.date}
                </time>
              </Link>
              {/* {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {item.tags.map((tag) => (
                    <Link 
                      key={tag} 
                      href={`/thoughts?tag=${encodeURIComponent(tag)}`}
                      className="px-2 py-0.5 text-xs bg-rurikon-50 text-rurikon-400 rounded-md hover:bg-rurikon-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )} */}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

// Export a wrapper component that uses Suspense
export default function SearchBarWrapper({ items }: SearchBarWrapperProps) {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading thoughts...</div>}>
      <ThoughtsListContent items={items} />
    </Suspense>
  )
}
