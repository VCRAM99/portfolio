import { OtherProjectCard } from '../components/projects/OtherProjectCard'
import { Reveal } from '../components/ui/Reveal'
import { otherProjects } from '../data/otherProjects'

export function OtherProjects() {
  return (
    <div id="other-projects" aria-labelledby="other-projects-heading" className="section-chapter scroll-mt-24 px-6 py-16 md:px-16 lg:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal group="other">
          <h2 id="other-projects-heading" className="font-serif text-5xl xl:text-6xl">
            Other Projects.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Exploring applied machine learning, robotics, and practical software engineering.
          </p>
        </Reveal>

        <ul className="mt-8 grid items-stretch gap-4 md:grid-cols-2 xl:mt-10 xl:gap-5">
          {otherProjects.map((project, index) => (
            <li key={project.id} className="min-w-0">
              <Reveal group="other" className="h-full" delayMs={index * 80}>
                <OtherProjectCard project={project} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
