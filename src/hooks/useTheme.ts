
import { useEffect, useState } from 'react'

export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'portfolio-theme'

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

function getStoredPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isThemePreference(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(
    getStoredPreference
  )

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(
    getSystemTheme
  )

  const resolvedTheme: ResolvedTheme =
    preference === 'system' ? systemTheme : preference

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    )

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
  }, [resolvedTheme])

  function changeTheme(nextPreference: ThemePreference) {
    setPreference(nextPreference)

    try {
      window.localStorage.setItem(STORAGE_KEY, nextPreference)
    } catch {
      // The theme still works if browser storage is unavailable.
    }
  }

  return {
    preference,
    resolvedTheme,
    changeTheme,
  }
}
