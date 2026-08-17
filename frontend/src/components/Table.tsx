import type { ReactNode } from 'react'

interface Column<T> {
  key: keyof T
  header: string
  render?: (row: T) => ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
}

export function Table<T extends { id: string | number }>({
  columns,
  data,
  emptyMessage = 'No data available.',
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-default bg-surface/50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-text-muted"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border-subtle/50">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center"
              >
                <p className="text-xs text-text-muted">
                  {emptyMessage}
                </p>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className="transition-colors duration-150 hover:bg-card-hover/60"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="whitespace-nowrap px-4 py-3 text-xs text-text-primary"
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}