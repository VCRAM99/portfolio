import { useEffect, useState } from 'react'
import type { EmployerId } from '../../data/experience'
import type { ResolvedTheme } from '../../hooks/useTheme'

const logoFile: Record<EmployerId, string> = {
  'td-bank': 'td',
  quanto: 'quanto',
  cibc: 'cibc',
  mcmaster: 'mcmaster',
}

const frame: Record<'card' | 'header', Record<EmployerId, string>> = {
  card: {
    'td-bank': 'h-7 w-9',
    quanto: 'h-7 w-9',
    cibc: 'h-6 w-24',
    mcmaster: 'h-8 w-28',
  },
  header: {
    'td-bank': 'h-8 w-8',
    quanto: 'h-8 w-8',
    cibc: 'h-6 w-24',
    mcmaster: 'h-9 w-[6.75rem]',
  },
}

function employerLogoSrc(id: EmployerId, theme: ResolvedTheme) {
  return `/employers/${logoFile[id]}-${theme}.png`
}

function readTheme(): ResolvedTheme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

type EmployerLogoProps = {
  id: EmployerId
  variant: 'card' | 'header'
}

export function EmployerLogo({ id, variant }: EmployerLogoProps) {
  const [theme, setTheme] = useState<ResolvedTheme>(readTheme)

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      setTheme(readTheme())
    })

    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return (
    <img
      src={employerLogoSrc(id, theme)}
      alt=""
      draggable={false}
      decoding="async"
      loading="lazy"
      className={`${frame[variant][id]} max-w-full object-contain object-left`}
    />
  )
}
