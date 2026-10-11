import { featuredProjectDevices } from '../../data/featuredProject'

type DeviceImage = {
  readonly src: string
  readonly width: number
  readonly height: number
}

type ProjectStageProps = {
  laptop?: DeviceImage
  phone?: DeviceImage
}

export function ProjectStage({
  laptop = featuredProjectDevices.laptop,
  phone = featuredProjectDevices.phone,
}: ProjectStageProps) {
  const hasScreens = Boolean(laptop?.src && phone?.src)

  return (
    <div
      data-project-media={hasScreens ? 'gallery' : 'placeholder'}
      className="relative min-w-0"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-x-[6%] top-[8%] bottom-[10%] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--foreground)_12%,transparent),transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
        <div className="relative">
          <div className="overflow-hidden rounded-t-[1.15rem] border border-border bg-surface px-2 pt-2 pb-2 sm:rounded-t-[1.35rem] sm:px-2.5 sm:pt-2.5">
              <div className="mb-2 flex justify-center">
                <span className="size-1.5 rounded-full bg-border" />
              </div>
              {laptop?.src ? (
                <img
                  src={laptop.src}
                  alt=""
                  width={laptop.width}
                  height={laptop.height}
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  decoding="async"
                  className="h-auto w-full rounded-[0.7rem] sm:rounded-[0.85rem]"
                />
              ) : (
                <div className="aspect-[16/10] rounded-[0.7rem] bg-[color-mix(in_oklab,var(--foreground)_7%,var(--background))] sm:rounded-[0.85rem]" />
              )}
            </div>
            <div className="h-2 rounded-b-lg border border-t-0 border-border bg-surface sm:h-2.5" />
            <div className="mx-auto h-1 w-16 rounded-b-full bg-border sm:w-24" />

            <div className="absolute right-1 bottom-2 w-[30%] max-w-[7.5rem] sm:right-3 sm:bottom-3 sm:max-w-[8.75rem]">
              <div className="overflow-hidden rounded-[1.05rem] border border-border bg-surface p-1.5 shadow-[0_16px_36px_-18px_rgb(0_0_0/0.55)] sm:rounded-[1.25rem] sm:p-2">
                {phone?.src ? (
                  <img
                    src={phone.src}
                    alt=""
                    width={phone.width}
                    height={phone.height}
                    sizes="9rem"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full rounded-[0.7rem] sm:rounded-[0.85rem]"
                  />
                ) : (
                  <div className="aspect-[9/17] rounded-[0.7rem] bg-[color-mix(in_oklab,var(--foreground)_7%,var(--background))] sm:rounded-[0.85rem]" />
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
