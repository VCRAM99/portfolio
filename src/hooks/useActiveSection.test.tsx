import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { navigationItems } from '../data/navigation'
import { useActiveSection } from './useActiveSection'

type ObserverInstance = {
  callback: IntersectionObserverCallback
  observe: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}

const observers: ObserverInstance[] = []

beforeEach(() => {
  observers.length = 0

  document.body.innerHTML = navigationItems
    .map((item) => `<section id="${item.id}"></section>`)
    .join('')

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      callback: IntersectionObserverCallback
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
      takeRecords = vi.fn(() => [])
      root = null
      rootMargin = ''
      thresholds: number[] = []

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
        observers.push(this)
      }
    },
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function emit(entries: Array<Partial<IntersectionObserverEntry> & { target: Element }>) {
  const observer = observers[0]
  act(() => {
    observer.callback(
      entries as IntersectionObserverEntry[],
      observer as unknown as IntersectionObserver,
    )
  })
}

describe('useActiveSection', () => {
  it('defaults to the first section', () => {
    const { result } = renderHook(() => useActiveSection())

    expect(result.current).toBe('home')
  })

  it('observes each navigation section and updates the active id', () => {
    const { result } = renderHook(() => useActiveSection())

    expect(observers[0].observe).toHaveBeenCalledTimes(navigationItems.length)

    emit([
      { target: document.getElementById('home')!, isIntersecting: true, intersectionRatio: 0.2 },
      {
        target: document.getElementById('experience')!,
        isIntersecting: true,
        intersectionRatio: 0.8,
      },
    ])

    expect(result.current).toBe('experience')
  })

  it('keeps the current section when nothing intersects the viewport band', () => {
    const { result } = renderHook(() => useActiveSection())

    emit([
      {
        target: document.getElementById('projects')!,
        isIntersecting: true,
        intersectionRatio: 1,
      },
    ])

    emit([
      {
        target: document.getElementById('projects')!,
        isIntersecting: false,
        intersectionRatio: 0,
      },
    ])

    expect(result.current).toBe('projects')
  })

  it('keeps projects active while either subsection is in the viewport band', () => {
    document.body.innerHTML = `
      <section id="home"></section>
      <section id="experience"></section>
      <section id="projects">
        <div id="featured"></div>
        <div id="other-projects"></div>
      </section>
      <section id="education"></section>
      <section id="contact"></section>
    `

    const { result } = renderHook(() => useActiveSection())
    const projects = document.getElementById('projects')!

    emit([
      {
        target: document.getElementById('experience')!,
        isIntersecting: true,
        intersectionRatio: 0.4,
        intersectionRect: { height: 12 } as DOMRectReadOnly,
      },
      {
        target: projects,
        isIntersecting: true,
        intersectionRatio: 0.05,
        intersectionRect: { height: 80 } as DOMRectReadOnly,
      },
    ])

    expect(result.current).toBe('projects')

    emit([
      {
        target: document.getElementById('experience')!,
        isIntersecting: false,
        intersectionRatio: 0,
        intersectionRect: { height: 0 } as DOMRectReadOnly,
      },
      {
        target: projects,
        isIntersecting: true,
        intersectionRatio: 0.04,
        intersectionRect: { height: 80 } as DOMRectReadOnly,
      },
    ])

    expect(result.current).toBe('projects')
    expect(observers.at(-1)?.observe).toHaveBeenCalledWith(projects)
    expect(observers.at(-1)?.observe).not.toHaveBeenCalledWith(
      document.getElementById('featured'),
    )
  })

  it('disconnects the observer on unmount', () => {
    const { unmount } = renderHook(() => useActiveSection())
    const observer = observers[0]

    unmount()

    expect(observer.disconnect).toHaveBeenCalledOnce()
  })
})
