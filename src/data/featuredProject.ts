export const featuredProjectIds = ['adaptive-chess-trainer'] as const

export type FeaturedProjectId = (typeof featuredProjectIds)[number]

export type ProjectGalleryImage = {
  readonly src: string
  readonly alt: string
  readonly caption: string
  readonly order: number
}

export type FeaturedProject = {
  readonly id: FeaturedProjectId
  readonly title: string
  readonly category: string
  readonly description: string
  readonly highlights: readonly string[]
  readonly technologies: readonly string[]
  readonly discoverUrl: string
  readonly liveUrl: string
  readonly repositoryUrl: string
  readonly gallery: readonly ProjectGalleryImage[]
}

export const featuredProject = {
  id: 'adaptive-chess-trainer',
  title: 'Adaptive Chess Trainer',
  category: 'Interactive Web Application / Chess AI',
  description:
    'An interactive chess training application featuring a Stockfish-powered opponent that adapts to estimated player strength, detailed move analysis, and personalized training profiles.',
  highlights: [
    'Adaptive Stockfish opponent with Casual, Echo, and Train difficulty modes.',
    'Estimated player rating informed by completed games.',
    'Post-game move classification using Diamond, Platinum, Gold, Silver, Bronze, Steel, and Wood.',
    'Separate Stockfish workers for live opponent play, move analysis, and post-game review.',
    'Guest profiles with local storage, plus Supabase authentication and cloud profile persistence.',
    'Customizable board themes, piece sets, and interface accent colors.',
  ],
  technologies: [
    'React 19',
    'TypeScript',
    'Vite',
    'chess.js',
    'react-chessboard',
    'Stockfish 19',
    'Supabase',
    'Vitest',
    'Testing Library',
  ],
  discoverUrl: 'https://chess.varunsr.com/discover',
  liveUrl: 'https://chess.varunsr.com/app',
  repositoryUrl: 'https://github.com/VCRAM99/adaptive-chess-trainer',
  gallery: [
    {
      src: '/images/chess-trainer/gameplay-desktop.png',
      alt: 'Gameplay view of Adaptive Chess Trainer with an adaptive opponent and live game information',
      caption: 'Gameplay — Adaptive opponent and live game information',
      order: 1,
    },
    {
      src: '/images/chess-trainer/training-modes.png',
      alt: 'Training mode options in Adaptive Chess Trainer: Casual, Echo, and Train',
      caption: 'Training Modes — Casual, Echo, and Train',
      order: 2,
    },
    {
      src: '/images/chess-trainer/post-game-analysis.png',
      alt: 'Post-game analysis in Adaptive Chess Trainer with move classifications and evaluation',
      caption: 'Post-Game Analysis — Move classifications and evaluation',
      order: 3,
    },
    {
      src: '/images/chess-trainer/player-performance.png',
      alt: 'Player performance statistics and accuracy trends in Adaptive Chess Trainer',
      caption: 'Player Performance — Statistics and accuracy trends',
      order: 4,
    },
    {
      src: '/images/chess-trainer/customization.png',
      alt: 'Customization options for board themes and piece sets in Adaptive Chess Trainer',
      caption: 'Customization — Board themes and piece sets',
      order: 5,
    },
  ],
} as const satisfies FeaturedProject

export const featuredProjectDevices = {
  laptop: {
    src: '/images/chess-trainer/gameplay-desktop.png',
    width: 1002,
    height: 805,
  },
  phone: {
    src: '/images/chess-trainer/gameplay-mobile.png',
    width: 437,
    height: 953,
  },
} as const
