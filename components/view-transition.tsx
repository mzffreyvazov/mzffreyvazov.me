'use client'

import { type ReactNode } from 'react'

interface ViewTransitionProps {
  name?: string
  children: ReactNode
}

export default function ViewTransition({ name = 'crossfade', children }: ViewTransitionProps) {
  return (
    <div style={{ viewTransitionName: name } as React.CSSProperties}>
      {children}
    </div>
  )
}
