import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout'
import { AppShell } from './layouts/AppShell'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AdminRoute } from './routes/AdminRoute'
import { ComponentDemo } from './pages/ComponentDemo'
import { useInitAuth } from './hooks/useInitAuth'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { CmsProvider } from './context/cmsContext'
import { ForcePasswordGuard } from './routes/ForcePasswordGuard'
import { ForcePasswordChange } from './pages/ForcePasswordChange'
import { ForgotPassword } from './pages/ForgetPassword'
import { AdminHome } from './pages/AdminHome'
import { ToastContainer } from './components/ToastContainer'
import { ApprovalQueue } from './pages/ApprovalQueue'
import { UserManagement } from './pages/UserManagement'
import { DepartmentManager } from './pages/DepartmentManager'
import { Files } from './pages/Files'
import { AuditLogViewer } from './pages/AuditLogViewer'
import { BroadcastNotification } from './pages/BroadcastNotification'
import { CmsEditor } from './pages/CmsEditor'
import { SystemConfigPanel } from './pages/SystemConfigPanel'
import { UserHome } from './pages/UserHome'
function Landing() { return <div>Landing (public)</div> }




export default function App() {

   const { isChecking } = useInitAuth()

  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  return (
    <CmsProvider>
      <BrowserRouter>
      <ToastContainer />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/demo" element={<ComponentDemo />} />
        </Route>

        {/* Protected — any authenticated user, nested inside AppShell */}
        <Route element={<ProtectedRoute />}>
          <Route path="/force-password-change" element={<ForcePasswordChange />} />
  <Route element={<ForcePasswordGuard />}></Route>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<UserHome />} />
            <Route path="/dashboard/files" element={<Files />} />

            {/* Admin-only — nested one level deeper, requires SUPER_ADMIN/DEPT_ADMIN */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/approvals" element={<ApprovalQueue />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/departments" element={<DepartmentManager />} />
              <Route path="/admin/audit-logs" element={<AuditLogViewer />} />
              <Route path="/admin/broadcast" element={<BroadcastNotification />} />
              <Route path="/admin/cms" element={<CmsEditor />} />
              <Route path="/admin/settings" element={<SystemConfigPanel />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </CmsProvider>
  )
}