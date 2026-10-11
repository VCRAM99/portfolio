import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { OtherProject } from '../../data/otherProjects'
import type { ResolvedTheme } from '../../hooks/useTheme'

function readTheme(): ResolvedTheme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

type OtherProjectCardProps = {
  project: OtherProject
}

export function OtherProjectCard({ project }: OtherProjectCardProps) {
  const [theme, setTheme] = useState<ResolvedTheme>(readTheme)
  const [expanded, setExpanded] = useState(false)
  const image = project.image
  const demoUrl = project.liveUrl
  const descriptionId = `${project.id}-description`

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      setTheme(readTheme())
    })

    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-background p-6 transition duration-200 hover:border-foreground hover:shadow-[0_18px_40px_-28px_rgb(0_0_0/0.45)] motion-reduce:transition-none sm:p-8">
      {image ? (
        <div className="flex h-40 items-center justify-center sm:h-48">
          <img
            src={theme === 'dark' ? image.darkSrc : image.lightSrc}
            alt={image.alt}
            width={image.width}
            height={image.height}
            decoding="async"
            className="h-full w-full object-contain"
          />
        </div>
      ) : null}

      <h4 id={`${project.id}-title`} className="mt-8 font-serif text-4xl leading-none tracking-tight">
        {project.title}
      </h4>
      <p className="mt-3 text-xs font-medium tracking-[0.18em] text-muted uppercase">{project.category}</p>
      <div
        id={descriptionId}
        aria-hidden={expanded ? undefined : true}
        inert={expanded ? undefined : true}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pt-4 text-sm leading-relaxed text-muted motion-safe:animate-[hotspot-reveal_200ms_ease-out] md:text-base motion-reduce:animate-none">
            {project.description}
          </p>
        </div>
      </div>

      <ul aria-label={`${project.title} technologies`} className="mt-6 flex flex-wrap gap-2">
        {project.technologies.map((technology) => (
          <li key={technology} className="rounded-full border border-border px-3 py-1 text-xs tracking-wide text-muted">
            {technology}
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={descriptionId}
        onClick={() => setExpanded((current) => !current)}
        className="mt-6 inline-flex min-h-11 w-fit items-center gap-1.5 text-sm tracking-wide text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-accent"
      >
        {expanded ? 'Show Less' : 'Read More'}
        <ChevronDown
          aria-hidden="true"
          size={16}
          strokeWidth={1.75}
          className={`transition duration-200 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {demoUrl ? (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 w-fit items-center gap-1.5 text-sm tracking-wide text-foreground underline-offset-4 transition duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-accent motion-reduce:transition-none"
        >
          Watch Demo
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
        </a>
      ) : null}
    </article>
  )
}
