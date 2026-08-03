
import { Outlet } from 'react-router-dom'

export function AppShell() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-navy-900 text-white">{/* Sidebar — FE-017 */}</aside>
      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-slate-100">{/* Topbar — FE-017 */}</header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}