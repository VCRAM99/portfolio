import { describe, expect, it } from 'vitest'
import { otherProjectIds, otherProjects } from './otherProjects'

const placeholderPattern = /example\.com|placeholder|localhost|lorem|todo|tbd|#/i

function expectOptionalUrl(url: string | undefined) {
  if (url === undefined) return

  expect(url).toMatch(/^https:\/\//)
  expect(url).not.toMatch(placeholderPattern)
  expect(() => new URL(url)).not.toThrow()
}

describe('otherProjects', () => {
  it('lists exactly two projects with stable unique ids', () => {
    expect(otherProjects).toHaveLength(2)
    expect(otherProjects.map((project) => project.id)).toEqual([...otherProjectIds])
    expect(new Set(otherProjects.map((project) => project.id)).size).toBe(otherProjects.length)
  })

  it('gives every project a title, category, description, and technologies', () => {
    expect(otherProjects[0]?.description).toContain('disables active noise cancellation')
    expect(otherProjects[1]?.description).toContain('wheelchair users with cerebral palsy')

    for (const project of otherProjects) {
      expect(project.title.length).toBeGreaterThan(0)
      expect(project.category.length).toBeGreaterThan(0)
      expect(project.description.length).toBeGreaterThan(0)
      expect(project.technologies.length).toBeGreaterThan(0)

      for (const technology of project.technologies) {
        expect(technology.length).toBeGreaterThan(0)
      }

      expect(new Set(project.technologies).size).toBe(project.technologies.length)
    }
  })

  it('uses the Siren Sense demo and leaves GIGO without a fabricated link', () => {
    const siren = otherProjects.find((project) => project.id === 'siren-sense')
    const gigo = otherProjects.find((project) => project.id === 'gigo-robotic-arm')

    expect(siren?.liveUrl).toBe('https://www.youtube.com/watch?v=IOu2ydALGGo')
    expect(siren?.repositoryUrl).toBeUndefined()
    expect(gigo?.liveUrl).toBeUndefined()
    expect(gigo?.repositoryUrl).toBeUndefined()

    for (const project of otherProjects) {
      expectOptionalUrl(project.repositoryUrl)
      expectOptionalUrl(project.liveUrl)
    }
  })

  it('points each project at light and dark logos', () => {
    expect(otherProjects.map((project) => project.image?.lightSrc)).toEqual([
      '/images/projects/siren-sense-light.png',
      '/images/projects/gigo-robotic-arm-light.png',
    ])
    expect(otherProjects.map((project) => project.image?.darkSrc)).toEqual([
      '/images/projects/siren-sense-dark.png',
      '/images/projects/gigo-robotic-arm-dark.png',
    ])

    for (const project of otherProjects) {
      expect(project.image?.alt.length).toBeGreaterThan(0)
      expect(project.image?.width).toBeGreaterThan(0)
      expect(project.image?.height).toBeGreaterThan(0)
    }
  })
})
