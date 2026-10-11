import { EducationEntry } from '../components/education/EducationEntry'
import { education } from '../data/education'

export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="scroll-mt-24 border-b border-border px-6 py-24 md:px-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 id="education-heading" className="font-serif text-5xl md:text-7xl">
          Education.
        </h2>

        <ul className="mt-10 border-t border-border md:mt-12">
          {education.map((entry) => (
            <li key={entry.id} className="border-b border-border">
              <EducationEntry entry={entry} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
