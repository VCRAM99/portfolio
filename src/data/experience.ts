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
      'Built Python validation workflows and Azure data-quality pipelines, with TypeScript/React reporting and Power BI dashboards for stakeholders.',
    roles: [
      {
        title: 'Data Analyst (EDMO)',
        dates: '2025 – Present',
        achievements: [
          'Reduced validation and processing time by over 90% through Python automation.',
          'Built SQL enterprise data-quality pipelines hosted in Azure for supply chains.',
          'Created TypeScript/React validation views and Power BI dashboards for stakeholders.',
        ],
      },
    ],
    technologies: ['Python', 'SQL', 'TypeScript', 'React', 'Microsoft Azure', 'Power BI'],
  },
  {
    id: 'quanto',
    name: 'Quanto',
    dates: '2024 – 2025',
    accent: 'blue',
    summary:
      'Built production AI bookkeeping software across Python services, language-model workflows, and customer-facing financial features.',
    roles: [
      {
        title: 'Machine Learning Engineer',
        dates: '2024 – 2025',
        achievements: [
          'Integrated OpenAI and Google Gemini APIs, Optimized LLM workflows to reduce token usage by over 60%.',
          'Built retrieval workflows and human-in-the-loop review for bookkeeping agents.',
          'Developed Python services, Next.js features, and pipelines on AWS and Supabase.',
        ],
      },
    ],
    technologies: [
      'Python',
      'Next.js',
      'JavaScript',
      'OpenAI API',
      'Google Gemini API',
      'AWS',
      'Supabase',
      'Vercel',
    ],
  },
  {
    id: 'cibc',
    name: 'CIBC',
    dates: '2023 – 2024',
    accent: 'red',
    summary:
      'Modernized the Global Operations Workbench through Java 21 services, REST APIs, and an Azure migration.',
    roles: [
      {
        title: 'Full-Stack Developer',
        dates: '2023 – 2024',
        achievements: [
          'Migrated legacy C++ and Java components to Java 21.',
          'Developed Java backend services and RESTful APIs for the operations workbench.',
          'Added unit and integration tests and supported Azure migration, UAT, and production releases.',
        ],
      },
    ],
    technologies: ['Java 21', 'C++', 'REST APIs', 'Microsoft Azure'],
  },
  {
    id: 'mcmaster',
    name: 'McMaster University',
    dates: '2019 – 2021',
    accent: 'maroon',
    summary:
      'Applied computer vision and embedded machine learning to vehicle classification, traffic analysis, and research prototypes.',
    roles: [
      {
        title: 'Machine Learning & Data Engineer',
        dates: '2019 – 2021',
        achievements: [
          'Developed embedded AI with TensorFlow, OpenCV, and STM X-CUBE-AI.',
          'Trained aerial-imagery models that classified vehicles at 95% accuracy.',
          'Built Python image labeling and traffic analysis tools with Peel Regional Police.',
        ],
      },
    ],
    technologies: ['Python', 'TensorFlow', 'OpenCV', 'STM X-CUBE-AI'],
  },
] as const satisfies readonly ExperienceEntry[]
