import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../store/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends the httpOnly refresh cookie automatically on every request
})

// Attach the current access token to every outgoing request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Track in-flight refresh so simultaneous 401s don't trigger multiple refresh calls
let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Only attempt refresh on 401, and only once per request (avoid infinite loop)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        // Another request already triggered a refresh — wait for it instead of firing a second one
        return new Promise((resolve) => {
          refreshQueue.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(api(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const newToken = data.accessToken

        useAuthStore.getState().setAuth(useAuthStore.getState().user!, newToken)

        // Retry every request that was queued up waiting on this refresh
        refreshQueue.forEach((cb) => cb(newToken))
        refreshQueue = []

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh itself failed — the session is genuinely over
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)