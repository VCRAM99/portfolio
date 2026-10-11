
import type { ReactNode } from 'react'
import { SiteHeader } from '../navigation/SiteHeader'

type SiteLayoutProps = {
  children: ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-3"
      >
        Skip to content
      </a>

      <SiteHeader />

      {children}
    </div>
  )
}
