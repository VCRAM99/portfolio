import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { otherProjects } from '../data/otherProjects'
import { OtherProjects } from './OtherProjects'

beforeEach(() => {
  document.documentElement.dataset.theme = 'light'
})

function card(title: string) {
  const heading = screen.getByRole('heading', { name: title })
  const article = heading.closest('article')
  if (!article) throw new Error(`Missing card for ${title}`)
  return article
}

describe('OtherProjects', () => {
  it('keeps the section anchor and renders both project cards', () => {
    render(<OtherProjects />)

    const section = document.getElementById('other-projects')

    expect(section).toHaveAttribute('aria-labelledby', 'other-projects-heading')
    expect(section).toHaveClass('scroll-mt-24')
    expect(screen.getByRole('heading', { level: 3, name: 'Other Projects.' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(new Set(otherProjects.map((project) => project.id)).size).toBe(2)
  })

  it('shows titles and technologies, and expands each description independently', async () => {
    const user = userEvent.setup()
    render(<OtherProjects />)

    for (const project of otherProjects) {
      const article = card(project.title)

      expect(within(article).getByRole('heading', { name: project.title })).toBeInTheDocument()
      expect(document.getElementById(`${project.id}-description`)).toHaveAttribute('aria-hidden', 'true')
      expect(within(article).getByRole('button', { name: 'Read More' })).toHaveAttribute('aria-expanded', 'false')

      for (const technology of project.technologies) {
        expect(within(article).getByText(technology)).toBeInTheDocument()
      }
    }

    const siren = card('Siren Sense')
    const gigo = card('GIGO Robotic Arm')

    await user.click(within(siren).getByRole('button', { name: 'Read More' }))
    expect(within(siren).getByRole('button', { name: 'Show Less' })).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById('siren-sense-description')).not.toHaveAttribute('aria-hidden')
    expect(within(siren).getByText(otherProjects[0].description)).toBeVisible()
    expect(document.getElementById('gigo-robotic-arm-description')).toHaveAttribute('aria-hidden', 'true')

    await user.click(within(gigo).getByRole('button', { name: 'Read More' }))
    expect(within(gigo).getByText(otherProjects[1].description)).toBeVisible()

    await user.click(within(siren).getByRole('button', { name: 'Show Less' }))
    expect(within(siren).getByRole('button', { name: 'Read More' })).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById('siren-sense-description')).toHaveAttribute('aria-hidden', 'true')
    expect(within(gigo).getByText(otherProjects[1].description)).toBeVisible()
  })

  it('links Siren Sense to the demo and leaves GIGO without an action', () => {
    render(<OtherProjects />)

    const siren = card('Siren Sense')
    const demo = within(siren).getByRole('link', { name: 'Watch Demo' })

    expect(demo).toHaveAttribute('href', 'https://www.youtube.com/watch?v=IOu2ydALGGo')
    expect(demo).toHaveAttribute('target', '_blank')
    expect(demo).toHaveAttribute('rel', 'noopener noreferrer')
    expect(within(card('GIGO Robotic Arm')).queryByRole('link')).not.toBeInTheDocument()
    expect(within(card('GIGO Robotic Arm')).getByRole('button', { name: 'Read More' })).toBeInTheDocument()
  })

  it('uses the light logo and switches to the dark logo with the page theme', async () => {
    render(<OtherProjects />)

    const logos = screen.getAllByRole('img')
    expect(logos.map((logo) => logo.getAttribute('src'))).toEqual([
      '/images/projects/siren-sense-light.png',
      '/images/projects/gigo-robotic-arm-light.png',
    ])
    expect(logos[0]).toHaveClass('object-contain')

    document.documentElement.dataset.theme = 'dark'

    await waitFor(() => {
      expect(screen.getAllByRole('img').map((logo) => logo.getAttribute('src'))).toEqual([
        '/images/projects/siren-sense-dark.png',
        '/images/projects/gigo-robotic-arm-dark.png',
      ])
    })
  })
})
