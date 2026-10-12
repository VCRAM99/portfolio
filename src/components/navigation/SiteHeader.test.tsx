import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { navigationItems } from '../../data/navigation'
import { DesktopNavigation } from './DesktopNavigation'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('links the VR mark to the top of the page', () => {
    render(<SiteHeader activeSection="home" />)

    const brand = screen.getByRole('link', { name: 'Varun Ramanathan — Home' })

    expect(brand).toHaveAttribute('href', '#home')
    expect(brand).toHaveAttribute('aria-current', 'true')
  })

  it('renders every section destination as an anchor', () => {
    render(<SiteHeader activeSection="home" />)

    const primary = screen.getByRole('navigation', { name: 'Primary' })
    const links = within(primary).getAllByRole('link')

    expect(links).toHaveLength(5)
    expect(within(primary).queryByRole('link', { name: 'Featured' })).not.toBeInTheDocument()

    for (const item of navigationItems) {
      expect(within(primary).getByRole('link', { name: item.label })).toHaveAttribute(
        'href',
        `#${item.id}`,
      )
    }
  })

  it('marks the active desktop section', () => {
    render(<DesktopNavigation activeSection="experience" />)

    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('expands desktop navigation on hover and keyboard focus', async () => {
    const user = userEvent.setup()
    render(<DesktopNavigation activeSection="home" />)

    const primary = screen.getByRole('navigation', { name: 'Primary' })
    expect(primary).toHaveAttribute('data-expanded', 'false')

    await user.hover(primary)
    expect(primary).toHaveAttribute('data-expanded', 'true')

    await user.unhover(primary)
    await new Promise((resolve) => setTimeout(resolve, 250))
    expect(primary).toHaveAttribute('data-expanded', 'false')

    await user.tab()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus()
    expect(primary).toHaveAttribute('data-expanded', 'true')
  })

  it('opens and closes the mobile menu from the button and from a section link', async () => {
    const user = userEvent.setup()
    render(
      <>
        <SiteHeader activeSection="home" />
        <section id="contact">Contact</section>
      </>,
    )

    const openButton = screen.getByRole('button', { name: 'Open menu' })
    expect(openButton).toHaveAttribute('aria-expanded', 'false')
    expect(openButton).toHaveAttribute('aria-controls')
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()

    await user.click(openButton)

    const closeButton = screen.getByRole('button', { name: 'Close menu' })
    const menuId = closeButton.getAttribute('aria-controls')
    const mobile = screen.getByRole('navigation', { name: 'Mobile' })

    expect(closeButton).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById(menuId!)).toContainElement(mobile)
    expect(within(mobile).getAllByRole('link')).toHaveLength(navigationItems.length)
    expect(within(mobile).getByRole('link', { name: 'Home' })).toHaveFocus()

    await user.click(within(mobile).getByRole('link', { name: 'Contact' }))

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()
    expect(document.getElementById('contact')).toHaveFocus()
  })

  it('closes the mobile menu on Escape and restores focus to the button', async () => {
    const user = userEvent.setup()
    render(<SiteHeader activeSection="home" />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.keyboard('{Escape}')

    const openButton = screen.getByRole('button', { name: 'Open menu' })
    expect(openButton).toHaveAttribute('aria-expanded', 'false')
    expect(openButton).toHaveFocus()
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()
  })

  it('closes the mobile menu when clicking outside', async () => {
    const user = userEvent.setup()
    render(<SiteHeader activeSection="home" />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(document.body)

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })
})
