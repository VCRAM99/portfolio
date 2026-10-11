import type { ExperienceEntry } from '../../data/experience'

const accomplishmentLimit = 3

function accomplishmentsFor(entry: ExperienceEntry) {
  if (entry.roles.length === 1) {
    return entry.roles[0].achievements.slice(0, accomplishmentLimit)
  }

  const selected: string[] = []
  const remaining = entry.roles.map((role) => [...role.achievements])

  while (selected.length < accomplishmentLimit && remaining.some((items) => items.length > 0)) {
    for (const items of remaining) {
      const next = items.shift()
      if (!next) continue
      selected.push(next)
      if (selected.length === accomplishmentLimit) break
    }
  }

  return selected
}

type ExperienceDetailsProps = {
  entry: ExperienceEntry
}

export function ExperienceDetailContent({ entry }: ExperienceDetailsProps) {
  const accomplishments = accomplishmentsFor(entry)
  const technologies = entry.technologies ?? []

  return (
    <>
      {entry.roles.length === 1 ? (
        <p className="mt-3 text-sm text-muted md:text-base">
          <span className="text-foreground">{entry.roles[0].title}</span>
          <span className="px-2 text-muted" aria-hidden="true">
            /
          </span>
          {entry.roles[0].dates}
        </p>
      ) : (
        <ul className="mt-3 space-y-1">
          {entry.roles.map((role) => (
            <li key={role.title} className="text-sm text-muted md:text-base">
              <span className="text-foreground">{role.title}</span>
              <span className="px-2 text-muted" aria-hidden="true">
                /
              </span>
              {role.dates}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted md:text-base">{entry.summary}</p>

      <ul aria-label="Accomplishments" className="mt-5 space-y-2">
        {accomplishments.map((achievement) => (
          <li key={achievement} className="flex gap-3 text-sm leading-relaxed text-foreground md:text-base">
            <span className="mt-[0.55em] h-px w-3 shrink-0 bg-border" aria-hidden="true" />
            <span>{achievement}</span>
          </li>
        ))}
      </ul>

      {technologies.length > 0 ? (
        <ul aria-label="Technologies" className="mt-6 flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <li
              key={technology}
              className="rounded-full border border-border px-3 py-1 text-xs tracking-wide text-muted"
            >
              {technology}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}

export function ExperienceDetails({ entry }: ExperienceDetailsProps) {
  return (
    <div
      id="experience-details"
      className="mt-4 rounded-lg border border-border bg-surface px-6 py-6 lg:min-h-[25rem]"
    >
      <h3 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">{entry.name}</h3>
      <ExperienceDetailContent entry={entry} />
    </div>
  )
}
