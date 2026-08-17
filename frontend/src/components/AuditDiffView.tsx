interface AuditDiffViewProps {
  oldValue: Record<string, unknown> | null
  newValue: Record<string, unknown> | null
}

function formatValue(value: unknown) {
  if (value === undefined) return '—'
  if (value === null) return 'null'

  if (typeof value === 'string') {
    return `"${value}"`
  }

  return JSON.stringify(value)
}

export function AuditDiffView({
  oldValue,
  newValue,
}: AuditDiffViewProps) {
  const allKeys = new Set([
    ...Object.keys(oldValue ?? {}),
    ...Object.keys(newValue ?? {}),
  ])

  if (allKeys.size === 0) {
    return (
      <div className="rounded-lg border border-border-subtle bg-surface/50 px-3 py-3">
        <p className="font-mono text-[11px] text-text-muted">
          No field-level detail recorded.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface/50">
      {/* Header */}
      <div className="border-b border-border-subtle bg-card/60 px-3 py-2">
        <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-text-muted">
          Field Changes
        </p>
      </div>

      {/* Changes */}
      <div className="divide-y divide-border-subtle/50">
        {Array.from(allKeys).map((key) => {
          const before = oldValue?.[key]
          const after = newValue?.[key]

          const changed =
            JSON.stringify(before) !== JSON.stringify(after)

          return (
            <div
              key={key}
              className="flex flex-col gap-1.5 px-3 py-2.5 sm:flex-row sm:items-start sm:gap-4"
            >
              {/* Field name */}
              <span className="w-full shrink-0 font-mono text-[11px] font-medium text-text-muted sm:w-32">
                {key}
              </span>

              {/* Value */}
              {changed ? (
                <div className="min-w-0 break-all font-mono text-[11px]">
                  <span className="text-critical line-through decoration-critical/60">
                    {formatValue(before)}
                  </span>

                  <span className="mx-2 text-text-muted">
                    →
                  </span>

                  <span className="text-nominal">
                    {formatValue(after)}
                  </span>
                </div>
              ) : (
                <span className="min-w-0 break-all font-mono text-[11px] text-text-secondary">
                  {formatValue(after ?? before)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}