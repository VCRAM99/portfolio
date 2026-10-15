import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { experience } from '../data/experience'
import { Experience } from './Experience'

function pressedButtons() {
  return screen.getAllByRole('button').filter((button) => button.getAttribute('aria-pressed') === 'true')
}

function expandedButtons() {
  return screen.getAllByRole('button').filter((button) => button.getAttribute('aria-expanded') === 'true')
}

function visibleCopies(text: string) {
  return screen.queryAllByText(text).filter((element) => !element.closest('[hidden]'))
}

function details() {
  const panel = document.getElementById('experience-details')
  if (!panel) throw new Error('Missing experience details')
  return within(panel)
}

function installMatchMedia(initial: boolean) {
  const state = { matches: initial }
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      get matches() {
        return state.matches
      },
      media: query,
      addEventListener: (_event: string, handler: (event: MediaQueryListEvent) => void) => {
        listeners.add(handler)
      },
      removeEventListener: (_event: string, handler: (event: MediaQueryListEvent) => void) => {
        listeners.delete(handler)
      },
    })),
  )

  return {
    change(matches: boolean) {
      state.matches = matches
      for (const listener of listeners) {
        listener({ matches, media: '(min-width: 1024px)' } as MediaQueryListEvent)
      }
    },
  }
}

describe('Experience desktop', () => {
  beforeEach(() => {
    installMatchMedia(true)
  })

  it('renders every employer from the experience data', () => {
    render(<Experience />)

    expect(document.getElementById('experience')).toHaveAttribute('aria-labelledby', 'experience-heading')

    for (const entry of experience) {
      expect(screen.getByRole('button', { name: new RegExp(entry.name) })).toHaveTextContent(entry.dates)
    }

    expect(screen.queryByRole('button', { expanded: true })).not.toBeInTheDocument()
    expect(visibleCopies(experience[0].summary)).toHaveLength(1)
    expect([...document.querySelectorAll('#experience img')].map((image) => image.getAttribute('src'))).toEqual([
      '/employers/td-light.png',
      '/employers/quanto-light.png',
      '/employers/cibc-light.png',
      '/employers/mcmaster-light.png',
    ])
  })

  it('selects TD Bank initially and shows that employer’s data', () => {
    render(<Experience />)

    expect(screen.getByRole('button', { name: /TD Bank/ })).toHaveAttribute('aria-pressed', 'true')
    expect(pressedButtons()).toHaveLength(1)

    const panel = details()
    const td = experience[0]

    expect(panel.getByRole('heading', { name: td.name })).toBeInTheDocument()
    expect(panel.getByText(td.roles[0].title)).toBeInTheDocument()
    expect(panel.getByText(td.roles[0].dates)).toBeInTheDocument()
    expect(panel.getByText(td.summary)).toBeInTheDocument()

    const accomplishmentList = panel.getByRole('list', { name: 'Accomplishments' })

    expect(within(accomplishmentList).getAllByRole('listitem')).toHaveLength(3)
    for (const achievement of td.roles[0].achievements) {
      expect(within(accomplishmentList).getByText(achievement)).toBeInTheDocument()
    }
  })

  it('updates the shared panel and keeps a single selection', async () => {
    const user = userEvent.setup()
    render(<Experience />)

    await user.click(screen.getByRole('button', { name: /Quanto/ }))

    expect(screen.getByRole('button', { name: /Quanto/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /TD Bank/ })).toHaveAttribute('aria-pressed', 'false')
    expect(pressedButtons()).toHaveLength(1)

    const quanto = experience[1]
    const panel = details()

    expect(panel.getByRole('heading', { name: quanto.name })).toBeInTheDocument()
    expect(panel.getByText(quanto.summary)).toBeInTheDocument()
    expect(panel.queryByText(experience[0].summary)).not.toBeInTheDocument()
    expect(panel.getByText('OpenAI API')).toBeInTheDocument()
    expect(visibleCopies(quanto.summary)).toHaveLength(1)
  })

  it('shows the McMaster role and three accomplishments drawn from the data', async () => {
    const user = userEvent.setup()
    render(<Experience />)

    await user.click(screen.getByRole('button', { name: /McMaster University/ }))

    const mcmaster = experience[3]
    const panel = details()

    expect(panel.getByText(mcmaster.roles[0].title)).toBeInTheDocument()
    expect(panel.getByText(mcmaster.roles[0].dates)).toBeInTheDocument()
    expect(panel.getByText(mcmaster.summary)).toBeInTheDocument()
    expect(within(panel.getByRole('list', { name: 'Accomplishments' })).getAllByRole('listitem')).toHaveLength(3)
    expect(panel.getByText(mcmaster.roles[0].achievements[0])).toBeInTheDocument()
    expect(panel.getByText(mcmaster.roles[0].achievements[2])).toBeInTheDocument()
  })

  it('selects an employer from the keyboard', async () => {
    const user = userEvent.setup()
    render(<Experience />)

    await user.tab()
    expect(screen.getByRole('button', { name: /TD Bank/ })).toHaveFocus()

    await user.tab()
    const quanto = screen.getByRole('button', { name: /Quanto/ })
    expect(quanto).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(quanto).toHaveAttribute('aria-pressed', 'true')
    expect(details().getByRole('heading', { name: 'Quanto' })).toBeInTheDocument()
    expect(pressedButtons()).toHaveLength(1)
  })
})

