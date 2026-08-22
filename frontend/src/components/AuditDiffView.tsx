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

/**
 * Field-level before/after. Everything here is machine output, so the whole
 * block is mono; changed rows are the only ones that carry colour.
 */
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
      <p className="num text-[11px] text-text-dim">
        No field-level detail recorded.
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-3 py-2">
        <span className="col-label">Field changes</span>

        <span className="num text-[10px] text-text-dim">
          {allKeys.size}
        </span>
      </div>

      <div className="divide-y divide-border-subtle">
        {Array.from(allKeys).map((key) => {
          const before = oldValue?.[key]
          const after = newValue?.[key]

          const changed =
            JSON.stringify(before) !== JSON.stringify(after)

          return (
            <div
              key={key}
              className={`flex flex-col gap-1.5 border-l-2 px-3 py-2.5 sm:flex-row sm:items-start sm:gap-4 ${
                changed ? 'border-l-accent' : 'border-l-transparent'
              }`}
            >
              <span className="num w-full shrink-0 text-[11px] text-text-dim sm:w-36">
                {key}
              </span>

              {changed ? (
                <span className="num min-w-0 break-all text-[11px]">
                  <span className="text-critical line-through decoration-critical/50">
                    {formatValue(before)}
                  </span>

                  <span aria-hidden="true" className="mx-2 text-text-dim">
                    →
                  </span>

                  <span className="text-nominal">
                    {formatValue(after)}
                  </span>
                </span>
              ) : (
                <span className="num min-w-0 break-all text-[11px] text-text-secondary">
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
