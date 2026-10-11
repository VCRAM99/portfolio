import { useEffect, useId, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navigationItems, type SectionId } from '../../data/navigation'

type MobileNavigationProps = {
  activeSection: SectionId
}

export function MobileNavigation({ activeSection }: MobileNavigationProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const panel = panelRef.current
    panel?.querySelector<HTMLAnchorElement>('a')?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        buttonRef.current?.focus({ preventScroll: true })
        return
      }

      if (event.key !== 'Tab' || !panel) return

      const links = [...panel.querySelectorAll<HTMLAnchorElement>('a')]
      if (links.length === 0) return

      const first = links[0]
      const last = links[links.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (panel?.contains(target) || buttonRef.current?.contains(target)) return

      const focusInsidePanel = !!panel?.contains(document.activeElement)
      setOpen(false)

      if (
        focusInsidePanel &&
        target instanceof Element &&
        !target.closest('a, button, input, select, textarea, [tabindex]')
      ) {
        buttonRef.current?.focus({ preventScroll: true })
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  function handleNavigate(sectionId: SectionId) {
    setOpen(false)

    const section = document.getElementById(sectionId)
    if (!section) return

    section.setAttribute('tabindex', '-1')
    section.focus({ preventScroll: true })
  }

  return (
    <div className="pointer-events-auto lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="fixed top-4 left-4 z-50 flex size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-lg outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <X aria-hidden="true" size={18} />
        ) : (
          <Menu aria-hidden="true" size={18} />
        )}
      </button>

      <div
        id={menuId}
        ref={panelRef}
        hidden={!open}
        inert={!open}
        className="fixed top-20 left-4 z-40 w-64 rounded-2xl border border-border bg-surface p-2 opacity-100 shadow-lg transition-opacity duration-200 ease-out starting:opacity-0 motion-reduce:transition-none"
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col">
            {navigationItems.map((item) => {
              const isActive = item.id === activeSection

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => handleNavigate(item.id)}
                    className={`block rounded-xl px-4 py-3 text-sm outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      isActive
                        ? 'bg-background text-foreground'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {item.label}
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
