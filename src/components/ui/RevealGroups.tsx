import { useEffect } from 'react'
import {
  chooseActiveGroup,
  resetRevealGroup,
  shouldResetGroup,
  type RevealGroupId,
  type RevealScores,
} from './revealGroup'

const groups: RevealGroupId[] = ['experience', 'featured', 'other', 'education', 'contact']

const sectionGroup: Record<string, RevealGroupId | null> = {
  home: null,
  experience: 'experience',
  'featured-projects': 'featured',
  'other-projects': 'other',
  education: 'education',
  contact: 'contact',
}

function emptyScores(): RevealScores {
  return { hero: 0, experience: 0, featured: 0, other: 0, education: 0, contact: 0 }
}

export function RevealGroups() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return

    const sections = Object.keys(sectionGroup)
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    if (sections.length === 0) return

    const band = new Map<string, number>()
    const onScreen = new Map<string, boolean>()
    const visited = new Set<RevealGroupId>()
    const departed = new Set<RevealGroupId>()
    const resetTimers = new Map<RevealGroupId, number>()
    let active: RevealGroupId | null = null

    function scores(): RevealScores {
      const next = emptyScores()
      for (const [id, height] of band) {
        const group = sectionGroup[id]
        if (group === null) next.hero += height
        else if (group) next[group] += height
      }
      return next
    }

    function groupOnScreen(group: RevealGroupId) {
      return sections.some((section) => sectionGroup[section.id] === group && onScreen.get(section.id) === true)
    }

    function sync() {
      const nextActive = chooseActiveGroup(scores(), active)
      if (nextActive !== active) {
        active = nextActive
        if (active) visited.add(active)
      }

      for (const group of groups) {
        const visible = groupOnScreen(group)
        if (visible) {
          visited.add(group)
          departed.delete(group)
          const timer = resetTimers.get(group)
          if (timer !== undefined) {
            window.clearTimeout(timer)
            resetTimers.delete(group)
          }
          continue
        }

        if (!shouldResetGroup(false, active === group, visited.has(group))) continue
        if (departed.has(group) || resetTimers.has(group)) continue

        resetTimers.set(
          group,
          window.setTimeout(() => {
            resetTimers.delete(group)
            if (groupOnScreen(group) || active === group || !visited.has(group) || departed.has(group)) return
            departed.add(group)
            resetRevealGroup(group)
          }, 180),
        )
      }
    }

    const bandObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          band.set(entry.target.id, entry.isIntersecting ? entry.intersectionRect.height : 0)
        }
        sync()
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: Array.from({ length: 21 }, (_, index) => index / 20),
      },
    )

    const desktop = window.matchMedia('(min-width: 80rem)')
    const screenObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          onScreen.set(entry.target.id, entry.isIntersecting)
        }
        sync()
      },
      { root: null, rootMargin: desktop.matches ? '-16px 0px -16px 0px' : '0px', threshold: 0 },
    )

    sections.forEach((section) => {
      bandObserver.observe(section)
      screenObserver.observe(section)
    })

    return () => {
      bandObserver.disconnect()
      screenObserver.disconnect()
      resetTimers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  return null
}
