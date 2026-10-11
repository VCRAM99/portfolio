
type SectionPlaceholderProps = {
    id: string
    eyebrow: string
    title: string
    description: string
  }
  
  export function SectionPlaceholder({
    id,
    eyebrow,
    title,
    description,
  }: SectionPlaceholderProps) {
    return (
      <section
        id={id}
        aria-labelledby={`${id}-heading`}
        className="flex min-h-screen items-center border-b border-border px-6 py-24 md:px-16"
      >
        <div className="mx-auto w-full max-w-6xl">
          <p className="mb-5 text-xs font-medium tracking-[0.25em] text-muted uppercase">
            {eyebrow}
          </p>
  
          <h2
            id={`${id}-heading`}
            className="font-serif text-5xl md:text-7xl"
          >
            {title}
          </h2>
  
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {description}
          </p>
        </div>
      </section>
    )
  }
  