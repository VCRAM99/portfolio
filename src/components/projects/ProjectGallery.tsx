import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'
import type { ProjectGalleryImage } from '../../data/featuredProject'

const gallerySlotCount = 5
const captionFadeMs = 150
const lightboxOpenMs = 300
const lightboxCloseMs = 250

const controlClassName =
  'inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition duration-200 hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none'

type ProjectGalleryProps = {
  gallery: readonly ProjectGalleryImage[]
}

type LightboxPhase = 'closed' | 'opening' | 'open' | 'closing'

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export function ProjectGallery({ gallery }: ProjectGalleryProps) {
  const images = [...gallery].sort((a, b) => a.order - b.order).slice(0, gallerySlotCount)
  const empty = images.length === 0
  const [index, setIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const [phase, setPhase] = useState<LightboxPhase>('closed')
  const [renderedCaption, setRenderedCaption] = useState(images[0]?.caption ?? '')
  const [captionVisible, setCaptionVisible] = useState(true)
  const stripRef = useRef<HTMLDivElement>(null)
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([])
  const closeRef = useRef<HTMLButtonElement>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLButtonElement | null>(null)
  const active = images[index]
  const previewIndex = focusedIndex ?? hoveredIndex
  const displayedCaption = images[previewIndex ?? index]?.caption ?? ''
  const lightboxVisible = phase !== 'closed'
  const dialogActive = phase === 'opening' || phase === 'open'
  const motionReduced = prefersReducedMotion()
  const lightboxShown = motionReduced || phase === 'open'

  useEffect(() => {
    const strip = stripRef.current
    const thumb = thumbRefs.current[index]
    if (!strip || !thumb) return

    const left = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2
    strip.scrollTo?.({
      left,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [index])

  useEffect(() => {
    if (displayedCaption === renderedCaption) return

    const reduce = prefersReducedMotion()
    const hide = window.setTimeout(() => {
      if (!reduce) setCaptionVisible(false)
    }, 0)
    const swap = window.setTimeout(() => {
      setRenderedCaption(displayedCaption)
      setCaptionVisible(true)
    }, reduce ? 0 : captionFadeMs / 2)

    return () => {
      window.clearTimeout(hide)
      window.clearTimeout(swap)
    }
  }, [displayedCaption, renderedCaption])

  useEffect(() => {
    if (phase !== 'opening') return

    let second = 0
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => setPhase('open'))
    })

    return () => {
      window.cancelAnimationFrame(first)
      window.cancelAnimationFrame(second)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'closing') return

    const timer = window.setTimeout(() => setPhase('closed'), lightboxCloseMs)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (!lightboxVisible) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (dialogActive) closeRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [lightboxVisible, dialogActive])

  function move(next: number) {
    setIndex(Math.min(Math.max(next, 0), images.length - 1))
  }

  function openLightbox(imageIndex: number) {
    move(imageIndex)
    returnFocusRef.current = thumbRefs.current[imageIndex]
    setPhase(prefersReducedMotion() ? 'open' : 'opening')
  }

  function closeLightbox() {
    returnFocusRef.current?.focus()
    setPhase(prefersReducedMotion() ? 'closed' : 'closing')
  }

  function onStripKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (images.length === 0) return

    const next =
      event.key === 'ArrowRight'
        ? Math.min(index + 1, images.length - 1)
        : event.key === 'ArrowLeft'
          ? Math.max(index - 1, 0)
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? images.length - 1
              : null

    if (next === null) return

    event.preventDefault()
    move(next)
    thumbRefs.current[next]?.focus()
  }

  function onStripBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget
    if (next instanceof Node && event.currentTarget.contains(next)) return
    setFocusedIndex(null)
  }

  function onLightboxKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeLightbox()
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(index + 1)
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(index - 1)
      return
    }

    if (event.key !== 'Tab' || !lightboxRef.current) return

    const focusable = [...lightboxRef.current.querySelectorAll<HTMLElement>('button:not([disabled])')]
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (!first || !last) return

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div id="featured-project-gallery" tabIndex={-1} data-project-gallery={empty ? 'empty' : 'ready'} className="scroll-mt-24 outline-none">
      {empty ? (
        <ol aria-hidden="true" className="grid grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: gallerySlotCount }, (_, slot) => (
            <li key={slot} className="h-12 rounded-md border border-border/80 bg-surface/60 sm:h-16 md:h-20" />
          ))}
        </ol>
      ) : (
        <div>
          <div className="flex items-end justify-between gap-4">
            <p
              id="featured-gallery-caption"
              className={`min-h-[4.75rem] min-w-0 font-serif text-xl leading-tight text-balance transition-opacity duration-150 md:min-h-16 md:text-2xl motion-reduce:transition-none ${
                captionVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {renderedCaption}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className={controlClassName}
                aria-label="Previous screenshot"
                disabled={index === 0}
                onClick={() => move(index - 1)}
              >
                <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className={controlClassName}
                aria-label="Next screenshot"
                disabled={index === images.length - 1}
                onClick={() => move(index + 1)}
              >
                <ChevronRight aria-hidden="true" size={18} strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <div
            ref={stripRef}
            role="group"
            aria-label="Screenshots"
            onKeyDown={onStripKeyDown}
            onMouseLeave={() => setHoveredIndex(null)}
            onBlur={onStripBlur}
            className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:thin] motion-reduce:scroll-auto"
          >
            {images.map((image, imageIndex) => {
              const selected = imageIndex === index

              return (
                <button
                  key={`${image.order}-${image.src}`}
                  ref={(node) => {
                    thumbRefs.current[imageIndex] = node
                  }}
                  type="button"
                  aria-current={selected ? 'true' : undefined}
                  aria-label={image.caption}
                  tabIndex={selected ? 0 : -1}
                  onMouseEnter={() => setHoveredIndex(imageIndex)}
                  onMouseLeave={(event) => {
                    const next = event.relatedTarget
                    if (next instanceof Node && stripRef.current?.contains(next)) return
                    setHoveredIndex(null)
                  }}
                  onFocus={() => setFocusedIndex(imageIndex)}
                  onClick={() => openLightbox(imageIndex)}
                  className="h-20 w-28 shrink-0 snap-start overflow-hidden rounded-md border border-border bg-surface p-1 transition-colors duration-200 hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-accent aria-[current=true]:border-foreground sm:h-24 sm:w-36 md:h-28 md:w-40 motion-reduce:transition-none"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={320}
                    height={200}
                    sizes="160px"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-contain"
                  />
                </button>
              )
            })}
          </div>

          {lightboxVisible && active ? (
            <div
              ref={lightboxRef}
              role={dialogActive ? 'dialog' : undefined}
              aria-modal={dialogActive ? true : undefined}
              aria-hidden={dialogActive ? undefined : true}
              aria-labelledby={dialogActive ? 'featured-lightbox-caption' : undefined}
              data-lightbox-phase={phase}
              onKeyDown={dialogActive ? onLightboxKeyDown : undefined}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            >
              <div
                data-testid="lightbox-backdrop"
                style={{ transitionDuration: phase === 'closing' ? `${lightboxCloseMs}ms` : `${lightboxOpenMs}ms` }}
                className={`absolute inset-0 bg-background/80 transition-opacity ease-out motion-reduce:transition-none motion-reduce:opacity-100 ${
                  lightboxShown ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={closeLightbox}
              />
              <div
                style={{ transitionDuration: phase === 'closing' ? `${lightboxCloseMs}ms` : `${lightboxOpenMs}ms` }}
                className={`relative z-10 flex max-h-[calc(100svh-2rem)] w-full max-w-5xl flex-col gap-4 overflow-y-auto transition ease-out motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none ${
                  lightboxShown ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-0'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p id="featured-lightbox-caption" className="font-serif text-xl leading-tight md:text-2xl">
                    {active.caption}
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    className={controlClassName}
                    aria-label="Close screenshot"
                    onClick={closeLightbox}
                  >
                    <X aria-hidden="true" size={18} strokeWidth={1.75} />
                  </button>
                </div>
                <img
                  src={active.src}
                  alt={active.alt}
                  sizes="(min-width: 1024px) 64rem, 100vw"
                  decoding="async"
                  className="mx-auto h-auto max-h-[calc(100svh-8.5rem)] w-auto max-w-full object-contain"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className={controlClassName}
                    aria-label="Previous screenshot"
                    disabled={index === 0}
                    onClick={() => move(index - 1)}
                  >
                    <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    className={controlClassName}
                    aria-label="Next screenshot"
                    disabled={index === images.length - 1}
                    onClick={() => move(index + 1)}
                  >
                    <ChevronRight aria-hidden="true" size={18} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
