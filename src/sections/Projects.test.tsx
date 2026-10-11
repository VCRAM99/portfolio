import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { featuredProject, featuredProjectDevices } from '../data/featuredProject'
import { Projects } from './Projects'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Projects', () => {
  it('anchors the section and shows the featured project copy', () => {
    render(<Projects />)

    const section = document.getElementById('projects')

    expect(section).toHaveAttribute('aria-labelledby', 'projects-heading')
    expect(section).toHaveClass('scroll-mt-24')
    expect(screen.getByRole('heading', { level: 2, name: `${featuredProject.title}.` })).toBeInTheDocument()
    expect(screen.getByText(featuredProject.description)).toBeInTheDocument()
  })

  it('keeps feature hotspots collapsed until one is opened', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    const adaptive = screen.getByRole('button', { name: 'Adaptive AI' })
    const analysis = screen.getByRole('button', { name: 'Move Analysis' })
    const custom = screen.getByRole('button', { name: 'Custom Experience' })
    const adaptiveDescription = 'A Stockfish-powered opponent adjusts its play to your estimated skill level.'
    const analysisDescription = 'Review completed games with engine evaluations and seven custom move classifications.'

    expect(adaptive).toHaveAttribute('aria-expanded', 'false')
    expect(analysis).toHaveAttribute('aria-expanded', 'false')
    expect(custom).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText(adaptiveDescription)).not.toBeVisible()

    await user.click(adaptive)
    expect(adaptive).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(adaptiveDescription)).toBeVisible()
    expect(analysis).toHaveAttribute('aria-expanded', 'false')

    await user.click(analysis)
    expect(analysis).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(analysisDescription)).toBeVisible()
    expect(adaptive).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText(adaptiveDescription)).not.toBeVisible()

    await user.click(analysis)
    expect(analysis).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText(analysisDescription)).not.toBeVisible()

    await user.click(custom)
    expect(custom).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(custom).toHaveAttribute('aria-expanded', 'false')
  })

  it('links to the live app and the gallery anchor', () => {
    render(<Projects />)

    const discover = screen.getByRole('link', { name: 'Discover More' })
    const tryMe = screen.getByRole('link', { name: 'Try Me' })

    expect(discover).toHaveAttribute('href', '#featured-project-gallery')
    expect(document.getElementById('featured-project-gallery')).toHaveClass('scroll-mt-24')

    expect(tryMe).toHaveAttribute('href', featuredProject.liveUrl)
    expect(tryMe).toHaveAttribute('target', '_blank')
    expect(tryMe).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows the laptop and phone screenshots without cropping their frames', () => {
    render(<Projects />)

    const media = document.querySelector('[data-project-media="gallery"]')
    const images = media?.querySelectorAll('img')

    expect(images).toHaveLength(2)
    expect(images?.[0]).toHaveAttribute('src', featuredProjectDevices.laptop.src)
    expect(images?.[0]).toHaveAttribute('width', String(featuredProjectDevices.laptop.width))
    expect(images?.[0]).toHaveAttribute('height', String(featuredProjectDevices.laptop.height))
    expect(images?.[0]?.className).toContain('h-auto')
    expect(images?.[0]?.className).toContain('w-full')
    expect(images?.[1]).toHaveAttribute('src', featuredProjectDevices.phone.src)
    expect(images?.[1]).toHaveAttribute('width', String(featuredProjectDevices.phone.width))
    expect(images?.[1]).toHaveAttribute('height', String(featuredProjectDevices.phone.height))
    expect(images?.[1]).toHaveAttribute('sizes', '9rem')
  })

  it('previews a thumbnail caption on hover and focus, then restores the selection', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    const caption = document.getElementById('featured-gallery-caption')
    const thumbnails = featuredProject.gallery.map((image) => screen.getByRole('button', { name: image.caption }))

    expect(caption).toHaveTextContent(featuredProject.gallery[0].caption)

    await user.hover(thumbnails[2])
    await waitFor(() => expect(caption).toHaveTextContent(featuredProject.gallery[2].caption))

    await user.unhover(thumbnails[2])
    await waitFor(() => expect(caption).toHaveTextContent(featuredProject.gallery[0].caption))

    thumbnails[3].focus()
    await waitFor(() => expect(caption).toHaveTextContent(featuredProject.gallery[3].caption))

    thumbnails[3].blur()
    await waitFor(() => expect(caption).toHaveTextContent(featuredProject.gallery[0].caption))
  })

  it('selects gallery screenshots and steps between them', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    const thumbnails = featuredProject.gallery.map((image) => screen.getByRole('button', { name: image.caption }))
    const previous = () => screen.getAllByRole('button', { name: 'Previous screenshot' })[0]
    const next = () => screen.getAllByRole('button', { name: 'Next screenshot' })[0]

    expect(thumbnails).toHaveLength(5)
    expect(thumbnails[0]).toHaveAttribute('aria-current', 'true')
    expect(previous()).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'View larger' })).not.toBeInTheDocument()

    await user.click(thumbnails[1])
    expect(thumbnails[1]).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('dialog').querySelector('img')).toHaveAttribute('src', featuredProject.gallery[1].src)

    await user.click(next())
    expect(thumbnails[2]).toHaveAttribute('aria-current', 'true')

    await user.click(previous())
    expect(thumbnails[1]).toHaveAttribute('aria-current', 'true')

    await user.click(thumbnails[4])
    expect(next()).toBeDisabled()
  })

  it('opens the enlarged preview from a thumbnail and restores focus when closed', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    const gameplay = screen.getByRole('button', { name: featuredProject.gallery[0].caption })
    gameplay.focus()
    await user.keyboard('{ArrowRight}')

    const training = screen.getByRole('button', { name: featuredProject.gallery[1].caption })
    expect(training).toHaveFocus()
    expect(training).toHaveAttribute('aria-current', 'true')

    await user.click(training)

    const dialog = screen.getByRole('dialog')
    expect(dialog.querySelector('img')).toHaveAttribute('src', featuredProject.gallery[1].src)
    expect(dialog.querySelector('img')).toHaveAttribute('alt', featuredProject.gallery[1].alt)
    expect(dialog.querySelector('img')).toHaveClass('object-contain')
    expect(within(dialog).getByRole('button', { name: 'Close screenshot' })).toHaveFocus()

    const close = within(dialog).getByRole('button', { name: 'Close screenshot' })
    const dialogNext = within(dialog).getAllByRole('button', { name: 'Next screenshot' })[0]
    await user.tab()
    await user.tab()
    expect(dialogNext).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()

    await user.click(screen.getByTestId('lightbox-backdrop'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(training).toHaveFocus()
  })

  it('closes the enlarged preview immediately when motion is reduced', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation(() => ({
        matches: true,
        addEventListener: () => {},
        removeEventListener: () => {},
      })),
    )

    const user = userEvent.setup()
    render(<Projects />)

    const training = screen.getByRole('button', { name: featuredProject.gallery[1].caption })
    await user.click(training)
    expect(screen.getByRole('dialog')).toHaveAttribute('data-lightbox-phase', 'open')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.querySelector('[data-lightbox-phase="closing"]')).not.toBeInTheDocument()
    expect(training).toHaveFocus()
  })

  it('reaches the featured actions from the keyboard', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.tab()
    expect(screen.getByRole('link', { name: 'Discover More' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('link', { name: 'Try Me' })).toHaveFocus()
  })
})
