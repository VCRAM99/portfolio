import type { CSSProperties } from 'react'
import type { EmployerId, ExperienceEntry } from '../../data/experience'
import { experienceAccent } from './accent'
import { EmployerLogo } from './EmployerLogo'

type ExperienceCardProps = {
  entry: ExperienceEntry
  selected: boolean
  onSelect: (id: EmployerId) => void
}

export function ExperienceCard({ entry, selected, onSelect }: ExperienceCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-controls="experience-details"
      onClick={() => onSelect(entry.id)}
      style={{ '--experience-accent': experienceAccent[entry.accent] } as CSSProperties}
      className="flex h-full min-h-[5.25rem] cursor-pointer flex-col justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-3 text-left transition-colors duration-200 outline-none hover:border-(--experience-accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--experience-accent) focus-visible:outline-solid aria-pressed:border-(--experience-accent) aria-pressed:bg-[color-mix(in_oklab,var(--experience-accent)_14%,transparent)] motion-reduce:transition-none"
    >
      <span className="flex h-8 items-center">
        <EmployerLogo id={entry.id} variant="card" />
      </span>
      <span>
        <span className="block text-sm leading-snug font-medium text-foreground">{entry.name}</span>
        <span className="mt-1 block text-sm text-muted">{entry.dates}</span>
      </span>
    </button>
  )
}
