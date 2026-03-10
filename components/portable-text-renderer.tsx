'use client'

import type { ReactNode } from 'react'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Link from '@/components/transition-link'
import { ClickableImage } from '@/components/clickable-image'
import type { PortableTextContent, PortableTextImageBlock } from '@/lib/articles'
import { urlFor } from '@/lib/sanity/image'

function flattenText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flattenText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return flattenText((node as { props?: { children?: ReactNode } }).props?.children)
  }
  return ''
}

function slugify(node: ReactNode) {
  return flattenText(node)
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-4 leading-relaxed text-rurikon-500">{children}</p>,
    h2: ({ children }) => (
      <h2
        id={slugify(children)}
        className="font-semibold text-xl mt-12 mb-3 text-rurikon-600 text-balance"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={slugify(children)}
        className="font-semibold text-lg mt-10 mb-2 text-rurikon-600 text-balance"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        id={slugify(children)}
        className="font-semibold text-base mt-8 mb-2 text-rurikon-600 text-balance"
      >
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="pl-6 -ml-6 sm:pl-10 sm:-ml-10 md:pl-14 md:-ml-14 not-mobile:text-rurikon-400">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-2 space-y-2 list-disc list-outside marker:text-rurikon-200 pl-5 [&_ul]:mb-4 [&_ol]:mb-3">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-2 space-y-2 list-decimal list-outside marker:text-rurikon-200 pl-5 [&_ul]:mb-4 [&_ol]:mb-3">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '#'

      return (
        <Link
          className="break-words decoration-from-font underline underline-offset-2 decoration-rurikon-300 hover:decoration-rurikon-600 focus:outline-none focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-opacity-50 focus-visible:ring-offset-2"
          href={href}
          draggable={false}
          {...(href.startsWith('https://')
            ? {
                target: '_blank',
                rel: 'noopener noreferrer',
              }
            : {})}
        >
          {children}
        </Link>
      )
    },
    code: ({ children }) => (
      <code className="inline bg-rurikon-50 px-1.5 py-0.5 rounded text-sm font-mono text-rurikon-600 border border-rurikon-100">
        {children}
      </code>
    ),
  },
  types: {
    image: ({ value }) => {
      const image = value as PortableTextImageBlock

      if (!image.asset?._ref) return null

      const width = image.metadata?.dimensions?.width || 1200
      const height = image.metadata?.dimensions?.height || 900
      const src = urlFor(image).width(Math.min(width, 1200)).fit('max').auto('format').url()
      const alt = image.alt || image.caption || ''

      return (
        <figure className="mt-6">
          <ClickableImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            blurDataURL={image.metadata?.lqip}
            className="rounded-sm"
          />
          {image.caption && (
            <figcaption className="mt-2 text-sm text-rurikon-400 italic">
              {image.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export default function PortableTextRenderer({ value }: { value: PortableTextContent[] }) {
  return <PortableText value={value} components={components} />
}