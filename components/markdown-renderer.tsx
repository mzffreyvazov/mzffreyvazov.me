// components/markdown-renderer.tsx
'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkDirective from 'remark-directive'
import { visit } from 'unist-util-visit'
import { BlockSideTitle } from '@/components/block-sidetitle'
import Link from 'next/link'
import Image from 'next/image'

// Shortcode component: Alert
const Alert = ({ type = 'info', children }: { type?: 'info' | 'warning' | 'error' | 'success', children?: React.ReactNode }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800', 
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }
  
  return (
    <div className={`mt-6 p-4 border-l-4 rounded-r ${styles[type]} [&>*:first-child]:mt-0`}>
      {children}
    </div>
  )
}

// Shortcode component: YouTube
const YouTubeEmbed = ({ id }: { id: string }) => (
  <div className="mt-7 aspect-video">
    <iframe
      src={`https://www.youtube.com/embed/${id}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full rounded-lg"
    />
  </div>
)

// Custom remark plugin to handle directives
function remarkDirectivePlugin() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        const data = node.data || (node.data = {})
        const hast = data.hName || node.name
        
        // Convert directive to a custom element
        data.hName = node.name
        data.hProperties = {
          ...node.attributes,
          ...(data.hProperties || {})
        }
      }
    })
  }
}

// Helper function to generate a URL-friendly "slug" from a string
const slugify = (text: React.ReactNode): string => {
  let str = ''
  // Recursively extract text from children
  const extractText = (children: React.ReactNode) => {
    React.Children.forEach(children, (child) => {
      if (typeof child === 'string') {
        str += child
      } else if (React.isValidElement(child) && child.props.children) {
        extractText(child.props.children)
      }
    })
  }

  extractText(text)

  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

interface MarkdownRendererProps {
  children: string
}

export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
  const components = {
    // Directive components
    alert: (props: any) => {
      return <Alert type={props.type}>{props.children}</Alert>
    },
    youtube: (props: any) => {
      return <YouTubeEmbed id={props.id} />
    },
    
    // Standard HTML element overrides
    h1: (props: any) => (
      <h1
        id={slugify(props.children)}
        className='font-semibold mb-7 text-rurikon-600 text-balance'
        {...props}
      />
    ),
    h2: (props: any) => (
      <h2
        id={slugify(props.children)}
        className='font-semibold mt-14 mb-7 text-rurikon-600 text-balance'
        {...props}
      />
    ),
    h3: (props: any) => (
      <h3
        id={slugify(props.children)}
        className='font-semibold mt-14 mb-7 text-rurikon-600 text-balance'
        {...props}
      />
    ),
    h4: (props: any) => (
      <h4
        id={slugify(props.children)}
        className='font-semibold mt-12 mb-6 text-rurikon-600 text-balance'
        {...props}
      />
    ),
    h5: (props: any) => (
      <h5
        id={slugify(props.children)}
        className='font-semibold mt-12 mb-6 text-rurikon-600 text-balance'
        {...props}
      />
    ),
    ul: (props: any) => (
      <ul
        className='mt-2 space-y-2 list-disc list-outside marker:text-rurikon-200 pl-5 [&_ul]:mb-4 [&_ol]:mb-3'
        {...props}
      />
    ),
    ol: (props: any) => (
      <ol
        className='mt-2 space-y-2 list-decimal list-outside marker:text-rurikon-200 pl-5 [&_ul]:mb-4 [&_ol]:mb-3'
        {...props}
      />
    ),
    li: (props: any) => <li className='pl-1 leading-relaxed [&:has(ul)]:mb-2 [&:has(ol)]:mb-2' {...props} />,
    a: ({ href, ...props }: any) => {
      return (
        <Link
          className='break-words decoration-from-font underline underline-offset-2 decoration-rurikon-300 hover:decoration-rurikon-600 focus:outline-none focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-opacity-50 focus-visible:ring-offset-2'
          href={href || '#'}
          draggable={false}
          {...(href?.startsWith('https://')
            ? {
                target: '_blank',
                rel: 'noopener noreferrer',
              }
            : {})}
          {...props}
        />
      )
    },
    strong: (props: any) => <strong className='font-bold' {...props} />,
    p: (props: any) => <p className='mt-6' {...props} />,
    blockquote: (props: any) => (
      <blockquote
        className='pl-6 -ml-6 sm:pl-10 sm:-ml-10 md:pl-14 md:-ml-14 not-mobile:text-rurikon-400'
        {...props}
      />
    ),
    pre: (props: any) => (
      <pre className='mt-7 whitespace-pre md:whitespace-pre-wrap' {...props} />
    ),
    code: ({ className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''

      if (typeof children === 'string' && match) {
        // This is a code block with enhanced styling
        return (
          <div className="mt-7">
            <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-black">
              <code 
                className={`${className} text-black font-mono block`}
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                  color: '#000000'
                }}
                {...props}
              >
                {children}
              </code>
            </pre>
          </div>
        )
      }

      // This is inline code
      return <code className='inline bg-rurikon-50 px-1 rounded text-sm font-mono' {...props}>{children}</code>
    },
    img: ({ src, alt, title }: any) => {
      let img: React.ReactNode

      if (src?.startsWith('https://')) {
        img = (
          <Image
            className='mt-7'
            src={src}
            alt={alt || ''}
            width={800}
            height={600}
            quality={95}
            draggable={false}
          />
        )
      } else if (src) {
        img = (
          <Image
            className='mt-7'
            src={`/assets/images/${src}`}
            alt={alt || ''}
            width={800}
            height={600}
            quality={95}
            draggable={false}
          />
        )
      } else {
        return null
      }

      if (title) {
        return <BlockSideTitle title={title}>{img}</BlockSideTitle>
      }

      return img
    },
    hr: (props: any) => <hr className='my-14 w-24 border-rurikon-border' {...props} />,
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkDirective, remarkDirectivePlugin]}
      components={components as any}
    >
      {children}
    </ReactMarkdown>
  )
}