import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import {
  getRevealGeneration,
  subscribeRevealGroup,
  type RevealGroupId,
} from './revealGroup'

type RevealProps = {
  group: RevealGroupId
  children: ReactNode
  className?: string
  delayMs?: number
}

function reducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function canObserve() {
  return typeof IntersectionObserver !== 'undefined'
}

const groupSubscribe = {
  experience: (listener: () => void) => subscribeRevealGroup('experience', listener),
  featured: (listener: () => void) => subscribeRevealGroup('featured', listener),
  other: (listener: () => void) => subscribeRevealGroup('other', listener),
  education: (listener: () => void) => subscribeRevealGroup('education', listener),
  contact: (listener: () => void) => subscribeRevealGroup('contact', listener),
} satisfies Record<RevealGroupId, (listener: () => void) => () => void>

export function Reveal({ group, children, className, delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const immediate = reducedMotion() || !canObserve()
  const generation = useSyncExternalStore(
    groupSubscribe[group],
    () => getRevealGeneration(group),
    () => getRevealGeneration(group),
  )
  const [shownGeneration, setShownGeneration] = useState<number | null>(() => (immediate ? generation : null))
  const revealed = immediate || shownGeneration === generation

  useEffect(() => {
    const node = ref.current
    if (!node || revealed) return

    let active = true
    const show = () => {
      if (!active) return
      setShownGeneration(getRevealGeneration(group))
    }

    const desktop = window.matchMedia('(min-width: 80rem)').matches
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        show()
        observer.disconnect()
      },
      { root: null, rootMargin: desktop ? '-16px 0px -5% 0px' : '0px 0px -5% 0px', threshold: 0 },
    )

    observer.observe(node)

    return () => {
      active = false
      observer.disconnect()
    }
  }, [group, revealed])

  return (
    <div
      ref={ref}
      className={className ? `reveal ${className}` : 'reveal'}
      data-revealed={revealed ? '' : undefined}
      data-reveal-group={group}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
      onFocusCapture={() => setShownGeneration(getRevealGeneration(group))}
    >
      {children}
    </div>
  )
}
