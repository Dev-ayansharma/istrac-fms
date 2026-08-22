import { LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '.'

/**
 * The access gate. This is the one thing a signed-out visitor can act on, so
 * it states plainly what's behind the door and what to do about it.
 */
export function GuestAccessPanel() {
  return (
    <aside
      className="overflow-hidden rounded-xl border border-border-default bg-surface shadow-card-lg"
      aria-labelledby="guest-access-title"
    >
      {/* Status header: this panel is a locked state, and it says so. */}
      <div className="flex items-center gap-2 border-b border-border-subtle bg-card px-4 py-2.5">
        <LockKeyhole size={13} className="shrink-0 text-warning" strokeWidth={2} />
        <span className="eyebrow text-warning">Restricted</span>
        <span className="num ml-auto text-[10px] text-text-dim">SIGNED OUT</span>
      </div>

      <div className="p-5 sm:p-6">
        <h2
          id="guest-access-title"
          className="text-lg leading-snug text-text-primary"
        >
          Reports are not available
        </h2>

        <p className="mt-2.5 text-[13px] leading-6 text-text-muted">
          Log in to view satellite operations reports, mission files and the
          resources for your department.
        </p>

        {/* What's behind the gate, so the ask is concrete. */}
        <ul className="mt-5 space-y-2.5 border-t border-border-subtle pt-5">
          {['Department file libraries', 'Operations and anomaly reports', 'Traceable file activity'].map(
            (item) => (
              <li key={item} className="flex items-start gap-2.5 text-[13px] text-text-secondary">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-light"
                />
                {item}
              </li>
            ),
          )}
        </ul>

        <Link to="/login" className="mt-6 block">
          <Button variant="primary" size="lg" className="w-full">
            Log in
          </Button>
        </Link>

        <p className="mt-4 text-center text-xs text-text-muted">
          No account yet?{' '}
          <Link
            to="/register"
            className="text-accent-light underline decoration-accent/30 underline-offset-2 transition-colors duration-150 hover:text-text-primary hover:decoration-accent"
          >
            Request access
          </Link>
        </p>
      </div>
    </aside>
  )
}
