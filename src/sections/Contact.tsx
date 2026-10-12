import { ContactLinks } from '../components/contact/ContactLinks'
import { SiteFooter } from '../components/layout/SiteFooter'
import { Reveal } from '../components/ui/Reveal'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="section-chapter scroll-mt-24 px-6 pt-24 md:px-16 xl:pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal group="contact">
            <p className="text-xs font-medium tracking-[0.25em] text-muted uppercase">Contact</p>
            <h2 id="contact-heading" className="mt-5 font-serif text-5xl leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
              Let's build something meaningful.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
              Interested in collaborating, discussing an opportunity, or exploring an idea? I'd love to hear from you.
            </p>
          </Reveal>

          <div className="border-t border-border pt-10 lg:border-t-0 lg:border-l lg:pt-2 lg:pl-16">
            <Reveal group="contact" delayMs={80}>
              <ContactLinks />
            </Reveal>
          </div>
        </div>

        <SiteFooter />
      </div>
    </section>
  )
}
