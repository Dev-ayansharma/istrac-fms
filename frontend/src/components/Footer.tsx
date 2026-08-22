import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-page-soft">
      <div className="shell py-12">
        <div className="flex flex-col justify-between gap-8 border-b border-border-subtle pb-8 sm:flex-row sm:items-start">
          <div>
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5 text-text-primary"
              aria-label="ISTRAC-FMS home"
            >
              <span
                className="grid h-7 w-7 place-items-center rounded-md border border-accent/30 bg-accent/10 text-accent-light transition-colors duration-150 group-hover:border-accent/60"
                aria-hidden="true"
              >
                <span className="relative block h-3.5 w-3.5">
                  <span className="absolute top-[6px] left-0 h-px w-3.5 rotate-45 bg-current" />
                  <span className="absolute top-[6px] left-0 h-px w-3.5 -rotate-45 bg-current" />
                  <span className="absolute top-[3px] left-[3px] h-2 w-2 rounded-full border border-current" />
                </span>
              </span>

              <span className="text-[13px] tracking-[0.06em]">
                ISTRAC<span className="text-accent-light">-FMS</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-xs leading-6 text-text-muted">
              Secure and centralized file management for ISTRAC departments.
            </p>
          </div>

          <a
            href="#hero"
            className="group inline-flex items-center gap-2 text-xs text-text-muted transition-colors duration-150 hover:text-text-primary"
          >
            Back to top
            <ArrowUp
              size={13}
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        {/* Colophon. Station and reference frame, as they'd appear in a log. */}
        <div className="flex flex-col justify-between gap-3 pt-6 sm:flex-row sm:items-center">
          <p className="text-[11px] text-text-dim">
            © 2026 ISTRAC-FMS. All rights reserved.
          </p>

          <p className="num flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-text-dim">
            <span>BLR · 13.03°N 77.51°E</span>
            <span aria-hidden="true" className="hidden h-2.5 w-px bg-border-default sm:block" />
            <span>REF UTC</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
