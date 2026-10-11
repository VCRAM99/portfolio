
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTheme } from './useTheme'

let systemIsDark = false
let changeHandler: ((event: MediaQueryListEvent) => void) | undefined

beforeEach(() => {
  systemIsDark = false
  changeHandler = undefined

  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: systemIsDark,
      media: query,
      addEventListener: vi.fn(
        (_event: string, handler: (event: MediaQueryListEvent) => void) => {
          changeHandler = handler
        }
      ),
      removeEventListener: vi.fn(),
    }))
  )
})

describe('useTheme', () => {
  it('defaults to system preference', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.preference).toBe('system')
    expect(result.current.resolvedTheme).toBe('light')
  })

  it('switches to dark mode', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.changeTheme('dark')
    })

    expect(result.current.preference).toBe('dark')
    expect(result.current.resolvedTheme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('switches to light mode', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.changeTheme('light')
    })

    expect(result.current.resolvedTheme).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('persists the selected preference', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.changeTheme('dark')
    })

    expect(window.localStorage.getItem('portfolio-theme')).toBe('dark')
  })

  it('restores a saved preference', () => {
    window.localStorage.setItem('portfolio-theme', 'dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.preference).toBe('dark')
    expect(result.current.resolvedTheme).toBe('dark')
  })

  it('follows system appearance changes in system mode', async () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      changeHandler?.({ matches: true } as MediaQueryListEvent)
    })

    await waitFor(() => {
      expect(result.current.resolvedTheme).toBe('dark')
    })
  })

  it('does not override manual preference when system changes', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.changeTheme('light')
    })

    act(() => {
      changeHandler?.({ matches: true } as MediaQueryListEvent)
    })

    expect(result.current.preference).toBe('light')
    expect(result.current.resolvedTheme).toBe('light')
  })

  it('ignores invalid saved preferences', () => {
    window.localStorage.setItem('portfolio-theme', 'invalid')

    const { result } = renderHook(() => useTheme())

    expect(result.current.preference).toBe('system')
  })
})
