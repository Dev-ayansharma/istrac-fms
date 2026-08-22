import { ArrowUpRight, Mail, Phone } from 'lucide-react'
import { useCms } from '../context/cmsContext'

interface ContactInfo { email?: string; phone?: string }

export function ContactSection() {
  const { cmsBlocks } = useCms()
  const contact = cmsBlocks['contact_info'] as ContactInfo | undefined
  if (!contact?.email && !contact?.phone) return null

  return (
    <section id="contact" className="bg-page py-20 sm:py-24" aria-labelledby="contact-title">
      <div className="shell grid items-start gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <div>
          <p className="eyebrow flex items-center gap-2.5 text-accent-light">
            <span aria-hidden="true" className="h-2.5 w-px bg-accent-light" />
            Support
          </p>

          <h2
            id="contact-title"
            className="display mt-5 max-w-lg text-3xl text-text-primary sm:text-[2.5rem]"
          >
            Need help with ISTRAC-FMS?
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-text-secondary">
            Reach the system support team for access assistance and platform
            queries.
          </p>
        </div>

        {/* A directory, not a set of cards. Addresses and numbers are machine
            values, so they're set in mono. */}
        <div className="overflow-hidden rounded-xl border border-border-subtle bg-card shadow-card">
          <div className="border-b border-border-subtle bg-surface px-4 py-2.5">
            <span className="eyebrow text-text-muted">System support</span>
          </div>

          <div className="divide-y divide-border-subtle">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="group flex items-center gap-3.5 px-4 py-4 transition-colors duration-150 hover:bg-card-hover"
              >
                <Mail
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0 text-text-dim transition-colors duration-150 group-hover:text-accent-light"
                  aria-hidden="true"
                />

                <span className="min-w-0 flex-1">
                  <span className="col-label block">Email</span>
                  <span className="num mt-1.5 block truncate text-xs text-text-secondary transition-colors duration-150 group-hover:text-text-primary">
                    {contact.email}
                  </span>
                </span>

                <ArrowUpRight
                  size={14}
                  className="shrink-0 text-text-dim transition-colors duration-150 group-hover:text-accent-light"
                  aria-hidden="true"
                />
              </a>
            )}

            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="group flex items-center gap-3.5 px-4 py-4 transition-colors duration-150 hover:bg-card-hover"
              >
                <Phone
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0 text-text-dim transition-colors duration-150 group-hover:text-accent-light"
                  aria-hidden="true"
                />

                <span className="min-w-0 flex-1">
                  <span className="col-label block">Phone</span>
                  <span className="num mt-1.5 block truncate text-xs text-text-secondary transition-colors duration-150 group-hover:text-text-primary">
                    {contact.phone}
                  </span>
                </span>

                <ArrowUpRight
                  size={14}
                  className="shrink-0 text-text-dim transition-colors duration-150 group-hover:text-accent-light"
                  aria-hidden="true"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

