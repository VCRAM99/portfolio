import type { SectionId } from '../../data/navigation'
import { DesktopNavigation } from './DesktopNavigation'
import { MobileNavigation } from './MobileNavigation'

type SiteHeaderProps = {
  activeSection: SectionId
}

export function SiteHeader({ activeSection }: SiteHeaderProps) {

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <a
        href="#home"
        aria-label="Varun Ramanathan — Home"
        aria-current={activeSection === 'home' ? 'true' : undefined}
        className="pointer-events-auto fixed top-4 left-[4.5rem] z-50 flex size-8 items-center justify-center rounded-full text-foreground outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:left-6"
      >
        <span
          aria-hidden="true"
          className="size-7 bg-foreground"
          style={{
            maskImage: 'url(/favicon.svg)',
            WebkitMaskImage: 'url(/favicon.svg)',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
          }}
        />
      </a>
      <DesktopNavigation activeSection={activeSection} />
      <MobileNavigation activeSection={activeSection} />
    </header>
  )
}
