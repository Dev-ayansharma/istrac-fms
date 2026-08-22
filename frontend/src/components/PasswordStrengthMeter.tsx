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

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {requirements.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < passedCount ? barColor : 'bg-border-subtle'}`}
          />
        ))}
      </div>
      <ul className="space-y-1">
        {requirements.map((req) => {
          const passed = req.test(password)
          return (
            <li
              key={req.label}
              className={`text-xs flex items-center gap-1.5 ${passed ? 'text-nominal' : 'text-text-muted'}`}
            >
              <span>{passed ? '✓' : '○'}</span>
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