import { useEffect, useRef, useState } from 'react'
import { navigationItems, type SectionId } from '../../data/navigation'

type DesktopNavigationProps = {
  activeSection: SectionId
}

const COLLAPSE_DELAY_MS = 160

export function DesktopNavigation({ activeSection }: DesktopNavigationProps) {
  const [pointerNear, setPointerNear] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const collapseTimer = useRef<number | null>(null)
  const expanded = pointerNear || hasFocus

  useEffect(() => {
    return () => {
      if (collapseTimer.current !== null) {
        window.clearTimeout(collapseTimer.current)
      }
    }
  }, [])

  function expandFromPointer() {
    if (collapseTimer.current !== null) {
      window.clearTimeout(collapseTimer.current)
      collapseTimer.current = null
    }

    setPointerNear(true)
  }

  function collapseFromPointer() {
    if (collapseTimer.current !== null) {
      window.clearTimeout(collapseTimer.current)
    }

    collapseTimer.current = window.setTimeout(() => {
      collapseTimer.current = null
      setPointerNear(false)
    }, COLLAPSE_DELAY_MS)
  }

  return (
    <div className="hidden justify-center lg:flex">
      <div
        className="pointer-events-auto flex w-[min(44rem,calc(100vw-8rem))] justify-center px-10 pt-4 pb-10"
        onPointerEnter={expandFromPointer}
        onPointerLeave={collapseFromPointer}
      >
        <nav
          aria-label="Primary"
          data-expanded={expanded}
          onFocus={() => setHasFocus(true)}
          onBlur={(event) => {
            const next = event.relatedTarget
            if (next instanceof Node && event.currentTarget.contains(next)) return
            setHasFocus(false)
          }}
          className={`rounded-full border border-border bg-surface/90 shadow-lg backdrop-blur-md transition-[padding] duration-300 ease-out motion-reduce:transition-none ${
            expanded ? 'px-2 py-1.5' : 'px-3.5 py-3'
          }`}
        >
          <ul className="flex items-center">
            {navigationItems.map((item) => {
              const isActive = item.id === activeSection

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex items-center rounded-full outline-none transition-colors duration-300 ease-out focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${
                      expanded ? 'px-2.5 py-1.5' : 'px-1.5 py-1'
                    } ${
                      isActive
                        ? 'text-foreground'
                        : 'text-muted hover:text-foreground'
                    } ${isActive && expanded ? 'bg-background' : ''}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`shrink-0 rounded-full transition-all duration-300 ease-out motion-reduce:transition-none ${
                        isActive
                          ? 'h-1.5 w-4 bg-accent'
                          : 'size-1.5 bg-current opacity-60'
                      }`}
                    />
                    <span
                      className={`grid transition-[grid-template-columns,opacity] duration-300 ease-out motion-reduce:transition-none ${
                        expanded
                          ? 'grid-cols-[1fr] opacity-100'
                          : 'grid-cols-[0fr] opacity-0'
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="pl-2 text-sm tracking-wide whitespace-nowrap">
                          {item.label}
                        </span>
                      </span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}
