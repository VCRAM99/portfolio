import { FeaturedProject } from './FeaturedProject'
import { OtherProjects } from './OtherProjects'

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="sr-only">
        Projects
      </h2>
      <FeaturedProject />
      <OtherProjects />
    </section>
  )
}
