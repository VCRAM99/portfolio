import { Plus } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

const features = [
  {
    id: 'adaptive-ai',
    title: 'Adaptive AI',
    description: 'A Stockfish-powered opponent adjusts its play to your estimated skill level.',
    itemClassName: 'min-[90rem]:absolute min-[90rem]:top-0 min-[90rem]:left-0 min-[90rem]:flex min-[90rem]:h-(--stage-pad) min-[90rem]:flex-col',
    lineClassName: 'min-[90rem]:order-2 min-[90rem]:ml-5 min-[90rem]:w-px min-[90rem]:flex-1',
    panelClassName: 'min-[90rem]:top-0 min-[90rem]:left-[calc(100%+0.75rem)] min-[90rem]:w-56',
  },
  {
    id: 'move-analysis',
    title: 'Move Analysis',
    description: 'Review completed games with engine evaluations and seven custom move classifications.',
    itemClassName:
      'min-[90rem]:absolute min-[90rem]:top-[32%] min-[90rem]:left-[calc(100%+0.75rem)] min-[90rem]:max-w-[calc((100vw-72rem)/2-0.75rem)]',
    lineClassName: 'min-[90rem]:absolute min-[90rem]:top-1/2 min-[90rem]:right-full min-[90rem]:h-px min-[90rem]:w-3',
    panelClassName: 'min-[90rem]:top-[calc(100%+0.75rem)] min-[90rem]:right-0 min-[90rem]:w-full',
  },
  {
    id: 'custom-experience',
    title: 'Custom Experience',
    description: 'Choose training modes, board themes, and piece styles to personalize your experience.',
    itemClassName: 'min-[90rem]:absolute min-[90rem]:bottom-0 min-[90rem]:left-0',
    lineClassName: 'min-[90rem]:absolute min-[90rem]:bottom-full min-[90rem]:left-4 min-[90rem]:h-6 min-[90rem]:w-px',
    panelClassName: 'min-[90rem]:bottom-0 min-[90rem]:left-[calc(100%+0.75rem)] min-[90rem]:w-56',
  },
] as const

export function FeatureHotspots() {
  const baseId = useId()
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    if (!openId) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpenId(null)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openId])

  return (
    <ul aria-label="Feature details" className="mt-6 flex flex-col gap-3 min-[90rem]:absolute min-[90rem]:inset-0 min-[90rem]:mt-0 min-[90rem]:block">
      {features.map((feature) => {
        const open = openId === feature.id
        const panelId = `${baseId}-${feature.id}`

        return (
          <li key={feature.id} className={`relative max-w-full lg:z-10 ${feature.itemClassName}`}>
            <span aria-hidden="true" className={`pointer-events-none hidden bg-border min-[90rem]:block ${feature.lineClassName}`} />
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenId((current) => (current === feature.id ? null : feature.id))}
              className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-border bg-background py-1.5 pr-4 pl-1.5 text-left text-foreground transition duration-200 hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-accent motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition duration-200 motion-reduce:transition-none ${
                  open ? 'rotate-45 border-foreground' : ''
                }`}
              >
                <Plus size={14} strokeWidth={1.75} />
              </span>
              <span className="font-serif text-lg leading-none">{feature.title}</span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-label={feature.title}
              hidden={!open}
              className={`max-w-full min-[90rem]:absolute min-[90rem]:z-20 min-[90rem]:max-w-none ${feature.panelClassName}`}
            >
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted motion-safe:animate-[hotspot-reveal_200ms_ease-out] lg:mt-0 lg:rounded-lg lg:border lg:border-border lg:bg-background lg:p-3 lg:shadow-[0_16px_40px_-24px_rgb(0_0_0/0.45)] motion-reduce:animate-none">
                {feature.description}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
