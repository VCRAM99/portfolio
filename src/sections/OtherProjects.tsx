import { OtherProjectCard } from '../components/projects/OtherProjectCard'
import { otherProjects } from '../data/otherProjects'

export function OtherProjects() {
  return (
    <div id="other-projects" aria-labelledby="other-projects-heading" className="scroll-mt-24 border-b border-border px-6 py-24 md:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <h3 id="other-projects-heading" className="font-serif text-5xl md:text-7xl">
          Other Projects.
        </h3>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          Exploring applied machine learning, robotics, and practical software engineering.
        </p>

        <ul className="mt-14 grid items-stretch gap-6 md:grid-cols-2">
          {otherProjects.map((project) => (
            <li key={project.id} className="min-w-0">
              <OtherProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
