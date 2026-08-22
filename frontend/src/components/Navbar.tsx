import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from '.'

const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Navbar() {
  const user = useAuthStore((s) => s.user)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-page/85 backdrop-blur-xl">
      <nav
        className="shell flex h-14 items-center justify-between gap-6"
        aria-label="Main navigation"
      >
        {/* Identity */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 text-text-primary"
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

        {/* Sections */}
        <div className="hidden h-full items-center md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="eyebrow relative flex h-full items-center px-3 text-text-muted transition-colors duration-150 hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Access */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {user ? (
            <Link to="/dashboard">
              <Button variant="primary" size="sm">
                Go to dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>

              <Link to="/register">
                <Button variant="primary" size="sm">
                  Request access
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          className="rounded-md border border-border-default p-1.5 text-text-secondary transition-colors duration-150 hover:border-border-bright hover:text-text-primary md:hidden"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={18} strokeWidth={1.8} /> : <Menu size={18} strokeWidth={1.8} />}
        </button>
      </nav>

      {/* Mobile sections */}
      {mobileOpen && (
        <div className="border-t border-border-subtle bg-page md:hidden">
          <div className="shell flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className="eyebrow border-l-2 border-l-transparent px-3 py-3 text-text-muted transition-colors duration-150 hover:border-l-accent hover:bg-card hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}

            <div className="mt-2 grid gap-2 border-t border-border-subtle pt-3">
              {user ? (
                <Link to="/dashboard" onClick={closeMobile}>
                  <Button variant="primary" className="w-full">
                    Go to dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={closeMobile}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>

                  <Link to="/register" onClick={closeMobile}>
                    <Button variant="primary" className="w-full">
                      Request access
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
