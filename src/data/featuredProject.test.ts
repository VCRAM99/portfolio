import { describe, expect, it } from 'vitest'
import { featuredProject, featuredProjectIds } from './featuredProject'

describe('featuredProject', () => {
  it('uses a stable id from the featured project catalog', () => {
    expect(featuredProjectIds).toContain(featuredProject.id)
    expect(featuredProject.id).toBe('adaptive-chess-trainer')
  })

  it('describes Adaptive Chess Trainer with highlights and technologies', () => {
    expect(featuredProject.title).toBe('Adaptive Chess Trainer')
    expect(featuredProject.category.length).toBeGreaterThan(0)
    expect(featuredProject.description.length).toBeGreaterThan(0)
    expect(featuredProject.highlights.length).toBeGreaterThan(0)
    expect(featuredProject.technologies.length).toBeGreaterThan(0)

    for (const highlight of featuredProject.highlights) {
      expect(highlight.length).toBeGreaterThan(0)
    }

    expect(new Set(featuredProject.technologies).size).toBe(featuredProject.technologies.length)
  })

  it('points at the live app and repository', () => {
    expect(featuredProject.discoverUrl).toBe('https://chess.varunsr.com/discover')
    expect(featuredProject.liveUrl).toBe('https://chess.varunsr.com/app')
    expect(featuredProject.repositoryUrl).toBe(
      'https://github.com/VCRAM99/adaptive-chess-trainer',
    )
  })

  it('lists the screenshot gallery in display order', () => {
    expect(featuredProject.gallery.map((image) => image.order)).toEqual([1, 2, 3, 4, 5])
    expect(featuredProject.gallery.map((image) => image.src)).toEqual([
      '/images/chess-trainer/gameplay-desktop.png',
      '/images/chess-trainer/training-modes.png',
      '/images/chess-trainer/post-game-analysis.png',
      '/images/chess-trainer/player-performance.png',
      '/images/chess-trainer/customization.png',
    ])
    expect(featuredProject.gallery.map((image) => image.caption)).toEqual([
      'Gameplay — Adaptive opponent and live game information',
      'Training Modes — Casual, Echo, and Train',
      'Post-Game Analysis — Move classifications and evaluation',
      'Player Performance — Statistics and accuracy trends',
      'Customization — Board themes and piece sets',
    ])

    for (const image of featuredProject.gallery) {
      expect(image.alt.length).toBeGreaterThan(0)
    }

    expect(new Set(featuredProject.gallery.map((image) => image.order)).size).toBe(5)
  })
})
