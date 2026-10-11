import { ArrowUpRight } from 'lucide-react'
import { FeatureHotspots } from '../components/projects/FeatureHotspots'
import { ProjectGallery } from '../components/projects/ProjectGallery'
import { ProjectStage } from '../components/projects/ProjectStage'
import {
  featuredProject as defaultProject,
  featuredProjectDevices,
  type FeaturedProject as FeaturedProjectData,
} from '../data/featuredProject'

const actionClassName =
  'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-5 text-sm tracking-wide transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-accent motion-reduce:transition-none'

type FeaturedProjectProps = {
  project?: FeaturedProjectData
}

export function FeaturedProject({ project = defaultProject }: FeaturedProjectProps) {
  return (
    <article aria-labelledby="projects-heading">
      <div className="lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-x-14 xl:gap-x-20">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <p className="text-xs font-medium tracking-[0.25em] text-muted uppercase">Featured Projects</p>

          <h2
            id="projects-heading"
            className="mt-5 max-w-[12ch] font-serif text-[clamp(3.4rem,6.4vw,6.25rem)] leading-[0.9] tracking-tight text-balance"
          >
            {project.title}.
          </h2>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">{project.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#featured-project-gallery" className={`${actionClassName} border border-border text-foreground hover:border-foreground`}>
              Discover More
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${actionClassName} bg-foreground text-background hover:opacity-90 motion-reduce:hover:opacity-100`}
            >
              Try Me
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
            </a>
          </div>
        </div>

        <div className="relative mt-12 min-w-0 [--stage-pad:6rem] lg:col-start-2 lg:row-start-1 lg:mt-0 min-[90rem]:pt-(--stage-pad) min-[90rem]:pb-16">
          <ProjectStage laptop={featuredProjectDevices.laptop} phone={featuredProjectDevices.phone} />
          <FeatureHotspots />
        </div>
      </div>

      <div className="mt-14 md:mt-20">
        <ProjectGallery gallery={project.gallery} />
      </div>
    </article>
  )
}
