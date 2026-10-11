import { useEffect, useState } from 'react'
import type { EducationEntry as EducationEntryData, EducationId } from '../../data/education'
import type { ResolvedTheme } from '../../hooks/useTheme'

const logoFrame: Record<EducationId, string> = {
  michigan: 'h-10 w-[12.75rem] sm:h-[2.8125rem] sm:w-[14.375rem]',
  mcmaster: 'h-[4.375rem] w-[8.0625rem] sm:h-20 sm:w-[9.1875rem]',
}

// Light exports include extra transparent margin. These fractions crop to the ink
// so both themes fill the same frame without stretching the artwork.
const logoInk: Record<EducationId, Record<ResolvedTheme, { x: number; y: number; w: number; h: number }>> = {
  michigan: {
    light: { x: 0.0688, y: 0.3431, w: 0.894, h: 0.3521 },
    dark: { x: 0.0263, y: 0.1111, w: 0.9473, h: 0.7778 },
  },
  mcmaster: {
    light: { x: 0.1071, y: 0.1081, w: 0.6979, h: 0.7635 },
    dark: { x: 0.0327, y: 0.0573, w: 0.9345, h: 0.8854 },
  },
}

function readTheme(): ResolvedTheme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

type EducationEntryProps = {
  entry: EducationEntryData
}

export function EducationEntry({ entry }: EducationEntryProps) {
  const [theme, setTheme] = useState<ResolvedTheme>(readTheme)
  const dark = theme === 'dark'
  const ink = logoInk[entry.id][theme]

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      setTheme(readTheme())
    })

    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return (
    <article className="grid grid-cols-1 items-center gap-y-3 py-5 md:grid-cols-[14.5rem_minmax(0,1fr)] md:gap-x-10 md:py-6">
      <div className={`relative justify-self-start overflow-hidden ${logoFrame[entry.id]}`}>
        <img
          src={dark ? entry.logo.darkSrc : entry.logo.lightSrc}
          alt={entry.university}
          width={dark ? entry.logo.darkWidth : entry.logo.lightWidth}
          height={dark ? entry.logo.darkHeight : entry.logo.lightHeight}
          draggable={false}
          decoding="async"
          className="absolute max-w-none object-contain"
          style={{
            width: `${100 / ink.w}%`,
            height: `${100 / ink.h}%`,
            left: `${(-ink.x / ink.w) * 100}%`,
            top: `${(-ink.y / ink.h) * 100}%`,
          }}
        />
      </div>

      <div className="min-w-0">
        <p className="text-base leading-snug text-foreground md:text-lg">{entry.degree}</p>
        <p className="mt-1 text-sm leading-snug text-muted md:text-base">{entry.field}</p>
        <p className="mt-1 text-sm leading-snug tracking-wide text-muted">{entry.location}</p>
        {entry.specialization ? (
          <p className="mt-3 text-sm leading-snug text-foreground md:text-base">
            <span className="mb-1 block text-[0.68rem] font-medium tracking-[0.22em] text-muted uppercase">
              Specialization
            </span>
            {entry.specialization}
          </p>
        ) : null}
      </div>
    </article>
  )
}
