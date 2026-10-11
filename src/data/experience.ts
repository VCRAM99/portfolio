export const employerIds = [
  'td-bank',
  'quanto',
  'cibc',
  'mcmaster',
] as const

export type EmployerId = (typeof employerIds)[number]

export const accentColors = ['green', 'blue', 'red', 'maroon'] as const

export type AccentColor = (typeof accentColors)[number]

export type ExperienceRole = {
  readonly title: string
  readonly dates: string
  readonly achievements: readonly string[]
}

export type ExperienceEntry = {
  readonly id: EmployerId
  readonly name: string
  readonly dates: string
  readonly accent: AccentColor
  readonly summary: string
  readonly roles: readonly [ExperienceRole, ...ExperienceRole[]]
  readonly technologies?: readonly string[]
}

export const experience = [
  {
    id: 'td-bank',
    name: 'TD Bank',
    dates: '2025 – Present',
    accent: 'green',
    summary:
      'Developed Python automation and cloud-based data validation tools to improve enterprise data governance, reporting, and operational efficiency.',
    roles: [
      {
        title: 'Business Management Specialist',
        dates: '2025 – Present',
        achievements: [
          'Reduced validation and processing time by over 90% through Python automation.',
          'Built SQL validation solutions for Azure-hosted data supply chains.',
          'Created interactive HTML reports and Power BI dashboards for stakeholders.',
        ],
      },
    ],
    technologies: ['Python', 'SQL', 'Microsoft Azure', 'Power BI', 'HTML'],
  },
  {
    id: 'quanto',
    name: 'Quanto',
    dates: '2024 – 2025',
    accent: 'blue',
    summary:
      'Built AI-powered bookkeeping software spanning Python backend services, financial data pipelines, and responsive frontend experiences.',
    roles: [
      {
        title: 'Machine Learning Engineer',
        dates: '2024 – 2025',
        achievements: [
          'Integrated OpenAI and Google Gemini APIs for intelligent financial analysis.',
          'Developed Python backend services and real-time financial data pipelines.',
          'Built Next.js frontend features and deployed applications with Vercel and Supabase.',
        ],
      },
    ],
    technologies: [
      'Python',
      'Next.js',
      'JavaScript',
      'OpenAI API',
      'Google Gemini API',
      'Vercel',
      'Supabase',
    ],
  },
  {
    id: 'cibc',
    name: 'CIBC',
    dates: '2023 – 2024',
    accent: 'red',
    summary:
      'Modernized enterprise banking applications through Java development, API engineering, cloud migration, and production support.',
    roles: [
      {
        title: 'Software Developer',
        dates: '2023 – 2024',
        achievements: [
          'Migrated legacy C++ and Java applications to Java 21.',
          'Developed Java backend services and RESTful APIs for enterprise systems.',
          'Implemented tests and supported cloud deployments, UAT, and production releases.',
        ],
      },
    ],
    technologies: ['Java 21', 'C++', 'REST APIs'],
  },
  {
    id: 'mcmaster',
    name: 'McMaster University',
    dates: '2019 – 2021',
    accent: 'maroon',
    summary:
      'Developed computer vision, embedded AI, and research software across two roles supporting academic and industry initiatives.',
    roles: [
      {
        title: 'Machine Learning Engineer',
        dates: '2020 – 2021',
        achievements: [
          'Developed embedded AI applications using TensorFlow, OpenCV, and STM X-CUBE-AI.',
          'Created educational machine learning software and demonstrations.',
          'Built research visualization tools using Power BI.',
        ],
      },
      {
        title: 'Data Analyst',
        dates: '2019 – 2020',
        achievements: [
          'Trained TensorFlow computer vision models achieving 95% vehicle classification accuracy.',
          'Developed Python software to automate image labeling.',
          'Built traffic analysis and network security prototypes.',
        ],
      },
    ],
    technologies: [
      'Python',
      'TensorFlow',
      'OpenCV',
      'STM X-CUBE-AI',
      'Power BI',
    ],
  },
] as const satisfies readonly ExperienceEntry[]
