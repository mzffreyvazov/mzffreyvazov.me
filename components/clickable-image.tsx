'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const ImageLightbox = ({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out p-4 md:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-50"
        aria-label="Close lightbox"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  )
}

export const ClickableImage = ({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px',
  quality = 75,
  blurDataURL,
  priority = false,
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  sizes?: string
  quality?: number
  blurDataURL?: string
  priority?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        sizes={sizes}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        className={`${className} cursor-zoom-in hover:opacity-90 transition-opacity`}
        onClick={() => setIsOpen(true)}
      />
      <ImageLightbox
        src={src}
        alt={alt}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}