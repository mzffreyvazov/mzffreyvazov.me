'use client'

import { useState, useEffect } from 'react'
import cn from 'clsx'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

interface Header {
  id: string
  text: string
  level: number
  top: number
}

export default function MobileTableOfContents() {
  const [headers, setHeaders] = useState<Header[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Effect to find all headers
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const headingElements = Array.from(
        document.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6')
      ) as HTMLElement[]

      // Filter out the first h1 (note title) and map remaining headers
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

      // Find the current active header
      for (let i = headers.length - 1; i >= 0; i--) {
        if (scrollY >= headers[i].top - topOffset) {
          currentActiveId = headers[i].id
          break
        }
      }

      // If we're near the bottom of the document, mark the last header as active
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

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault()
    const targetElement = document.getElementById(id)
    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - 100
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      window.history.pushState(null, '', `#${id}`)
    }
    setIsOpen(false) // Close the panel after clicking
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  // Don't render if there are fewer than 3 headers
  if (headers.length < 3) {
    return null
  }

  return (
    <>
      {/* Floating button - only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 lg:hidden bg-white border border-rurikon-200 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:border-rurikon-300"
        aria-label="Open table of contents"
      >
        <Bars3Icon className="w-5 h-5 text-rurikon-600" />
      </button>

      {/* Overlay and slide-up panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={handleOverlayClick}
        >
          {/* Backdrop */}
          <div 
            className={cn(
              "absolute inset-0 bg-black transition-opacity duration-300",
              isOpen ? "opacity-25" : "opacity-0"
            )}
          />
          
          {/* Slide-up panel */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-white border-t border-rurikon-200 rounded-t-2xl transition-transform duration-300 ease-out transform font-sans",
              isOpen ? "translate-y-0" : "translate-y-full"
            )}
            style={{ 
              maxHeight: '70vh',
              fontVariationSettings: '"wght" 500, "opsz" 32',
              fontFeatureSettings: '"cpsp" 1, "cv01", "cv03", "cv04", "calt", "ss03", "liga", "ordn"'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-rurikon-100">
              <h3 className="text-base font-semibold text-rurikon-800">
                Contents
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-rurikon-50 transition-colors"
                aria-label="Close table of contents"
              >
                <XMarkIcon className="w-5 h-5 text-rurikon-500" />
              </button>
            </div>

            {/* TOC Content */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 73px)' }}>
              <nav className="p-4">
                <ul className="space-y-2">
                  {headers.map((header) => (
                    <li key={header.id}>
                      <a
                        href={`#${header.id}`}
                        onClick={(e) => handleLinkClick(e, header.id)}
                        className={cn(
                          'block py-2 px-3 rounded-lg text-sm transition-all duration-150 relative',
                          'hover:bg-rurikon-50',
                          activeId === header.id
                            ? 'text-rurikon-800 font-bold bg-rurikon-50'
                            : 'text-rurikon-500 hover:text-rurikon-700 font-semibold'
                        )}
                        style={{
                          paddingLeft: `${0.75 + (header.level - 1) * 0.75}rem`,
                          fontFamily: 'var(--sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                          fontFeatureSettings: '"cpsp" 1, "cv01", "cv03", "cv04", "calt", "ss03", "liga", "ordn"',
                          fontVariationSettings: activeId === header.id 
                            ? '"wght" 640, "opsz" 32'
                            : '"wght" 485, "opsz" 32',
                          fontOpticalSizing: 'auto',
                          letterSpacing: '0.0085em',
                          wordSpacing: '-0.04em'
                        }}
                      >
                        {activeId === header.id && (
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-0 bg-rurikon-600"
                            style={{
                              borderRadius: '0.5rem 0 0 0.5rem'
                            }}
                          />
                        )}
                        {header.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}