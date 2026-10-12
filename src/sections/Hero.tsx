import { ArrowUpRight } from 'lucide-react'
import { HeroActions } from '../components/ui/HeroActions'

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative isolate min-h-[100svh] overflow-hidden xl:snap-start"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-background" aria-hidden="true">
        <div className="hero-aurora absolute -inset-x-[4%] -inset-y-[2%]">
          <picture className="block h-full w-full">
            <source
              media="(min-width: 768px)"
              srcSet="/images/hero-aurora-desktop.webp"
              type="image/webp"
            />
            <img
              src="/images/hero-aurora-mobile.webp"
              alt=""
              fetchPriority="high"
              decoding="async"
              className="h-full w-full max-w-none object-cover object-[center_72%]"
            />
          </picture>
        </div>
        <div className="hero-aurora-shade absolute inset-0" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] items-center px-6 pt-28 pb-32 md:px-16 md:pt-32 lg:px-24">
        <div className="w-full min-w-0 max-w-6xl">
          <h1
            id="home-heading"
            className="font-serif text-[clamp(1.7rem,0.35rem+4vw,4.15rem)] leading-[1.05] tracking-tight text-foreground lg:whitespace-nowrap"
          >
            Varun Ramanathan.
          </h1>

          <p className="mt-4 font-sans text-[clamp(2.15rem,0.4rem+5.6vw,6.75rem)] leading-[0.92] font-medium tracking-[-0.035em] text-foreground lg:whitespace-nowrap">
            Software Engineer.
          </p>

          <p className="hero-description mt-6 font-sans text-[clamp(1rem,0.92rem+0.25vw,1.25rem)] leading-relaxed text-white">
            Experienced in designing and engineering scalable, AI-powered software applications.
          </p>
          <a
            href="#projects"
            className="hero-explore group mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm tracking-wide text-white underline-offset-4 transition duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-accent motion-reduce:transition-none"
          >
            Explore Projects
            <ArrowUpRight
              aria-hidden="true"
              size={16}
              strokeWidth={1.75}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-none"
            />
          </a>
          <HeroActions />
        </div>
      </div>
    </section>
  )
}
