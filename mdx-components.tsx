// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'
import type { FC, ReactNode } from 'react'
import React from 'react'
import { codeToHtml, createCssVariablesTheme } from 'shiki'
import Link from 'next/link'
import Image from 'next/image'

// @ts-ignore
import { InlineMath, BlockMath } from 'react-katex'

import { Card } from '@/components/tweet-card'
import { BlockSideTitle } from '@/components/block-sidetitle'

// Custom Alert component
const Alert: FC<{ type: 'info' | 'warning' | 'error' | 'success'; children: ReactNode }> = ({
  type,
  children,
}) => {
  const alertStyles = {
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    success: 'bg-green-100 border-green-500 text-green-700',
  }

  return (
    <div className={`border-l-4 p-4 my-4 ${alertStyles[type]}`} role="alert">
      <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
      <div>{children}</div>
    </div>
  )
}

const cssVariablesTheme = createCssVariablesTheme({})

// Helper function to generate a URL-friendly "slug" from a string
const slugify = (text: ReactNode): string => {
  let str = ''
  // Recursively extract text from children
  const extractText = (children: ReactNode) => {
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

export const components: Record<string, FC<any>> = {
  h1: (props) => (
    <h1
      id={slugify(props.children)}
      className='font-semibold mb-7 text-rurikon-600 text-balance'
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      id={slugify(props.children)}
      className='font-semibold mt-14 mb-7 text-rurikon-600 text-balance'
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      id={slugify(props.children)}
      className='font-semibold mt-14 mb-7 text-rurikon-600 text-balance'
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      id={slugify(props.children)}
      className='font-semibold mt-12 mb-6 text-rurikon-600 text-balance'
      {...props}
    />
  ),
  h5: (props) => (
    <h5
      id={slugify(props.children)}
      className='font-semibold mt-12 mb-6 text-rurikon-600 text-balance'
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className='mt-2 space-y-2 list-disc list-outside marker:text-rurikon-200 pl-5 [&_ul]:mb-4 [&_ol]:mb-3'
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className='mt-2 space-y-2 list-decimal list-outside marker:text-rurikon-200 pl-5 [&_ul]:mb-4 [&_ol]:mb-3'
      {...props}
    />
  ),
  li: (props) => <li className='pl-1 leading-relaxed [&:has(ul)]:mb-2 [&:has(ol)]:mb-2' {...props} />,
  a: ({ href, ...props }) => {
    return (
      <Link
        className='break-words decoration-from-font underline underline-offset-2 decoration-rurikon-300 hover:decoration-rurikon-600 focus:outline-none focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-opacity-50 focus-visible:ring-offset-2'
        href={href}
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
  strong: (props) => <strong className='font-bold' {...props} />,
  p: (props) => <p className='mt-6' {...props} />,
  blockquote: (props) => (
    <blockquote
      className='pl-6 -ml-6 sm:pl-10 sm:-ml-10 md:pl-14 md:-ml-14 not-mobile:text-rurikon-400'
      {...props}
    />
  ),
  pre: (props) => (
    <pre className='mt-7 whitespace-pre md:whitespace-pre-wrap' {...props} />
  ),
  code: async (props) => {
    if (typeof props.children === 'string') {
      const code = await codeToHtml(props.children, {
        lang: 'jsx',
        theme: cssVariablesTheme,
        transformers: [
          {
            pre: (hast) => {
              if (hast.children.length !== 1) {
                throw new Error('<pre>: Expected a single <code> child')
              }
              if (hast.children[0].type !== 'element') {
                throw new Error('<pre>: Expected a <code> child')
              }
              return hast.children[0]
            },
            postprocess(html) {
              return html.replace(/^<code>|<\/code>$/g, '')
            },
          },
        ],
      })

      return (
        <code
          className='inline shiki css-variables text-[0.805rem] sm:text-[13.8px] md:text-[0.92rem]'
          dangerouslySetInnerHTML={{ __html: code }}
        />
      )
    }

    return <code className='inline' {...props} />
  },
  Card,
  Image,
  img: async ({ src, alt, title }) => {
    let img: React.ReactNode

    if (src.startsWith('https://')) {
      img = (
        <Image
          className='mt-7'
          src={src}
          alt={alt}
          quality={95}
          placeholder='blur'
          draggable={false}
        />
      )
    } else {
      const image = await import('./assets/images/' + src)
      img = (
        <Image
          className='mt-7'
          src={image.default}
          alt={alt}
          quality={95}
          placeholder='blur'
          draggable={false}
        />
      )
    }

    if (title) {
      return <BlockSideTitle title={title}>{img}</BlockSideTitle>
    }

    return img
  },
  hr: (props) => <hr className='my-14 w-24 border-rurikon-border' {...props} />,
  BlockSideTitle,
  InlineMath,
  BlockMath,
  Alert,
}

export function useMDXComponents(inherited: MDXComponents): MDXComponents {
  return {
    ...inherited,
    ...components,
  }
}
