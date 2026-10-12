import { useEffect, useState } from 'react'
import { ExperienceAccordion } from '../components/experience/ExperienceAccordion'
import { ExperienceCard } from '../components/experience/ExperienceCard'
import { ExperienceDetails } from '../components/experience/ExperienceDetails'
import { Reveal } from '../components/ui/Reveal'
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
      className="section-chapter scroll-mt-24 px-6 py-16 md:px-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal group="experience">
          <h2 id="experience-heading" className="font-serif text-5xl xl:text-6xl">
            Experience.
          </h2>
        </Reveal>

        {isDesktop ? (
          <>
            <div className="mt-8 flex flex-wrap items-stretch justify-start gap-3 xl:mt-6">
              {experience.map((entry, index) => (
                <Reveal key={entry.id} group="experience" className="h-full w-fit" delayMs={index * 70}>
                  <ExperienceCard
                    entry={entry}
                    selected={entry.id === selected.id}
                    onSelect={setSelectedId}
                  />
                </Reveal>
              ))}
            </div>

            <Reveal group="experience" delayMs={180}>
              <ExperienceDetails entry={selected} />
            </Reveal>
          </>
        ) : (
          <ExperienceAccordion selectedId={selectedId} onToggle={toggleEmployer} />
        )}
      </div>
    </section>
  )
}
