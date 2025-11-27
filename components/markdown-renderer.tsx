// components/markdown-renderer.tsx
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkDirective from 'remark-directive'
import { visit } from 'unist-util-visit'
import { BlockSideTitle } from '@/components/block-sidetitle'
import Link from 'next/link'
import Image from 'next/image'
import { codeToHtml } from 'shiki'

// Copy button component for code blocks
const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [code])
  
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-rurikon-100 transition-colors text-rurikon-400 hover:text-rurikon-600"
      title={copied ? 'Copied!' : 'Copy code'}
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

// Syntax highlighted code block component
const HighlightedCodeBlock = ({ code, language }: { code: string, language: string }) => {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)
  
  useEffect(() => {
    const highlight = async () => {
      try {
        const html = await codeToHtml(code, {
          lang: language || 'text',
          theme: 'github-light',
        })
        setHighlightedHtml(html)
      } catch (err) {
        // If language is not supported, fallback to plain text
        try {
          const html = await codeToHtml(code, {
            lang: 'text',
            theme: 'github-light',
          })
          setHighlightedHtml(html)
        } catch {
          setHighlightedHtml(null)
        }
      }
    }
    highlight()
  }, [code, language])
  
  return (
    <div className="mt-6 rounded-lg border border-rurikon-100 overflow-hidden">
      <div className="bg-rurikon-50 px-4 py-1.5 border-b border-rurikon-100 flex items-center justify-between">
        <span className="text-xs font-medium text-rurikon-400 uppercase tracking-wide">
          {language || 'code'}
        </span>
        <CopyButton code={code} />
      </div>
      {highlightedHtml ? (
        <div 
          className="shiki-wrapper overflow-x-auto text-sm leading-relaxed [&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-[#fafafa] [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed bg-[#fafafa]">
          <code className="font-mono block">{code}</code>
        </pre>
      )}
    </div>
  )
}

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

// Shortcode component: Image (::img{src="image.jpg" alt="description" caption="optional caption"})
const ImageEmbed = ({ src, alt, caption, width }: { src: string, alt?: string, caption?: string, width?: string }) => {
  const imageSrc = src?.startsWith('https://') || src?.startsWith('http://') ? src : `/assets/images/${src}`
  const imageWidth = width ? parseInt(width) : 800
  
  return (
    <figure className="mt-7">
      <Image
        src={imageSrc}
        alt={alt || caption || ''}
        width={imageWidth}
        height={Math.round(imageWidth * 0.75)}
        quality={95}
        draggable={false}
        className="rounded-sm"
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-rurikon-400 italic">
          {caption}
        </figcaption>
      )}
    </figure>
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
    img: (props: any) => {
      // Handle ::img{src="..." alt="..." caption="..."} shortcode
      if (props.src) {
        return <ImageEmbed src={props.src} alt={props.alt} caption={props.caption} width={props.width} />
      }
      return null
    },
    
    // Standard HTML element overrides
    h1: (props: any) => (
      <h1
        id={slugify(props.children)}
        className='font-bold text-2xl mb-3 text-rurikon-700 text-balance'
        {...props}
      />
    ),
    h2: (props: any) => (
      <h2
        id={slugify(props.children)}
        className='font-semibold text-xl mt-12 mb-3 text-rurikon-600 text-balance'
        {...props}
      />
    ),
    h3: (props: any) => (
      <h3
        id={slugify(props.children)}
        className='font-semibold text-lg mt-10 mb-2 text-rurikon-600 text-balance'
        {...props}
      />
    ),
    h4: (props: any) => (
      <h4
        id={slugify(props.children)}
        className='font-semibold text-base mt-8 mb-2 text-rurikon-600 text-balance'
        {...props}
      />
    ),
    h5: (props: any) => (
      <h5
        id={slugify(props.children)}
        className='font-medium text-base mt-6 mb-2 text-rurikon-500 text-balance'
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
    p: (props: any) => <p className='mt-4 leading-relaxed text-rurikon-500' {...props} />,
    blockquote: (props: any) => (
      <blockquote
        className='pl-6 -ml-6 sm:pl-10 sm:-ml-10 md:pl-14 md:-ml-14 not-mobile:text-rurikon-400'
        {...props}
      />
    ),
    pre: ({ children, ...props }: any) => {
      // Extract code content and language from children
      let codeContent = ''
      let language = ''
      
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.props) {
          const childProps = child.props as any
          if (typeof childProps.children === 'string') {
            codeContent = childProps.children
          }
          const match = /language-(\w+)/.exec(childProps.className || '')
          if (match) {
            language = match[1]
          }
        }
      })
      
      // If we have code content and language, use the highlighted code block
      if (codeContent && language) {
        return <HighlightedCodeBlock code={codeContent} language={language} />
      }
      
      // Fallback for code blocks without language
      if (codeContent) {
        return (
          <div className="mt-6 rounded-lg border border-rurikon-100 overflow-hidden">
            <div className="bg-rurikon-50 px-4 py-1.5 border-b border-rurikon-100 flex items-center justify-between">
              <span className="text-xs font-medium text-rurikon-400 uppercase tracking-wide">
                code
              </span>
              <CopyButton code={codeContent} />
            </div>
            <pre className="p-4 overflow-x-auto text-sm leading-relaxed bg-[#fafafa]" {...props}>
              {children}
            </pre>
          </div>
        )
      }
      
      return <pre className='whitespace-pre md:whitespace-pre-wrap p-4 overflow-x-auto' {...props}>{children}</pre>
    },
    code: ({ className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '')

      if (typeof children === 'string' && match) {
        // This is inside a code block - pre component handles the highlighting
        return (
          <code 
            className={`${className} font-mono block`}
            {...props}
          >
            {children}
          </code>
        )
      }

      // This is inline code
      return (
        <code 
          className='inline bg-rurikon-50 px-1.5 py-0.5 rounded text-sm font-mono text-rurikon-600 border border-rurikon-100' 
          {...props}
        >
          {children}
        </code>
      )
    },
    // Standard markdown image syntax: ![alt](src "title")
    image: ({ src, alt, title }: any) => {
      if (!src) return null
      
      const imageSrc = src?.startsWith('https://') || src?.startsWith('http://') ? src : `/assets/images/${src}`

      const img = (
        <Image
          className='rounded-sm'
          src={imageSrc}
          alt={alt || ''}
          width={800}
          height={600}
          quality={95}
          draggable={false}
        />
      )

      if (title) {
        return (
          <figure className="mt-6">
            <BlockSideTitle title={title}>{img}</BlockSideTitle>
          </figure>
        )
      }

      return (
        <figure className="mt-6">
          {img}
          {alt && (
            <figcaption className="mt-2 text-sm text-rurikon-400 italic">
              {alt}
            </figcaption>
          )}
        </figure>
      )
    },
    hr: (props: any) => <hr className='my-10 w-24 border-rurikon-border' {...props} />,
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