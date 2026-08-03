import { useEffect, useState } from 'react'
import { api } from '../lib/axios'
import { useAuthStore } from '../store/authStore'

export function useInitAuth() {
  const [isChecking, setIsChecking] = useState(true)
  const user = useAuthStore((s) => s.user)
  const setAuth = useAuthStore((s) => s.setAuth)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  useEffect(() => {
    // If there's no leftover `user` from storage, don't even bother —
    // definitely not logged in, skip straight to showing the login page.
    if (!user) {
      setIsChecking(false)
      return
    }

    api
      .post('/auth/refresh')
      .then(({ data }) => setAuth(user, data.accessToken))
      .catch(() => clearAuth())
      .finally(() => setIsChecking(false))
  }, [])

  return { isChecking }
}