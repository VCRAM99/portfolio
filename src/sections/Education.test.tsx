import { act, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTheme } from '../hooks/useTheme'
import { education } from '../data/education'
import { Education } from './Education'

beforeEach(() => {
  document.documentElement.dataset.theme = 'light'
})

function entry(university: string) {
  const image = screen.getByRole('img', { name: university })
  const item = image.closest('li')
  if (!item) throw new Error(`Missing education entry for ${university}`)
  return within(item)
}

function sources() {
  return [...document.querySelectorAll('#education img')].map((image) => image.getAttribute('src'))
}

const lightSources = education.map((item) => item.logo.lightSrc)
const darkSources = education.map((item) => item.logo.darkSrc)

describe('Education', () => {
  it('keeps the education section anchor and heading', () => {
    render(<Education />)

    const section = document.getElementById('education')

    expect(section).toHaveAttribute('aria-labelledby', 'education-heading')
    expect(section).toHaveClass('scroll-mt-24')
    expect(screen.getByRole('heading', { level: 2, name: 'Education.' })).toBeInTheDocument()
    expect(screen.queryByText(/Academic foundations/)).not.toBeInTheDocument()
  })

  it('renders both schools in order with degrees and without dates or name headings', () => {
    render(<Education />)

    expect(screen.getAllByRole('img').map((image) => image.getAttribute('alt'))).toEqual([
      'University of Michigan',
      'McMaster University',
    ])
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
    expect(screen.queryByText('2021–2023')).not.toBeInTheDocument()
    expect(screen.queryByText('2017–2021')).not.toBeInTheDocument()

    const michigan = entry('University of Michigan')
    expect(michigan.getByText('Master of Engineering (M.Eng)')).toBeInTheDocument()
    expect(michigan.getByText('Computer Engineering')).toBeInTheDocument()
    expect(michigan.getByText('United States')).toBeInTheDocument()

    const mcmaster = entry('McMaster University')
    expect(mcmaster.getByText('Bachelor of Engineering (B.Eng)')).toBeInTheDocument()
    expect(mcmaster.getByText('Computer Engineering')).toBeInTheDocument()
    expect(mcmaster.getByText('Canada')).toBeInTheDocument()
  })

  it('shows the Michigan specialization and does not invent one for McMaster', () => {
    render(<Education />)

    const michigan = entry('University of Michigan')
    expect(michigan.getByText('Machine Learning & Data Science')).toBeInTheDocument()

    const mcmaster = entry('McMaster University')
    expect(mcmaster.queryByText('Machine Learning & Data Science')).not.toBeInTheDocument()
    expect(mcmaster.queryByText('Specialization')).not.toBeInTheDocument()
    expect(education.find((item) => item.id === 'mcmaster')?.specialization).toBeUndefined()
  })

  it('uses the light logos and switches to the dark logos with the page theme', async () => {
    render(<Education />)

    const logos = [...document.querySelectorAll('#education img')]
    expect(logos.map((logo) => logo.getAttribute('src'))).toEqual(lightSources)
    expect(logos[0]).toHaveClass('object-contain')

    document.documentElement.dataset.theme = 'dark'

    await waitFor(() => {
      expect(sources()).toEqual(darkSources)
    })
  })

  it('follows system appearance through the existing theme hook', async () => {
    let systemIsDark = false
    let colorSchemeHandler: ((event: MediaQueryListEvent) => void) | undefined

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        get matches() {
          return query.includes('prefers-color-scheme') ? systemIsDark : false
        },
        media: query,
        addEventListener: (_event: string, handler: (event: MediaQueryListEvent) => void) => {
          if (query.includes('prefers-color-scheme')) colorSchemeHandler = handler
        },
        removeEventListener: vi.fn(),
      })),
    )

    function ThemeHarness() {
      useTheme()
      return <Education />
    }

    render(<ThemeHarness />)

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('light')
      expect(sources()).toEqual(lightSources)
    })

    systemIsDark = true
    act(() => {
      colorSchemeHandler?.({ matches: true } as MediaQueryListEvent)
    })

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('dark')
      expect(sources()).toEqual(darkSources)
    })
  })
})
