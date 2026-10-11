import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { contact } from '../data/contact'
import { Contact } from './Contact'

let systemIsDark = false

beforeEach(() => {
  systemIsDark = false
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      get matches() {
        return query.includes('prefers-color-scheme') ? systemIsDark : true
      },
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
})

function mockClipboard(writeText: ReturnType<typeof vi.fn> | undefined) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: writeText ? { writeText } : undefined,
  })
}

describe('Contact', () => {
  it('keeps the contact anchor and approved copy', () => {
    render(<Contact />)

    const section = document.getElementById('contact')

    expect(section).toHaveAttribute('aria-labelledby', 'contact-heading')
    expect(section).toHaveClass('scroll-mt-24')
    expect(screen.getByRole('heading', { level: 2, name: "Let's build something meaningful." })).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(
      screen.getByText(
        "Interested in collaborating, discussing an opportunity, or exploring an idea? I'd love to hear from you.",
      ),
    ).toBeInTheDocument()
  })

  it('links GitHub and LinkedIn and copies the shared email address', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    mockClipboard(writeText)

    render(<Contact />)

    const github = screen.getByRole('link', { name: 'GitHub' })
    const linkedin = screen.getByRole('link', { name: 'LinkedIn' })

    expect(github).toHaveAttribute('href', contact.github)
    expect(linkedin).toHaveAttribute('href', contact.linkedin)
    expect(github).toHaveAttribute('target', '_blank')
    expect(github).toHaveAttribute('rel', 'noopener noreferrer')
    expect(linkedin).toHaveAttribute('target', '_blank')
    expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer')

    await user.click(screen.getByRole('button', { name: contact.email }))

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(contact.email)
      expect(screen.getByRole('status')).toHaveTextContent('Email copied!')
    })
  })

  it('shows copy failure and clears success feedback after 3 seconds', async () => {
    vi.useFakeTimers()
    mockClipboard(vi.fn().mockRejectedValue(new Error('denied')))

    const { unmount } = render(<Contact />)

    await act(async () => {
      screen.getByRole('button', { name: contact.email }).click()
      await Promise.resolve()
    })

    expect(screen.getByRole('status')).toHaveTextContent('Could not copy email.')

    unmount()
    mockClipboard(vi.fn().mockResolvedValue(undefined))
    render(<Contact />)
    const email = screen.getByRole('button', { name: contact.email })
    email.focus()

    await act(async () => {
      email.click()
      await Promise.resolve()
    })

    expect(screen.getByRole('status')).toHaveTextContent('Email copied!')
    expect(email).toHaveFocus()

    await act(() => vi.advanceTimersByTimeAsync(3000))

    expect(screen.getByRole('status')).not.toHaveTextContent('Email copied!')
    expect(email).toHaveFocus()
    vi.useRealTimers()
  })

  it('reserves a fixed line for copy feedback', () => {
    render(<Contact />)

    const status = screen.getByRole('status')

    expect(status).toHaveClass('h-5')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })

  it('includes the copyright, a link back to the hero, and the theme selector in the footer', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    expect(screen.getByText('© 2026 Varun Ramanathan.')).toBeInTheDocument()

    const backToTop = screen.getByRole('link', { name: 'Back to Top' })
    expect(backToTop).toHaveAttribute('href', '#home')
    expect(backToTop.closest('footer')).not.toBeNull()

    const theme = screen.getByRole('combobox', { name: 'Theme' })
    expect(theme.closest('footer')).not.toBeNull()
    expect(theme.closest('.fixed')).toBeNull()

    await user.selectOptions(theme, 'dark')
    expect(document.documentElement.dataset.theme).toBe('dark')

    await user.selectOptions(theme, 'light')
    expect(document.documentElement.dataset.theme).toBe('light')

    await user.selectOptions(theme, 'system')
    expect(theme).toHaveValue('system')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('renders a single footer theme selector when the page is mounted', () => {
    render(<App />)

    const themes = screen.getAllByRole('combobox', { name: 'Theme' })

    expect(themes).toHaveLength(1)
    expect(themes[0]?.closest('footer')).not.toBeNull()
    expect(document.querySelector('.fixed.bottom-4')).toBeNull()
  })
})
