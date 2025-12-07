'use client'

import { useState, useRef, useEffect } from 'react'
import Link from '@/components/transition-link'

interface Article {
  slug: string
  title: string
  date: string
  description: string
  sort: number
  tags?: string[]
  hidden?: boolean
}

interface ThoughtsSearchProps {
  articles: Article[]
}

export default function ThoughtsSearch({ articles }: ThoughtsSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Focus search on Ctrl+K or Cmd+K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
      // Clear search on Escape
      if (event.key === 'Escape') {
        setSearchQuery('')
        searchInputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredArticles = articles.filter((article) => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      article.title.toLowerCase().includes(searchTerm) ||
      article.description.toLowerCase().includes(searchTerm) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  })

  return (
    <div>
      <div className="mb-8 relative border-b pb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="search muzeffer's thoughts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-none focus:outline-none focus:ring-0 bg-transparent text-gray-700 placeholder-gray-400 text-sm"
        />
      </div>
      
      <div className="space-y-10">
        {filteredArticles.map((item) => (
          <div key={item.slug} className="group">
            <Link
              href={`/thoughts/${item.slug}`}
              className="block"
              draggable={false}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-800">
                  {item.title}
                </h3>
                <time className="text-gray-400 text-sm">
                  {item.date}
                </time>
              </div>
              
              {item.tags && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {item.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>
      
      {filteredArticles.length === 0 && searchQuery && (
        <div className="text-center py-8 text-gray-400">
          No articles found matching "{searchQuery}"
        </div>
      )}
    </div>
  )
}
