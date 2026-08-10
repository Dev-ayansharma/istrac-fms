import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { AxiosError } from 'axios'
import { api } from '../lib/axios'
import { useAuthStore } from '../store/authStore'
import { Button, Input } from '../components'
import { loginSchema, type LoginFormData,  } from '../schemas/authSchemas'

export function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [serverError, setServerError] = useState<string | null>(null)
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setServerError(null)
    setLockoutRemaining(null)

    try {
      const response = await api.post('/auth/login', data)
      setAuth(response.data.user, response.data.accessToken)
      navigate('/dashboard')
    } catch (err) {
      const error = err as AxiosError<{
        error: { code: string; message: string }
        lockoutSecondsRemaining?: number
      }>

      if (error.response?.status === 429 && error.response.data.lockoutSecondsRemaining) {
        // Ch. 5.3: 5 failed attempts -> 15-minute lockout
        setLockoutRemaining(error.response.data.lockoutSecondsRemaining)
      } else if (error.response?.data?.error?.message) {
        setServerError(error.response.data.error.message)
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-xl font-semibold text-navy-900 mb-6 font-sans">Sign in to ISTRAC-FMS</h1>

        {lockoutRemaining !== null && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
            Too many failed attempts. Try again in {Math.ceil(lockoutRemaining / 60)} minute
            {Math.ceil(lockoutRemaining / 60) !== 1 ? 's' : ''}.
          </div>
        )}

        {serverError && lockoutRemaining === null && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">{serverError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="username"
            disabled={lockoutRemaining !== null}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            disabled={lockoutRemaining !== null}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-navy-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting || lockoutRemaining !== null}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}