import { act, render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTheme } from '../../hooks/useTheme'
import { employerIds, type EmployerId } from '../../data/experience'
import type { ResolvedTheme } from '../../hooks/useTheme'
import { EmployerLogo } from './EmployerLogo'

const logoFile: Record<EmployerId, string> = {
  'td-bank': 'td',
  quanto: 'quanto',
  cibc: 'cibc',
  mcmaster: 'mcmaster',
}

function expectedSources(theme: ResolvedTheme) {
  return employerIds.map((id) => `/employers/${logoFile[id]}-${theme}.png`)
}

let systemIsDark = false
let colorSchemeHandler: ((event: MediaQueryListEvent) => void) | undefined

beforeEach(() => {
  systemIsDark = false
  colorSchemeHandler = undefined

  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      get matches() {
        return query.includes('prefers-color-scheme') ? systemIsDark : false
      },
      media: query,
      addEventListener: vi.fn((_event: string, handler: (event: MediaQueryListEvent) => void) => {
        if (query.includes('prefers-color-scheme')) colorSchemeHandler = handler
      }),
      removeEventListener: vi.fn(),
    })),
  )
})

function ThemeHarness() {
  useTheme()
  return (
    <>
      {employerIds.map((id) => (
        <EmployerLogo key={id} id={id} variant="card" />
      ))}
    </>
  )
}

function sources() {
  return [...document.querySelectorAll('img')].map((image) => image.getAttribute('src'))
}

describe('EmployerLogo', () => {
  it('uses the light logo while the published theme is light', () => {
    document.documentElement.dataset.theme = 'light'
    render(<EmployerLogo id="td-bank" variant="card" />)

    const image = document.querySelector('img')
    expect(image).toHaveAttribute('src', '/employers/td-light.png')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveClass('object-contain')
  })

  it('switches every employer logo when the published theme changes', async () => {
    document.documentElement.dataset.theme = 'light'
    render(
      <>
        {employerIds.map((id) => (
          <EmployerLogo key={id} id={id} variant="header" />
        ))}
      </>,
    )

    expect(sources()).toEqual(expectedSources('light'))

    document.documentElement.dataset.theme = 'dark'

    await waitFor(() => {
      expect(sources()).toEqual(expectedSources('dark'))
    })
  })

  it('follows system appearance through the existing theme hook', async () => {
    systemIsDark = false
    render(<ThemeHarness />)

    await waitFor(() => {
      expect(sources()).toEqual(expectedSources('light'))
    })

    systemIsDark = true
    act(() => {
      colorSchemeHandler?.({ matches: true } as MediaQueryListEvent)
    })

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('dark')
      expect(sources()).toEqual(expectedSources('dark'))
    })
  })
})
