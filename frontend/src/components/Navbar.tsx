import { Menu, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from '.'

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
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
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#010711]/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-[58px] w-[min(1440px,calc(100%-32px))] items-center justify-between gap-6 lg:h-[62px] lg:px-2"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3 text-[#F4F7FB]"
          aria-label="ISTRAC-FMS home"
        >
          <span
            className="grid h-8 w-8 place-items-center rounded-[6px] border border-[#006DFF]/30 bg-[#006DFF]/10 text-[#00BFFF] transition-all duration-200 group-hover:border-[#006DFF]/60 group-hover:bg-[#006DFF]/15]"
            aria-hidden="true"
          >
            <span className="relative h-4 w-4">
              <span className="absolute left-0 top-2 h-px w-4 rotate-45 bg-current" />
              <span className="absolute left-0 top-2 h-px w-4 -rotate-45 bg-current" />
              <span className="absolute left-[3px] top-[3px] h-[7px] w-[7px] rounded-full border border-current" />
            </span>
          </span>

          <span className="text-[13px] font-semibold tracking-[0.04em] sm:text-sm">
            ISTRAC<span className="text-[#1680FF]">-FMS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden h-full items-center gap-1 md:flex">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative flex h-full items-center px-3 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006DFF]/50 ${
                index === 0
                  ? 'text-[#F4F7FB] after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:bg-[#006DFF]'
                  : 'text-[#7D8998] hover:text-[#F4F7FB]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-[5px] border border-white/[0.10] bg-[#071525]/60 text-[#7D8998] transition-colors duration-150 hover:border-white/[0.20] hover:bg-[#091827] hover:text-[#F4F7FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006DFF]/40"
            aria-label="Toggle appearance"
          >
            <Sun size={14} strokeWidth={1.8} />
          </button>

          {user ? (
            <Link to="/dashboard">
              <Button variant="primary" size="sm">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>

              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex rounded-[5px] border border-white/[0.10] bg-[#071525]/60 p-2 text-[#B7C0CC] transition-colors duration-150 hover:border-white/[0.20] hover:bg-[#091827] hover:text-[#F4F7FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006DFF]/40 md:hidden"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X size={19} strokeWidth={1.8} />
          ) : (
            <Menu size={19} strokeWidth={1.8} />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-white/[0.08] bg-[#010711]/98 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex w-[min(1440px,calc(100%-32px))] flex-col gap-1 py-3">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={`rounded-[5px] px-3 py-3 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-150 ${
                  index === 0
                    ? 'bg-[#006DFF]/10 text-[#F4F7FB]'
                    : 'text-[#B7C0CC] hover:bg-white/[0.03] hover:text-[#F4F7FB]'
                }`}
              >
                {link.label}
              </a>
            ))}

            <div className="mt-2 grid gap-2 border-t border-white/[0.08] pt-3">
              {user ? (
                <Link to="/dashboard" onClick={closeMobile}>
                  <Button variant="primary" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={closeMobile}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>

                  <Link to="/register" onClick={closeMobile}>
                    <Button variant="primary" className="w-full">
                      Sign Up
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
