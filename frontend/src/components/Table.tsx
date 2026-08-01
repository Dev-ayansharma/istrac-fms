import type { ReactNode } from "react"


interface Column<T> {
  key: keyof T
  header: string
  render?: (row: T) => ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  variant?: 'default' | 'striped'
}

export function Table<T extends { id: string | number }>({ columns, data, variant = 'default' }: TableProps<T>) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-navy-900 text-white">
          {columns.map((col) => (
            <th key={String(col.key)} className="text-left px-3 py-2 font-medium">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr
            key={row.id}
            className={variant === 'striped' && i % 2 === 1 ? 'bg-slate-50' : 'bg-white'}
          >
            {columns.map((col) => (
              <td key={String(col.key)} className="px-3 py-2 border-b border-slate-100">
                {col.render ? col.render(row) : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}