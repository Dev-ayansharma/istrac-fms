import type  { ReactNode } from 'react'

interface Column<T> {
  key: keyof T
  header: string
  render?: (row: T) => ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
}

export function Table<T extends { id: string | number }>({ columns, data }: TableProps<T>) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-border-subtle">
          {columns.map((col) => (
            <th key={String(col.key)} className="text-left px-3 py-2 font-medium text-text-secondary">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="border-b border-border-subtle hover:bg-card">
            {columns.map((col) => (
              <td key={String(col.key)} className="px-3 py-2 text-text-primary">
                {col.render ? col.render(row) : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}