import { EducationEntry } from '../components/education/EducationEntry'
import { Reveal } from '../components/ui/Reveal'
import { education } from '../data/education'

export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="section-chapter scroll-mt-24 px-6 py-24 md:px-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal group="education">
          <h2 id="education-heading" className="font-serif text-5xl md:text-7xl">
            Education.
          </h2>
        </Reveal>

        <ul className="mt-10 border-t border-border md:mt-12">
          {education.map((entry, index) => (
            <li key={entry.id} className="border-b border-border">
              <Reveal group="education" delayMs={index * 80}>
                <EducationEntry entry={entry} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
