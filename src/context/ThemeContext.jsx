import { createContext, useCallback, useContext, useState } from 'react'

const THEME_KEY = 'sipafas-theme'
const ThemeContext = createContext(null)

function initialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* abaikan */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Menerapkan kelas tema ke <html> secara sinkron (dibutuhkan transisi tampilan).
function applyThemeClass(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* abaikan */
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const t = initialTheme()
    applyThemeClass(t)
    return t
  })

  const setTheme = useCallback((next) => {
    applyThemeClass(next)
    setThemeState(next)
  }, [])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
