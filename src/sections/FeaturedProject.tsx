import { ArrowUpRight } from 'lucide-react'
import { FeatureHotspots } from '../components/projects/FeatureHotspots'
import { ProjectGallery } from '../components/projects/ProjectGallery'
import { ProjectStage } from '../components/projects/ProjectStage'
import { Reveal } from '../components/ui/Reveal'
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
        <Reveal group="featured" className="min-w-0 lg:col-start-1 lg:row-start-1">
          <p className="text-xs font-medium tracking-[0.25em] text-muted uppercase">Featured Projects</p>

          <h2
            id="projects-heading"
            className="mt-3 max-w-[12ch] font-serif text-[clamp(2.75rem,4.2vw,3.75rem)] leading-[0.92] tracking-tight text-balance"
          >
            {project.title}.
          </h2>

          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{project.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={project.discoverUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${actionClassName} border border-border text-foreground hover:border-foreground`}
            >
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
        </Reveal>

        <Reveal group="featured" className="min-w-0 lg:col-start-2 lg:row-start-1" delayMs={80}>
          <div className="relative mt-10 [--stage-pad:3.5rem] lg:mt-0 xl:mx-auto xl:max-w-[26rem] min-[90rem]:pt-(--stage-pad) min-[90rem]:pb-8">
            <ProjectStage laptop={featuredProjectDevices.laptop} phone={featuredProjectDevices.phone} />
            <FeatureHotspots />
          </div>
        </Reveal>
      </div>

      <div className="mt-8 xl:mt-10">
        <ProjectGallery gallery={project.gallery} />
      </div>
    </article>
  )
}
