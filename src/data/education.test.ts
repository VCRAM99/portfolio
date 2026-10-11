import { describe, expect, it } from 'vitest'
import { education, educationIds } from './education'

describe('education', () => {
  it('lists Michigan before McMaster with stable unique ids', () => {
    expect(education).toHaveLength(2)
    expect(education.map((entry) => entry.id)).toEqual([...educationIds])
    expect(education.map((entry) => entry.university)).toEqual([
      'University of Michigan',
      'McMaster University',
    ])
    expect(new Set(education.map((entry) => entry.id)).size).toBe(education.length)
  })

  it('records the supplied degrees, fields, locations, and dates', () => {
    expect(education[0]).toMatchObject({
      degree: 'Master of Engineering (M.Eng)',
      field: 'Computer Engineering',
      location: 'United States',
      dates: '2021–2023',
    })
    expect(education[1]).toMatchObject({
      degree: 'Bachelor of Engineering (B.Eng)',
      field: 'Computer Engineering',
      location: 'Canada',
      dates: '2017–2021',
    })
  })

  it('keeps the Michigan specialization and leaves McMaster without one', () => {
    expect(education[0]?.specialization).toBe('Machine Learning & Data Science')
    expect(education[1]?.specialization).toBeUndefined()
  })

  it('points each school at light and dark logos', () => {
    expect(education.map((entry) => entry.logo.lightSrc)).toEqual([
      '/images/education/michigan-light.png',
      '/images/education/mcmaster-light.png',
    ])
    expect(education.map((entry) => entry.logo.darkSrc)).toEqual([
      '/images/education/michigan-dark.png',
      '/images/education/mcmaster-dark.png',
    ])

    for (const entry of education) {
      expect(entry.logo.lightWidth).toBeGreaterThan(0)
      expect(entry.logo.lightHeight).toBeGreaterThan(0)
      expect(entry.logo.darkWidth).toBeGreaterThan(0)
      expect(entry.logo.darkHeight).toBeGreaterThan(0)
    }
  })
})
