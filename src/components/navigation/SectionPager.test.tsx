import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { navigationItems } from '../../data/navigation'
import { SectionPager } from './SectionPager'

describe('SectionPager', () => {
  it('disables the previous control on Home and links next to Experience', () => {
    render(<SectionPager activeSection="home" />)

    expect(screen.getByRole('button', { name: 'Previous section' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Next section: Experience' })).toHaveAttribute(
      'href',
      '#experience',
    )
  })

  it('links to the neighboring sections in navigation order', () => {
    render(<SectionPager activeSection="projects" />)

    expect(screen.getByRole('link', { name: 'Previous section: Experience' })).toHaveAttribute(
      'href',
      '#experience',
    )
    expect(screen.getByRole('link', { name: 'Next section: Education' })).toHaveAttribute(
      'href',
      '#education',
    )
  })

  it('disables the next control on Contact', () => {
    render(<SectionPager activeSection="contact" />)

    expect(screen.getByRole('link', { name: 'Previous section: Education' })).toHaveAttribute(
      'href',
      '#education',
    )
    expect(screen.getByRole('button', { name: 'Next section' })).toBeDisabled()
  })

  it('follows the same section order as primary navigation', () => {
    const { rerender } = render(<SectionPager activeSection="home" />)

    for (let index = 0; index < navigationItems.length; index += 1) {
      const current = navigationItems[index]
      rerender(<SectionPager activeSection={current.id} />)

      const previous = navigationItems[index - 1]
      const next = navigationItems[index + 1]

      if (previous) {
        expect(screen.getByRole('link', { name: `Previous section: ${previous.label}` })).toHaveAttribute(
          'href',
          `#${previous.id}`,
        )
      } else {
        expect(screen.getByRole('button', { name: 'Previous section' })).toBeDisabled()
      }

      if (next) {
        expect(screen.getByRole('link', { name: `Next section: ${next.label}` })).toHaveAttribute(
          'href',
          `#${next.id}`,
        )
      } else {
        expect(screen.getByRole('button', { name: 'Next section' })).toBeDisabled()
      }
    }
  })

  it('stays out of the layout below the large desktop breakpoint', () => {
    render(<SectionPager activeSection="home" />)

    const nav = screen.getByRole('navigation', { name: 'Section' })
    expect(nav.parentElement).toHaveClass('hidden', 'xl:block')
  })
})
