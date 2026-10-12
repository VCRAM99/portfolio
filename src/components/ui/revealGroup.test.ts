import { describe, expect, it } from 'vitest'
import { chooseActiveGroup, shouldResetGroup } from './revealGroup'

const empty = { hero: 0, experience: 0, featured: 0, other: 0, education: 0, contact: 0 }

describe('reveal groups', () => {
  it('keeps the current group until another group clearly leads the center band', () => {
    expect(chooseActiveGroup({ ...empty, experience: 40, featured: 50 }, 'experience')).toBe('experience')
    expect(chooseActiveGroup({ ...empty, experience: 20, featured: 80 }, 'experience')).toBe('featured')
  })

  it('treats featured projects and other projects as separate groups', () => {
    expect(chooseActiveGroup({ ...empty, featured: 30, other: 90 }, 'featured')).toBe('other')
    expect(chooseActiveGroup({ ...empty, featured: 90, other: 20 }, 'other')).toBe('featured')
  })

  it('treats education and contact as separate groups', () => {
    expect(chooseActiveGroup({ ...empty, education: 24, contact: 80 }, 'education')).toBe('contact')
    expect(chooseActiveGroup({ ...empty, education: 100, contact: 20 }, 'contact')).toBe('education')
  })

  it('keeps contact active while the footer shares that section', () => {
    expect(chooseActiveGroup({ ...empty, contact: 120 }, 'contact')).toBe('contact')
  })

  it('returns to the hero without inventing a reveal group', () => {
    expect(chooseActiveGroup({ ...empty, hero: 100, experience: 10 }, 'experience')).toBe(null)
  })

  it('resets a group only after it has been visited and has left the screen', () => {
    expect(shouldResetGroup(false, false, true)).toBe(true)
    expect(shouldResetGroup(true, false, true)).toBe(false)
    expect(shouldResetGroup(false, true, true)).toBe(false)
    expect(shouldResetGroup(false, false, false)).toBe(false)
  })
})