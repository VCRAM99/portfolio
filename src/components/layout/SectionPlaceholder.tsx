
type SectionPlaceholderProps = {
    id: string
    eyebrow?: string
    title: string
    description: string
    as?: 'section' | 'div'
    headingLevel?: 'h2' | 'h3'
  }
  
  export function SectionPlaceholder({
    id,
    eyebrow,
    title,
    description,
    as: Element = 'section',
    headingLevel: Heading = 'h2',
  }: SectionPlaceholderProps) {
    return (
      <Element
        id={id}
        aria-labelledby={`${id}-heading`}
        className="flex min-h-screen items-center border-b border-border px-6 py-24 md:px-16"
      >
        <div className="mx-auto w-full max-w-6xl">
          {eyebrow ? (
            <p className="mb-5 text-xs font-medium tracking-[0.25em] text-muted uppercase">
              {eyebrow}
            </p>
          ) : null}
  
          <Heading
            id={`${id}-heading`}
            className="font-serif text-5xl md:text-7xl"
          >
            {title}
          </Heading>
  
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {description}
          </p>
        </div>
      </Element>
    )
  }
  