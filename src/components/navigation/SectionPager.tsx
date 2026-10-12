import { ChevronDown, ChevronUp } from 'lucide-react'
import { navigationItems, type SectionId } from '../../data/navigation'

type SectionPagerProps = {
  activeSection: SectionId
}

const controlClassName =
  'inline-flex size-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted backdrop-blur-md transition duration-200 hover:border-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none'

export function SectionPager({ activeSection }: SectionPagerProps) {
  const index = navigationItems.findIndex((item) => item.id === activeSection)
  const previous = index > 0 ? navigationItems[index - 1] : null
  const next = index >= 0 && index < navigationItems.length - 1 ? navigationItems[index + 1] : null

  return (
    <div className="pointer-events-none fixed top-1/2 left-4 z-30 hidden -translate-y-1/2 xl:block">
      <nav aria-label="Section" className="pointer-events-auto flex flex-col gap-2">
        <SectionStep section={previous} direction="previous" />
        <SectionStep section={next} direction="next" />
      </nav>
    </div>
  )
}

function SectionStep({
  section,
  direction,
}: {
  section: (typeof navigationItems)[number] | null
  direction: 'previous' | 'next'
}) {
  const Icon = direction === 'previous' ? ChevronUp : ChevronDown
  const name = direction === 'previous' ? 'Previous section' : 'Next section'
  const label = section ? `${name}: ${section.label}` : name

  if (!section) {
    return (
      <button type="button" disabled aria-label={label} className={controlClassName}>
        <Icon aria-hidden="true" size={16} strokeWidth={1.75} />
      </button>
    )
  }

  return (
    <a href={`#${section.id}`} aria-label={label} className={controlClassName}>
      <Icon aria-hidden="true" size={16} strokeWidth={1.75} />
    </a>
  )
}
