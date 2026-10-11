import { useActiveSection } from '../../hooks/useActiveSection'
import { DesktopNavigation } from './DesktopNavigation'
import { MobileNavigation } from './MobileNavigation'

export function SiteHeader() {
  const activeSection = useActiveSection()

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <DesktopNavigation activeSection={activeSection} />
      <MobileNavigation activeSection={activeSection} />
    </header>
  )
}
