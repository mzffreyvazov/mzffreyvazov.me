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

const THEME_SEQUENCE: Array<{ theme: ThemeMode; palette: DarkPalette; label: string }> = [
  { theme: 'light', palette: DEFAULT_DARK_PALETTE, label: 'light' },
  {
    theme: 'dark',
    palette: 'olive-ash-dim-soft',
    label: DARK_PALETTE_OPTIONS.find((option) => option.value === 'olive-ash-dim-soft')?.label ?? 'olive',
  },
  {
    theme: 'dark',
    palette: 'obsidian-typewriter',
    label: DARK_PALETTE_OPTIONS.find((option) => option.value === 'obsidian-typewriter')?.label ?? 'typewriter',
  },
]

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

  const currentIndex = THEME_SEQUENCE.findIndex((option) => {
    if (theme === 'light') {
      return option.theme === 'light'
    }

    return option.theme === 'dark' && option.palette === palette
  })

  const activeIndex = currentIndex === -1 ? 0 : currentIndex
  const activeLabel = THEME_SEQUENCE[activeIndex].label

  return (
    <button
      type='button'
      onClick={() => {
        const nextIndex = (activeIndex + 1) % THEME_SEQUENCE.length
        const nextTheme = THEME_SEQUENCE[nextIndex]

        setTheme(nextTheme.theme)
        setPalette(nextTheme.palette)
        applyTheme(nextTheme.theme, nextTheme.palette)
      }}
      className={cn(
        mounted ? 'text-rurikon-800' : 'text-rurikon-300',
        'inline-block w-full px-2 text-right transition-colors hover:text-rurikon-600 hover:transform-none'
      )}
      title={`Current theme: ${activeLabel}. Click to cycle themes.`}
      aria-label={`Current theme: ${activeLabel}. Click to cycle themes.`}
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {activeLabel}
    </button>
  )
}