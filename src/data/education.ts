export const educationIds = ['michigan', 'mcmaster'] as const

export type EducationId = (typeof educationIds)[number]

export type EducationLogo = {
  readonly lightSrc: string
  readonly darkSrc: string
  readonly lightWidth: number
  readonly lightHeight: number
  readonly darkWidth: number
  readonly darkHeight: number
}

export type EducationEntry = {
  readonly id: EducationId
  readonly university: string
  readonly location: string
  readonly degree: string
  readonly field: string
  readonly dates: string
  readonly specialization?: string
  readonly logo: EducationLogo
}

export const education: readonly EducationEntry[] = [
  {
    id: 'michigan',
    university: 'University of Michigan',
    location: 'United States',
    degree: 'Master of Engineering (M.Eng)',
    field: 'Computer Engineering',
    dates: '2021–2023',
    specialization: 'Machine Learning & Data Science',
    logo: {
      lightSrc: '/images/education/michigan-light.png',
      darkSrc: '/images/education/michigan-dark.png',
      lightWidth: 887,
      lightHeight: 443,
      darkWidth: 835,
      darkHeight: 198,
    },
  },
  {
    id: 'mcmaster',
    university: 'McMaster University',
    location: 'Canada',
    degree: 'Bachelor of Engineering (B.Eng)',
    field: 'Computer Engineering',
    dates: '2017–2021',
    logo: {
      lightSrc: '/images/education/mcmaster-light.png',
      darkSrc: '/images/education/mcmaster-dark.png',
      lightWidth: 887,
      lightHeight: 444,
      darkWidth: 672,
      darkHeight: 384,
    },
  },
]
