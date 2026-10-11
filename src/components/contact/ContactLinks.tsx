import { ArrowUpRight } from 'lucide-react'
import { contact } from '../../data/contact'
import { useCopyEmail } from '../../hooks/useCopyEmail'

const linkClassName =
  'group inline-flex min-h-11 items-center gap-2 text-base tracking-wide text-foreground underline-offset-4 transition duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-accent motion-reduce:transition-none'

export function ContactLinks() {
  const { copyEmail, copyMessage } = useCopyEmail()

  return (
    <ul className="flex flex-col gap-4">
      <li>
        <button type="button" onClick={copyEmail} className={`${linkClassName} font-serif text-3xl leading-none tracking-tight md:text-4xl`}>
          {contact.email}
          <ArrowUpRight
            aria-hidden="true"
            size={22}
            strokeWidth={1.5}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-none"
          />
        </button>
        <p className="mt-2 h-5 text-sm text-muted" role="status" aria-live="polite">
          {copyMessage}
        </p>
      </li>
      <li>
        <a href={contact.github} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          GitHub
          <ArrowUpRight
            aria-hidden="true"
            size={16}
            strokeWidth={1.75}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-none"
          />
        </a>
      </li>
      <li>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          LinkedIn
          <ArrowUpRight
            aria-hidden="true"
            size={16}
            strokeWidth={1.75}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-none"
          />
        </a>
      </li>
    </ul>
  )
}
