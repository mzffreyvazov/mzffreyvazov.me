'use client'

import { useState, useEffect, useRef } from 'react'
import cn from 'clsx'

/**
 * TOC Spacing Control Values:
 * 
 * minSpacing (currently 25): Minimum distance between TOC items
 * - Increase to 18-25 for more breathing room
 * 
 * maxSpacing (currently 45): Maximum distance between TOC items  
 * - Increase to 40-50 for larger sections
 * 
 * baseSpacing (currently 30): Default spacing for average content
 * - Increase to 25-35 for overall more spacious feel
 * 
 * availableHeight - 200: Controls how much viewport height to use
 * - Decrease the 200 to 150 to allow more height for the TOC
 */

// Data structure for a header
interface Header {
  id: string
  text: string
  level: number
  top: number
  contentHeight: number // Add content height for proportional spacing
}

export default function TableOfContents() {
  const [headers, setHeaders] = useState<Header[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const tocRef = useRef<HTMLElement>(null)
  const [progressHeight, setProgressHeight] = useState(0)
  const [tocItemPositions, setTocItemPositions] = useState<number[]>([])
  const [dynamicTopPosition, setDynamicTopPosition] = useState(192) // Default to top-48 (192px)
  const [useDynamicPositioning, setUseDynamicPositioning] = useState(false)

  // Effect to find all headers and calculate content heights
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const headingElements = Array.from(
        document.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6')
      ) as HTMLElement[]

      // Filter out the first h1 (note title) and map remaining headers
      const filteredHeaders = headingElements.filter((el, index) => {
        // Skip the first h1 element
        if (el.tagName === 'H1' && index === 0) {
          return false
        }
        return true
      })

      const mappedHeaders = filteredHeaders
        .map((el, index) => {
          const nextHeader = filteredHeaders[index + 1]
          const contentHeight = nextHeader 
            ? nextHeader.offsetTop - el.offsetTop
            : Math.max(200, document.body.scrollHeight - el.offsetTop) // Default height for last section

          // Adjust level mapping: h2 -> 1, h3 -> 2, h4 -> 3, etc.
          const originalLevel = Number(el.tagName.substring(1))
          const adjustedLevel = originalLevel - 1

          return {
            id: el.id,
            text: el.innerText,
            level: adjustedLevel,
            top: el.offsetTop,
            contentHeight,
          }
        })
        .filter((h) => h.id && h.text.trim())

      setHeaders(mappedHeaders)
    }, 100)
    
    return () => clearTimeout(timeoutId)
  }, [])

  // Calculate TOC item positions after headers are set and DOM is ready
  useEffect(() => {
    if (headers.length === 0 || !tocRef.current) return

    const calculateTocPositions = () => {
      const positions: number[] = []
      let currentY = 8 // Starting position (top padding)

      // Get available viewport height for TOC
      const viewportHeight = window.innerHeight
      const availableHeight = viewportHeight - 200 // Account for sticky positioning and margins
      const totalItems = headers.length
      
      // Calculate maximum allowed spacing to fit all items
      const maxAllowedSpacing = totalItems > 1 ? (availableHeight - 40) / (totalItems - 1) : 40
      
      // First pass: calculate raw proportional heights
      const rawHeights = headers.map(header => header.contentHeight)
      const minContentHeight = Math.min(...rawHeights)
      const maxContentHeight = Math.max(...rawHeights)
      
      // Much more compact spacing ranges
      const minSpacing = Math.min(25, maxAllowedSpacing * 0.6)
      const maxSpacing = Math.min(45, maxAllowedSpacing)
      const baseSpacing = Math.min(30, maxAllowedSpacing * 0.8)
      
      headers.forEach((header, index) => {
        positions.push(currentY)
        
        if (index < headers.length - 1) {
          // Normalize content height to 0-1 range
          const normalizedHeight = maxContentHeight === minContentHeight 
            ? 0.5 
            : (header.contentHeight - minContentHeight) / (maxContentHeight - minContentHeight)
          
          // Apply stronger dampening to keep spacing more uniform
          const dampened = Math.pow(normalizedHeight, 0.8)
          
          // Calculate final spacing
          const proportionalHeight = baseSpacing + (dampened * (maxSpacing - minSpacing))
          const finalSpacing = Math.max(minSpacing, Math.min(maxSpacing, proportionalHeight))
          
          currentY += finalSpacing
        }
      })

      setTocItemPositions(positions)

      // Calculate total TOC content height
      const totalTocContentHeight = positions.length > 0 
        ? (positions[positions.length - 1] - positions[0] + 32) // Add padding for first and last items
        : 40

      // Define height threshold - use dynamic positioning if TOC is too tall
      const heightThreshold = viewportHeight * 0.6 // 60% of viewport height
      const shouldUseDynamic = totalTocContentHeight > heightThreshold

      setUseDynamicPositioning(shouldUseDynamic)

      if (shouldUseDynamic) {
        // Calculate optimal top position to center the TOC content
        const minTopMargin = 120 // Minimum distance from top of viewport
        const bottomMargin = 80 // Minimum distance from bottom of viewport
        const centerPoint = viewportHeight / 2
        const idealTopPosition = centerPoint - (totalTocContentHeight / 2)
        
        // Apply constraints with more balanced bounds
        const minTopPosition = minTopMargin
        const maxTopPosition = viewportHeight - totalTocContentHeight - bottomMargin
        
        // Ensure we don't go below minimum or above maximum
        const balancedTopPosition = Math.max(
          minTopPosition,
          Math.min(maxTopPosition, idealTopPosition)
        )

        setDynamicTopPosition(balancedTopPosition)
      } else {
        // Use original fixed positioning
        setDynamicTopPosition(192) // top-48 equivalent
      }
    }

    // Use a small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(calculateTocPositions, 50)
    
    // Recalculate on window resize
    const handleResize = () => {
      setTimeout(calculateTocPositions, 100)
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [headers])

  // Handle scroll events for active state and progress
  useEffect(() => {
    if (headers.length === 0 || tocItemPositions.length === 0) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const topOffset = 150
      let currentActiveId: string | null = null
      let activeIndex = -1

      // Find the current active header
      for (let i = headers.length - 1; i >= 0; i--) {
        if (scrollY >= headers[i].top - topOffset) {
          currentActiveId = headers[i].id
          activeIndex = i
          break
        }
      }

      // If we're near the bottom of the document, mark the last header as active
      const documentHeight = document.body.scrollHeight
      const viewportHeight = window.innerHeight
      const scrollBottom = scrollY + viewportHeight
      
      if (scrollBottom >= documentHeight - 100 && headers.length > 0) {
        currentActiveId = headers[headers.length - 1].id
        activeIndex = headers.length - 1
      }

      setActiveId(currentActiveId)

      // Calculate progress height based on scroll position within the active section
      if (activeIndex !== -1) {
        const currentHeader = headers[activeIndex]
        const nextHeader = headers[activeIndex + 1]
        
        // Calculate progress within the current section
        let sectionProgress
        if (nextHeader) {
          sectionProgress = Math.min(1, Math.max(0, (scrollY - currentHeader.top + topOffset) / (nextHeader.top - currentHeader.top)))
        } else {
          // For the last section, calculate progress based on remaining document height
          const maxScroll = documentHeight - viewportHeight
          const remainingScroll = maxScroll - currentHeader.top + topOffset
          sectionProgress = remainingScroll > 0 
            ? Math.min(1, Math.max(0, (scrollY - currentHeader.top + topOffset) / remainingScroll))
            : 1
        }

        // Calculate the height up to the current position
        const baseHeight = tocItemPositions[activeIndex] + 10 // Position of current dot + dot radius
        
        if (nextHeader) {
          // Normal case: progress to next section
          const additionalHeight = (tocItemPositions[activeIndex + 1] - tocItemPositions[activeIndex]) * sectionProgress
          setProgressHeight(baseHeight + additionalHeight)
        } else {
          // Last section: extend progress beyond the last dot
          const lastDotHeight = 14 // Changed from 4 to 8 to account for the new timeline positioning
          const additionalHeight = lastDotHeight * sectionProgress
          setProgressHeight(baseHeight + additionalHeight)
        }
      } else {
        setProgressHeight(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Call once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [headers, tocItemPositions])

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
  }

  if (headers.length < 3) {
    return null
  }

  const activeIndex = headers.findIndex(h => h.id === activeId)

  return (
    <aside className="absolute top-0 left-full h-full hidden lg:block">
      <div 
        className={cn("sticky ml-46 w-64", !useDynamicPositioning && "top-48")}
        style={useDynamicPositioning ? { top: `${dynamicTopPosition}px` } : undefined}
      >
        <nav ref={tocRef} className="relative">
          {/* Background timeline track */}
          <div
            className="absolute left-[3.5px] w-px bg-rurikon-100"
            style={{ 
              top: `${(tocItemPositions[0] || 8) - 4}px`,
              height: `${tocItemPositions.length > 0 ? (tocItemPositions[tocItemPositions.length - 1] - tocItemPositions[0] + 12) : 8}px`
            }}
            aria-hidden="true"
          />
          
          {/* Active progress timeline */}
          <div
            className="absolute left-[3.5px] w-px bg-rurikon-800"
            style={{ 
              top: `${(tocItemPositions[0] || 8) - 4}px`,
              height: `${progressHeight - (tocItemPositions[0] || 8) + 4}px`
            }}
            aria-hidden="true"
          />
          
          <ul className="relative">
            {headers.map((header, index) => {
              const isPassedOrActive = activeIndex !== -1 && index <= activeIndex
              const itemTop = tocItemPositions[index] || 0

              return (
                <li
                  key={header.id}
                  data-id={header.id}
                  className="absolute"
                  style={{ top: `${itemTop}px` }}
                >
                  <a
                    href={`#${header.id}`}
                    onClick={(e) => handleLinkClick(e, header.id)}
                    className="group flex h-5 items-center text-sm"
                  >
                    <div
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full border-2 transition-all',
                        isPassedOrActive
                          ? 'border-rurikon-800 bg-rurikon-800'
                          : 'border-rurikon-200 bg-[#fcfcfc] group-hover:border-rurikon-400'
                      )}
                      style={{ left: 0 }}
                    />

                    <span
                      className={cn(
                        'font-sans',
                        'truncate transition-colors whitespace-nowrap',
                        activeId === header.id
                          ? 'text-rurikon-800 font-semibold'
                          : 'text-rurikon-400 group-hover:text-rurikon-700'
                      )}
                      style={{
                        paddingLeft: `${1.8 + (header.level - 1) * 1.25}rem`, // Increase base spacing from 0.5 to 1.5 for better timeline separation
                      }}
                    >
                      {header.text}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}