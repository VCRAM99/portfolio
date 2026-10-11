export const otherProjectIds = ['siren-sense', 'gigo-robotic-arm'] as const

export type OtherProjectId = (typeof otherProjectIds)[number]

export type OtherProjectImage = {
  readonly lightSrc: string
  readonly darkSrc: string
  readonly alt: string
  readonly width: number
  readonly height: number
}

export type OtherProject = {
  readonly id: OtherProjectId
  readonly title: string
  readonly category: string
  readonly description: string
  readonly technologies: readonly string[]
  readonly highlights?: readonly string[]
  readonly repositoryUrl?: string
  readonly liveUrl?: string
  readonly image?: OtherProjectImage
}

export const otherProjects: readonly OtherProject[] = [
  {
    id: 'siren-sense',
    title: 'Siren Sense',
    category: 'Mobile Application / Machine Learning',
    description:
      'Designed and developed a cross-platform mobile application using React Native, JavaScript, and Expo that uses machine learning to detect emergency sirens and hazardous sounds in real time. The application automatically disables active noise cancellation and pauses media playback to improve user awareness and safety, with performance optimized for iOS and Android.',
    technologies: ['React Native', 'JavaScript', 'Expo', 'Machine Learning'],
    liveUrl: 'https://www.youtube.com/watch?v=IOu2ydALGGo',
    image: {
      lightSrc: '/images/projects/siren-sense-light.png',
      darkSrc: '/images/projects/siren-sense-dark.png',
      alt: 'Siren Sense logo',
      width: 900,
      height: 900,
    },
  },
  {
    id: 'gigo-robotic-arm',
    title: 'GIGO Robotic Arm',
    category: 'Assistive Robotics / Embedded Systems',
    description:
      'Developed an assistive robotic arm for wheelchair users with cerebral palsy, integrating Python, Arduino, Autodesk Inventor, and SolidWorks to enable joystick-controlled object manipulation. The project focused on accessibility through practical software and hardware integration.',
    technologies: ['Python', 'Arduino', 'Autodesk Inventor', 'SolidWorks'],
    image: {
      lightSrc: '/images/projects/gigo-robotic-arm-light.png',
      darkSrc: '/images/projects/gigo-robotic-arm-dark.png',
      alt: 'GIGO Robotic Arm logo',
      width: 900,
      height: 900,
    },
  },
]
