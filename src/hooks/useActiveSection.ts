import { useEffect, useState } from 'react'
import { navigationItems, type SectionId } from '../data/navigation'

const sectionIds = navigationItems.map((item) => item.id)

function isSectionId(id: string): id is SectionId {
  return sectionIds.some((sectionId) => sectionId === id)
}

function coverageInView(entry: IntersectionObserverEntry) {
  const height = entry.intersectionRect?.height ?? 0
  // Prefer the band height so a tall section is not outweighed by a shorter neighbor's ratio.
  return height > 0 ? height : entry.intersectionRatio
}

export function useActiveSection(): SectionId {
  const [activeSection, setActiveSection] = useState<SectionId>(sectionIds[0])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    if (sections.length === 0) return

    const ratios = new Map<SectionId, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (!isSectionId(id)) continue

          ratios.set(id, entry.isIntersecting ? coverageInView(entry) : 0)
        }

        setActiveSection((current) => {
          let next: SectionId | null = null
          let bestRatio = 0

          for (const id of sectionIds) {
            const ratio = ratios.get(id) ?? 0
            if (ratio > bestRatio) {
              bestRatio = ratio
              next = id
            }
          }

          return next ?? current
        })
      },
      {
        // Narrow band through the upper-middle of the viewport.
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return activeSection
}
