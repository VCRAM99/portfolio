import { FeaturedProject } from './FeaturedProject'
import { OtherProjects } from './OtherProjects'

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-24 overflow-x-clip xl:scroll-mt-0">
      <div id="featured-projects" className="section-chapter scroll-mt-24 px-6 py-16 md:px-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <FeaturedProject />
        </div>
      </div>

      <OtherProjects />
    </section>
  )
}
