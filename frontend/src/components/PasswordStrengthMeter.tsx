import { Check, Minus } from 'lucide-react'

interface Requirement {
  label: string
  test: (pw: string) => boolean
}

const requirements: Requirement[] = [
  { label: 'At least 10 characters', test: (pw) => pw.length >= 10 },
  { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'One digit', test: (pw) => /[0-9]/.test(pw) },
  { label: 'One special character (!@#$%^&*()-_=+)', test: (pw) => /[!@#$%^&*()\-_=+]/.test(pw) },
]

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const passedCount = requirements.filter((r) => r.test(password)).length
  // const allPassed = passedCount === requirements.length

  const barColor =
    passedCount <= 2 ? 'bg-critical' : passedCount <= 4 ? 'bg-warning' : 'bg-nominal'

  const labelColor =
    passedCount <= 2 ? 'text-critical' : passedCount <= 4 ? 'text-warning' : 'text-nominal'

  return (
    /* A checklist, not a score: each line says exactly what is still missing. */
    <div className="rounded-md border border-border-subtle bg-page-soft p-3.5">
      <div className="flex items-center justify-between">
        <span className="col-label">Password requirements</span>

        <span className={`num text-[10px] ${labelColor}`}>
          {passedCount} / {requirements.length}
        </span>
      </div>

      <div className="mt-2.5 flex gap-1" aria-hidden="true">
        {requirements.map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-colors duration-200 ${
              i < passedCount ? barColor : 'bg-border-subtle'
            }`}
          />
        ))}
      </div>

      <ul className="mt-3.5 space-y-1.5">
        {requirements.map((req) => {
          const passed = req.test(password)

          return (
            <li
              key={req.label}
              className={`flex items-start gap-2 text-[11px] leading-4 transition-colors duration-150 ${
                passed ? 'text-nominal' : 'text-text-muted'
              }`}
            >
              {passed ? (
                <Check size={12} strokeWidth={2.5} className="mt-px shrink-0" aria-hidden="true" />
              ) : (
                <Minus size={12} strokeWidth={2.5} className="mt-px shrink-0 text-text-dim" aria-hidden="true" />
              )}
              {req.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function isPasswordValid(password: string): boolean {
  return requirements.every((r) => r.test(password))
}
