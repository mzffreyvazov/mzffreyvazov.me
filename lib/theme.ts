export type ThemeMode = 'light' | 'dark'

export type DarkPalette =
  | 'olive-ash-dim-soft'
  | 'obsidian-typewriter'

export const DARK_PALETTE_OPTIONS: Array<{
  value: DarkPalette
  label: string
}> = [
  { value: 'olive-ash-dim-soft', label: 'olive' },
  { value: 'obsidian-typewriter', label: 'typewriter' },
]

export const THEME_STORAGE_KEY = 'mz-theme'
export const DARK_PALETTE_STORAGE_KEY = 'mz-dark-palette'

export const DEFAULT_THEME: ThemeMode = 'light'
export const DEFAULT_DARK_PALETTE: DarkPalette = 'olive-ash-dim-soft'
export const LIGHT_THEME_COLOR = '#fcfcfc'

export const DARK_THEME_COLORS: Record<DarkPalette, string> = {
  'olive-ash-dim-soft': '#131411',
  'obsidian-typewriter': '#262626',
}

export function getThemeColor(theme: ThemeMode, palette: DarkPalette) {
  return theme === 'dark' ? DARK_THEME_COLORS[palette] : LIGHT_THEME_COLOR
}

export function isDarkPalette(value: string | null): value is DarkPalette {
  return value !== null && value in DARK_THEME_COLORS
}

export function getThemeBootstrapScript() {
  const darkThemeColors = JSON.stringify(DARK_THEME_COLORS)

  return `(function(){try{var root=document.documentElement;var themeKey='${THEME_STORAGE_KEY}';var paletteKey='${DARK_PALETTE_STORAGE_KEY}';var defaultTheme='${DEFAULT_THEME}';var defaultPalette='${DEFAULT_DARK_PALETTE}';var lightThemeColor='${LIGHT_THEME_COLOR}';var darkThemeColors=${darkThemeColors};var theme=localStorage.getItem(themeKey)||defaultTheme;var palette=localStorage.getItem(paletteKey)||defaultPalette;if(!(palette in darkThemeColors)){palette=defaultPalette;localStorage.setItem(paletteKey,palette);}if(theme!=='dark'&&theme!=='light'){theme=defaultTheme;localStorage.setItem(themeKey,theme);}root.dataset.theme=theme;root.dataset.darkPalette=palette;root.style.colorScheme=theme;var meta=document.querySelector('meta[name="theme-color"]');if(meta){meta.setAttribute('content',theme==='dark'?darkThemeColors[palette]:lightThemeColor);}}catch(e){}})();`
}