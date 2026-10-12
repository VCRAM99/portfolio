import type { CSSProperties } from 'react'
import { ChevronDown } from 'lucide-react'
import type { EmployerId, ExperienceEntry } from '../../data/experience'
import { experience } from '../../data/experience'
import { Reveal } from '../ui/Reveal'
import { experienceAccent } from './accent'
import { EmployerLogo } from './EmployerLogo'
import { ExperienceDetailContent } from './ExperienceDetails'

type ExperienceAccordionProps = {
  selectedId: EmployerId | null
  onToggle: (id: EmployerId) => void
}

export function ExperienceAccordion({ selectedId, onToggle }: ExperienceAccordionProps) {
  return (
    <div className="mt-12 flex flex-col gap-3">
      {experience.map((entry, index) => (
        <Reveal key={entry.id} group="experience" delayMs={index * 70}>
          <ExperienceAccordionItem
            entry={entry}
            expanded={entry.id === selectedId}
            onToggle={onToggle}
          />
        </Reveal>
      ))}
    </div>
  )
}

type ExperienceAccordionItemProps = {
  entry: ExperienceEntry
  expanded: boolean
  onToggle: (id: EmployerId) => void
}

function ExperienceAccordionItem({ entry, expanded, onToggle }: ExperienceAccordionItemProps) {
  const buttonId = `experience-accordion-${entry.id}`
  const panelId = `experience-panel-${entry.id}`

  return (
    <div
      style={{ '--experience-accent': experienceAccent[entry.accent] } as CSSProperties}
      className={`rounded-lg border bg-surface transition-colors duration-200 motion-reduce:transition-none ${
        expanded
          ? 'border-(--experience-accent) bg-[color-mix(in_oklab,var(--experience-accent)_14%,transparent)]'
          : 'border-border'
      }`}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => onToggle(entry.id)}
        className="flex min-h-14 w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--experience-accent) focus-visible:outline-solid"
      >
        <span className="flex h-10 w-[6.75rem] shrink-0 items-center">
          <EmployerLogo id={entry.id} variant="header" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base leading-snug font-medium text-foreground">{entry.name}</span>
          <span className="mt-1 block text-sm text-muted">{entry.dates}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          size={18}
          strokeWidth={1.75}
          className={`shrink-0 text-muted transition-transform duration-200 motion-reduce:transition-none ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!expanded}
        className="px-4 pt-1 pb-5"
      >
        <ExperienceDetailContent entry={entry} />
      </div>
    </div>
  )
}
