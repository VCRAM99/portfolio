import { FeaturedProject } from './FeaturedProject'
import { OtherProjects } from './OtherProjects'

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-24 overflow-x-clip">
      <div className="border-b border-border px-6 py-24 md:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <FeaturedProject />
        </div>
      </div>

      <OtherProjects />
    </section>
  )
}
