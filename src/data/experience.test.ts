import { describe, expect, it } from 'vitest'
import { employerIds, experience } from './experience'

describe('experience', () => {
  it('lists employers in chronological order with stable unique ids', () => {
    expect(experience.map((entry) => entry.id)).toEqual([...employerIds])
  })

  it('keeps McMaster as one employer with one role', () => {
    const mcmaster = experience.find((entry) => entry.id === 'mcmaster')

    expect(mcmaster?.name).toBe('McMaster University')
    expect(mcmaster?.roles.map((role) => role.title)).toEqual(['Machine Learning & Data Engineer'])
    expect(experience.filter((entry) => entry.name === 'McMaster University')).toHaveLength(1)
  })

  it('gives every employer a summary, accent, and at least one role with achievements', () => {
    for (const entry of experience) {
      expect(entry.summary.length).toBeGreaterThan(0)
      expect(entry.accent.length).toBeGreaterThan(0)
      expect(entry.roles.length).toBeGreaterThan(0)

      for (const role of entry.roles) {
        expect(role.title.length).toBeGreaterThan(0)
        expect(role.dates.length).toBeGreaterThan(0)
        expect(role.achievements.length).toBeGreaterThan(0)
      }
    }
  })
})
