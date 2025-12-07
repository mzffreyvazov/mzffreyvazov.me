'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type ComponentProps, type MouseEvent } from 'react'

export default function TransitionLink({
  href,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  const router = useRouter()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Only handle left clicks without modifiers
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.defaultPrevented
    ) {
      return
    }

    // Check if href is external
    const url = href.toString()
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return
    }

    // Check if browser supports view transitions
    if (!('startViewTransition' in document)) {
      return
    }

    e.preventDefault()

    // Type cast for View Transition API
    const doc = document as Document & {
      startViewTransition: (callback: () => void) => void
    }

    doc.startViewTransition(() => {
      router.push(url)
    })
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
