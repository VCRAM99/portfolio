import { FileText, Mail, createLucideIcon } from 'lucide-react'
import { contact } from '../../data/contact'
import { useCopyEmail } from '../../hooks/useCopyEmail'

const Github = createLucideIcon('github', [
  [
    'path',
    {
      d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
    },
  ],
  ['path', { d: 'M9 18c-4.51 2-5-2-7-2' }],
])

const Linkedin = createLucideIcon('linkedin', [
  [
    'path',
    {
      d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z',
    },
  ],
  ['rect', { width: '4', height: '12', x: '2', y: '9' }],
  ['circle', { cx: '4', cy: '4', r: '2' }],
])

const actionClassName =
  'inline-flex min-h-11 items-center gap-2 rounded-sm px-1 text-sm tracking-wide text-current underline-offset-4 transition duration-200 hover:-translate-y-px hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0'

export function HeroActions() {
  const { copyEmail, copyMessage } = useCopyEmail()

  return (
    <div className="hero-actions relative mt-5 text-white">
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
        <li>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className={actionClassName}
          >
            <Github aria-hidden="true" size={16} strokeWidth={1.75} />
            GitHub
          </a>
        </li>
        <li>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={actionClassName}
          >
            <Linkedin aria-hidden="true" size={16} strokeWidth={1.75} />
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href={contact.resume}
            target="_blank"
            rel="noopener noreferrer"
            className={actionClassName}
          >
            <FileText aria-hidden="true" size={16} strokeWidth={1.75} />
            Resume
          </a>
        </li>
        <li>
          <button type="button" className={actionClassName} onClick={copyEmail}>
            <Mail aria-hidden="true" size={16} strokeWidth={1.75} />
            Email
          </button>
        </li>
      </ul>
      <p
        className="absolute top-full left-0 mt-2 text-sm"
        role="status"
        aria-live="polite"
      >
        {copyMessage}
      </p>
    </div>
  )
}
