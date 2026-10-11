import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Hero } from '../../sections/Hero'
import { contact } from '../../data/contact'

function mockClipboard(writeText: ReturnType<typeof vi.fn> | undefined) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: writeText ? { writeText } : undefined,
  })
}

describe('HeroActions', () => {
  afterEach(() => {
    vi.useRealTimers()
    mockClipboard(undefined)
  })

  async function clickEmail() {
    fireEvent.click(screen.getByRole('button', { name: 'Email' }))
    await act(async () => {
      await Promise.resolve()
    })
  }

  it('keeps the copy status out of the document flow', () => {
    render(<Hero />)

    const status = screen.getByRole('status')

    expect(status).toHaveClass('absolute')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status.parentElement).toHaveClass('relative')
  })

  it('renders the four actions with the confirmed destinations', () => {
    render(<Hero />)

    const github = screen.getByRole('link', { name: 'GitHub' })
    const linkedin = screen.getByRole('link', { name: 'LinkedIn' })
    const resume = screen.getByRole('link', { name: 'Resume' })

    expect(github).toHaveAttribute('href', contact.github)
    expect(linkedin).toHaveAttribute('href', contact.linkedin)
    expect(resume).toHaveAttribute('href', '/resume.pdf')
    expect(screen.getByRole('button', { name: 'Email' })).toBeInTheDocument()

    for (const link of [github, linkedin, resume]) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('shows success feedback only after the email is copied', async () => {
    const user = userEvent.setup()
    let resolveCopy: (() => void) | undefined
    const writeText = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveCopy = resolve
        }),
    )
    mockClipboard(writeText)

    render(<Hero />)

    await user.click(screen.getByRole('button', { name: 'Email' }))

    expect(writeText).toHaveBeenCalledWith(contact.email)
    expect(screen.queryByText('Email copied!')).not.toBeInTheDocument()

    resolveCopy?.()

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Email copied!')
    })
  })

  it('shows a failure message when copying is rejected', async () => {
    const user = userEvent.setup()
    mockClipboard(vi.fn().mockRejectedValue(new Error('denied')))

    render(<Hero />)

    await user.click(screen.getByRole('button', { name: 'Email' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Could not copy email.')
    })
    expect(screen.queryByText('Email copied!')).not.toBeInTheDocument()
  })

  it('shows a failure message when the Clipboard API is unavailable', async () => {
    const user = userEvent.setup()
    mockClipboard(undefined)

    render(<Hero />)

    await user.click(screen.getByRole('button', { name: 'Email' }))

    expect(screen.getByRole('status')).toHaveTextContent('Could not copy email.')
    expect(screen.queryByText('Email copied!')).not.toBeInTheDocument()
  })

  it('clears success feedback after 3 seconds without moving focus', async () => {
    vi.useFakeTimers()
    mockClipboard(vi.fn().mockResolvedValue(undefined))

    render(<Hero />)
    const email = screen.getByRole('button', { name: 'Email' })
    email.focus()

    await clickEmail()

    expect(screen.getByRole('status')).toHaveTextContent('Email copied!')
    expect(email).toHaveFocus()

    await act(() => vi.advanceTimersByTimeAsync(2999))
    expect(screen.getByRole('status')).toHaveTextContent('Email copied!')

    await act(() => vi.advanceTimersByTimeAsync(1))
    expect(screen.getByRole('status')).not.toHaveTextContent('Email copied!')
    expect(email).toHaveFocus()
  })

  it('clears failure feedback after 5 seconds', async () => {
    vi.useFakeTimers()
    mockClipboard(vi.fn().mockRejectedValue(new Error('denied')))

    render(<Hero />)

    await clickEmail()

    expect(screen.getByRole('status')).toHaveTextContent('Could not copy email.')

    await act(() => vi.advanceTimersByTimeAsync(4999))
    expect(screen.getByRole('status')).toHaveTextContent('Could not copy email.')

    await act(() => vi.advanceTimersByTimeAsync(1))
    expect(screen.getByRole('status')).not.toHaveTextContent('Could not copy email.')
  })

  it('resets the dismissal timer when Email is clicked again', async () => {
    vi.useFakeTimers()
    mockClipboard(vi.fn().mockResolvedValue(undefined))

    render(<Hero />)

    await clickEmail()
    await act(() => vi.advanceTimersByTimeAsync(2500))

    await clickEmail()
    await act(() => vi.advanceTimersByTimeAsync(2500))

    expect(screen.getByRole('status')).toHaveTextContent('Email copied!')

    await act(() => vi.advanceTimersByTimeAsync(500))
    expect(screen.getByRole('status')).not.toHaveTextContent('Email copied!')
  })

  it('ignores an older clipboard response after a newer click', async () => {
    vi.useFakeTimers()
    let resolveFirst: (() => void) | undefined
    let rejectSecond: ((error: Error) => void) | undefined
    let call = 0
    const writeText = vi.fn(
      () =>
        new Promise<void>((resolve, reject) => {
          if (call === 0) resolveFirst = resolve
          else rejectSecond = reject
          call += 1
        }),
    )
    mockClipboard(writeText)

    render(<Hero />)
    const email = screen.getByRole('button', { name: 'Email' })

    fireEvent.click(email)
    fireEvent.click(email)

    rejectSecond?.(new Error('denied'))
    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByRole('status')).toHaveTextContent('Could not copy email.')

    resolveFirst?.()
    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByRole('status')).toHaveTextContent('Could not copy email.')
    expect(screen.queryByText('Email copied!')).not.toBeInTheDocument()
  })

  it('clears the pending dismissal timer on unmount', async () => {
    vi.useFakeTimers()
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    mockClipboard(vi.fn().mockResolvedValue(undefined))

    const { unmount } = render(<Hero />)

    await clickEmail()
    expect(screen.getByRole('status')).toHaveTextContent('Email copied!')

    clearTimeoutSpy.mockClear()
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
