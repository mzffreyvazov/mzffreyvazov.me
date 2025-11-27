'use client'

import { useState, useEffect } from 'react'
import cn from 'clsx'

interface Header {
  id: string
  text: string
  level: number
  top: number
}

export default function TocFloatingButton() {
  const [headers, setHeaders] = useState<Header[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Effect to find all headers
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const headingElements = Array.from(
        document.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6')
      ) as HTMLElement[]

      // Filter out the first h1 (title) and map remaining headers
      const filteredHeaders = headingElements.filter((el, index) => {
        if (el.tagName === 'H1' && index === 0) {
          return false
        }
        return true
      })

      const mappedHeaders = filteredHeaders
        .map((el) => {
          const originalLevel = Number(el.tagName.substring(1))
          const adjustedLevel = originalLevel - 1

          return {
            id: el.id,
            text: el.innerText,
            level: adjustedLevel,
            top: el.offsetTop,
          }
        })
        .filter((h) => h.id && h.text.trim())

      setHeaders(mappedHeaders)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [])

  // Handle scroll events for active state
  useEffect(() => {
    if (headers.length === 0) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const topOffset = 150
      let currentActiveId: string | null = null

      for (let i = headers.length - 1; i >= 0; i--) {
        if (scrollY >= headers[i].top - topOffset) {
          currentActiveId = headers[i].id
          break
        }
      }

      const documentHeight = document.body.scrollHeight
      const viewportHeight = window.innerHeight
      const scrollBottom = scrollY + viewportHeight

      if (scrollBottom >= documentHeight - 100 && headers.length > 0) {
        currentActiveId = headers[headers.length - 1].id
      }

      setActiveId(currentActiveId)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [headers])

  const handleItemClick = (id: string) => {
    const targetElement = document.getElementById(id)
    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - 100
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      window.history.pushState(null, '', `#${id}`)
    }
    setIsOpen(false)
  }

  // Don't render if there are fewer than 3 headers
  if (headers.length < 3) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating ToC Panel */}
      <div
        className={cn(
          'fixed bottom-20 right-4 z-50 w-64',
          'rounded-lg border border-rurikon-200 bg-white shadow-lg',
          'transition-all duration-200 ease-out',
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        style={{ fontFamily: 'var(--sans), system-ui, sans-serif', fontStyle: 'normal' }}
      >
        <div className="p-3 border-b border-rurikon-100">
          <span className="text-xs font-semibold uppercase text-rurikon-500 tracking-wide">
            On this page
          </span>
        </div>
        <nav 
          className="toc-nav p-2 max-h-64 overflow-y-auto"
        >
          {headers.map((header) => {
            const isActive = activeId === header.id
            return (
              <button
                key={header.id}
                onClick={() => handleItemClick(header.id)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-md text-sm not-italic leading-relaxed',
                  'transition-colors duration-150',
                  isActive
                    ? 'bg-rurikon-50 text-rurikon-500 font-semibold'
                    : 'text-rurikon-500 font-normal hover:bg-rurikon-50/50 hover:text-rurikon-600'
                )}
                style={{
                  paddingLeft: `${0.75 + (header.level - 1) * 0.5}rem`,
                }}
              >
                {header.text}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-4 right-4 z-50',
          'flex items-center justify-center',
          'h-12 w-12 rounded-full',
          'bg-rurikon-700 text-white',
          'shadow-lg',
          'transition-transform duration-200',
          'hover:scale-105 active:scale-95'
        )}
        aria-label={isOpen ? 'Close table of contents' : 'Open table of contents'}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </button>
    </>
  )
}
