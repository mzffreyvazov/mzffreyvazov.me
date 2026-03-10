'use client'

import { useEffect, useState } from 'react'

import cn from 'clsx'

import {
  DARK_PALETTE_OPTIONS,
  DARK_PALETTE_STORAGE_KEY,
  DEFAULT_DARK_PALETTE,
  DEFAULT_THEME,
  getThemeColor,
  isDarkPalette,
  THEME_STORAGE_KEY,
  type DarkPalette,
  type ThemeMode,
} from '@/lib/theme'

function applyTheme(theme: ThemeMode, palette?: DarkPalette) {
  const root = document.documentElement
  const datasetPalette = root.dataset.darkPalette || null
  const storedPalette = localStorage.getItem(DARK_PALETTE_STORAGE_KEY)
  const nextPalette: DarkPalette = palette
    ? palette
    : isDarkPalette(datasetPalette)
      ? datasetPalette
      : isDarkPalette(storedPalette)
        ? storedPalette
        : DEFAULT_DARK_PALETTE

  root.dataset.theme = theme
  root.dataset.darkPalette = nextPalette
  root.style.colorScheme = theme
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  localStorage.setItem(DARK_PALETTE_STORAGE_KEY, nextPalette)

  const metaTheme = document.querySelector('meta[name="theme-color"]')
  if (metaTheme) {
    metaTheme.setAttribute('content', getThemeColor(theme, nextPalette))
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(DEFAULT_THEME)
  const [palette, setPalette] = useState<DarkPalette>(DEFAULT_DARK_PALETTE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    const nextTheme = storedTheme === 'dark' ? 'dark' : DEFAULT_THEME
    const storedPalette = localStorage.getItem(DARK_PALETTE_STORAGE_KEY)
    const nextPalette = isDarkPalette(storedPalette)
      ? storedPalette
      : DEFAULT_DARK_PALETTE

    setTheme(nextTheme)
    setPalette(nextPalette)
    applyTheme(nextTheme, nextPalette)
    setMounted(true)
  }, [])

  return (
    <>
      <button
        type='button'
        onClick={() => {
          setTheme('light')
          applyTheme('light', palette)
        }}
        className={cn(
          theme === 'light'
            ? 'text-rurikon-800'
            : 'text-rurikon-300 hover:text-rurikon-600',
          'inline-block px-2 transition-colors hover:transform-none'
        )}
        title='Switch to light mode'
        aria-label='Switch to light mode'
        style={{ opacity: mounted ? 1 : 0 }}
      >
        light
      </button>
      {DARK_PALETTE_OPTIONS.map((option) => {
        const isActive = theme === 'dark' && palette === option.value

        return (
          <button
            key={option.value}
            type='button'
            onClick={() => {
              setTheme('dark')
              setPalette(option.value)
              applyTheme('dark', option.value)
            }}
            className={cn(
              isActive
                ? 'text-rurikon-800'
                : 'text-rurikon-300 hover:text-rurikon-600',
              'inline-block px-2 transition-colors hover:transform-none'
            )}
            title={`Switch to ${option.label}`}
            aria-label={`Switch to ${option.label}`}
            style={{ opacity: mounted ? 1 : 0 }}
          >
            {option.label}
          </button>
        )
      })}
    </>
  )
}