describe('Experience mobile accordion', () => {
  beforeEach(() => {
    installMatchMedia(false)
  })

  it('renders every employer and expands TD Bank initially', () => {
    render(<Experience />)

    expect(document.getElementById('experience-details')).not.toBeInTheDocument()

    for (const entry of experience) {
      const button = screen.getByRole('button', { name: new RegExp(entry.name) })
      const panelId = button.getAttribute('aria-controls')

      expect(button).toHaveTextContent(entry.dates)
      expect(panelId).toBe(`experience-panel-${entry.id}`)
      expect(document.getElementById(panelId!)).toHaveAttribute('aria-labelledby', button.id)
    }

    expect(screen.getByRole('button', { name: /TD Bank/ })).toHaveAttribute('aria-expanded', 'true')
    expect(expandedButtons()).toHaveLength(1)
    expect(visibleCopies(experience[0].summary)).toHaveLength(1)
    expect([...document.querySelectorAll('#experience img')].map((image) => image.getAttribute('src'))).toEqual([
      '/employers/td-light.png',
      '/employers/quanto-light.png',
      '/employers/cibc-light.png',
      '/employers/mcmaster-light.png',
    ])
    for (const image of document.querySelectorAll('#experience img')) {
      expect(image).toHaveAttribute('alt', '')
    }
  })

  it('expands one employer at a time and can collapse it', async () => {
    const user = userEvent.setup()
    render(<Experience />)

    await user.click(screen.getByRole('button', { name: /Quanto/ }))

    expect(screen.getByRole('button', { name: /Quanto/ })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /TD Bank/ })).toHaveAttribute('aria-expanded', 'false')
    expect(expandedButtons()).toHaveLength(1)
    expect(visibleCopies(experience[1].summary)).toHaveLength(1)
    expect(visibleCopies(experience[0].summary)).toHaveLength(0)

    await user.click(screen.getByRole('button', { name: /Quanto/ }))

    expect(expandedButtons()).toHaveLength(0)
    expect(visibleCopies(experience[1].summary)).toHaveLength(0)
  })

  it('shows both McMaster roles inside the expanded accordion panel', async () => {
    const user = userEvent.setup()
    render(<Experience />)

    const button = screen.getByRole('button', { name: /McMaster University/ })
    await user.click(button)

    const panel = document.getElementById('experience-panel-mcmaster')
    if (!panel) throw new Error('Missing McMaster panel')
    const mcmaster = within(panel)

    for (const role of experience[3].roles) {
      expect(mcmaster.getByText(role.title)).toBeInTheDocument()
      expect(mcmaster.getByText(role.dates)).toBeInTheDocument()
    }

    expect(visibleCopies(experience[3].summary)).toHaveLength(1)
  })

  it('toggles expansion from the keyboard', async () => {
    const user = userEvent.setup()
    render(<Experience />)

    const td = screen.getByRole('button', { name: /TD Bank/ })
    await user.tab()
    expect(td).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(td).toHaveAttribute('aria-expanded', 'false')

    await user.tab()
    const quanto = screen.getByRole('button', { name: /Quanto/ })
    expect(quanto).toHaveFocus()

    await user.keyboard(' ')
    expect(quanto).toHaveAttribute('aria-expanded', 'true')
    expect(td).toHaveAttribute('aria-expanded', 'false')
    expect(visibleCopies(experience[1].summary)).toHaveLength(1)
  })

  it('keeps the same employer selected when the viewport crosses lg', () => {
    const media = installMatchMedia(true)
    render(<Experience />)

    expect(screen.getByRole('button', { name: /TD Bank/ })).toHaveAttribute('aria-pressed', 'true')

    act(() => {
      media.change(false)
    })

    expect(screen.getByRole('button', { name: /TD Bank/ })).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById('experience-details')).not.toBeInTheDocument()
    expect(visibleCopies(experience[0].summary)).toHaveLength(1)

    act(() => {
      media.change(true)
    })

    expect(screen.getByRole('button', { name: /TD Bank/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByRole('button', { expanded: true })).not.toBeInTheDocument()
  })

  it('reopens TD Bank on desktop after the accordion is fully collapsed', async () => {
    const user = userEvent.setup()
    const media = installMatchMedia(false)
    render(<Experience />)

    await user.click(screen.getByRole('button', { name: /TD Bank/ }))
    expect(expandedButtons()).toHaveLength(0)

    act(() => {
      media.change(true)
    })

    expect(screen.getByRole('button', { name: /TD Bank/ })).toHaveAttribute('aria-pressed', 'true')
    expect(visibleCopies(experience[0].summary)).toHaveLength(1)
  })
})
