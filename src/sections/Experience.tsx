import { useEffect, useState } from 'react'
import { ExperienceAccordion } from '../components/experience/ExperienceAccordion'
import { ExperienceCard } from '../components/experience/ExperienceCard'
import { ExperienceDetails } from '../components/experience/ExperienceDetails'
import { experience, type EmployerId } from '../data/experience'

const desktopQuery = '(min-width: 1024px)'

function useExperienceSelection() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(desktopQuery).matches)
  const [selectedId, setSelectedId] = useState<EmployerId | null>(experience[0].id)

  useEffect(() => {
    const media = window.matchMedia(desktopQuery)

    function update() {
      setIsDesktop(media.matches)
      if (media.matches) {
        setSelectedId((current) => current ?? experience[0].id)
      }
    }

    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return { isDesktop, selectedId, setSelectedId }
}

export function Experience() {
  const { isDesktop, selectedId, setSelectedId } = useExperienceSelection()

  function toggleEmployer(id: EmployerId) {
    setSelectedId((current) => (current === id ? null : id))
  }

  const selected = experience.find((entry) => entry.id === selectedId) ?? experience[0]

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="scroll-mt-24 border-b border-border px-6 py-24 md:px-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-5 text-xs font-medium tracking-[0.25em] text-muted uppercase">
          02 / Experience
        </p>

        <h2 id="experience-heading" className="font-serif text-5xl md:text-7xl">
          Experience.
        </h2>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          A selection of professional engineering, machine learning, and research experience.
        </p>

        {isDesktop ? (
          <>
            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {experience.map((entry) => (
                <ExperienceCard
                  key={entry.id}
                  entry={entry}
                  selected={entry.id === selected.id}
                  onSelect={setSelectedId}
                />
              ))}
            </div>

            <ExperienceDetails entry={selected} />
          </>
        ) : (
          <ExperienceAccordion selectedId={selectedId} onToggle={toggleEmployer} />
        )}
      </div>
    </section>
  )
}
