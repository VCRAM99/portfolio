import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the home section with the approved copy', () => {
    render(<Hero />)

    const section = document.getElementById('home')

    expect(section?.tagName).toBe('SECTION')
    expect(section).toHaveAttribute('aria-labelledby', 'home-heading')
    expect(screen.getByRole('heading', { name: 'Varun Ramanathan.' })).toHaveAttribute(
      'id',
      'home-heading',
    )
    expect(screen.getByText('Software Engineer.')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Experienced in designing and engineering scalable, AI-powered software applications.',
      ),
    ).toBeInTheDocument()
  })

  it('uses the local aurora image for the current breakpoint', () => {
    render(<Hero />)

    const picture = document.querySelector('#home picture')
    const source = picture?.querySelector('source')
    const image = picture?.querySelector('img')

    expect(source).toHaveAttribute('media', '(min-width: 768px)')
    expect(source).toHaveAttribute('srcset', '/images/hero-aurora-desktop.webp')
    expect(image).toHaveAttribute('src', '/images/hero-aurora-mobile.webp')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('fetchpriority', 'high')
    expect(picture?.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(picture?.parentElement).toHaveClass('hero-aurora')
  })

  it('links to the projects section without replacing the hero actions', async () => {
    const user = userEvent.setup()
    render(<Hero />)

    const explore = screen.getByRole('link', { name: 'Explore Projects' })

    expect(explore.tagName).toBe('A')
    expect(explore).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Resume' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Email' })).toBeInTheDocument()

    await user.tab()
    expect(explore).toHaveFocus()
  })

  it('sets the name in serif and the headline in sans', () => {
    render(<Hero />)

    expect(screen.getByRole('heading', { name: 'Varun Ramanathan.' })).toHaveClass('font-serif')
    expect(screen.getByText('Software Engineer.')).toHaveClass('font-sans')
  })
})
