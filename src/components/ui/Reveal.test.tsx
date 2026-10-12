import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Reveal } from './Reveal'
import { getRevealGeneration, resetRevealGroup } from './revealGroup'

type ObserverInstance = {
  callback: IntersectionObserverCallback
  observe: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}

const observers: ObserverInstance[] = []

function installObserver() {
  observers.length = 0
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      callback: IntersectionObserverCallback
      observe = vi.fn()
      disconnect = vi.fn()

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
        observers.push(this)
      }
    },
  )
}

describe('Reveal', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    )
    installObserver()
  })

  it('stays hidden until the element intersects, then can replay after its group resets', () => {
    render(
      <Reveal group="experience">
        <p>Experience.</p>
      </Reveal>,
    )

    const reveal = screen.getByText('Experience.').parentElement
    expect(reveal).not.toHaveAttribute('data-revealed')
    expect(observers.length).toBeGreaterThan(0)

    const observer = observers[observers.length - 1]
    act(() => {
      observer.callback(
        [{ isIntersecting: true, target: reveal! } as unknown as IntersectionObserverEntry],
        observer as unknown as IntersectionObserver,
      )
    })

    expect(reveal).toHaveAttribute('data-revealed')
    expect(observer.disconnect).toHaveBeenCalled()

    const generation = getRevealGeneration('experience')
    act(() => {
      resetRevealGroup('experience')
    })
    expect(getRevealGeneration('experience')).toBe(generation + 1)
    expect(reveal).not.toHaveAttribute('data-revealed')

    const replay = observers[observers.length - 1]
    act(() => {
      replay.callback(
        [{ isIntersecting: true, target: reveal! } as unknown as IntersectionObserverEntry],
        replay as unknown as IntersectionObserver,
      )
    })
    expect(reveal).toHaveAttribute('data-revealed')
  })

  it('shows content immediately when reduced motion is preferred', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    )

    render(
      <Reveal group="education">
        <p>Education.</p>
      </Reveal>,
    )

    expect(screen.getByText('Education.').parentElement).toHaveAttribute('data-revealed')
    expect(observers).toHaveLength(0)
  })

  it('reveals when keyboard focus enters, before the observer fires', async () => {
    const user = userEvent.setup()
    render(
      <Reveal group="featured">
        <button type="button">Read More</button>
      </Reveal>,
    )

    await user.tab()

    expect(screen.getByRole('button', { name: 'Read More' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Read More' }).parentElement).toHaveAttribute('data-revealed')
  })
})