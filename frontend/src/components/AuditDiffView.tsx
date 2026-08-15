interface AuditDiffViewProps {
  oldValue: Record<string, unknown> | null
  newValue: Record<string, unknown> | null
}

export function AuditDiffView({ oldValue, newValue }: AuditDiffViewProps) {
  const allKeys = new Set([...Object.keys(oldValue ?? {}), ...Object.keys(newValue ?? {})])

  if (allKeys.size === 0) {
    return <p className="text-text-muted text-xs font-mono">No field-level detail recorded.</p>
  }

  return (
    <div className="font-mono text-xs space-y-1">
      {Array.from(allKeys).map((key) => {
        const before = oldValue?.[key]
        const after = newValue?.[key]
        const changed = JSON.stringify(before) !== JSON.stringify(after)

        return (
          <div key={key} className="flex gap-2">
            <span className="text-text-muted w-32 shrink-0">{key}:</span>
            {changed ? (
              <span>
                <span className="text-critical line-through">{JSON.stringify(before)}</span>
                {' → '}
                <span className="text-nominal">{JSON.stringify(after)}</span>
              </span>
            ) : (
              <span className="text-text-secondary">{JSON.stringify(after ?? before)}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}