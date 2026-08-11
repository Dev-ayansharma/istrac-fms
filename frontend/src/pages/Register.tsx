import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { AxiosError } from 'axios'
import { api } from '../lib/axios'
import { Button, Input } from '../components'
import { registerSchema, type RegisterFormData } from '../../schemas/authSchemas'

// Hardcoded for now — replace with GET /departments once that endpoint is live (backend Week 1/2)
const DEPARTMENTS = ['Engineering', 'HR', 'Finance', 'Operations']

export function Register() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormData) {
    setServerError(null)
    try {
      await api.post('/auth/register', data)
      setSubmitted(true) // blocks re-submit — form unmounts once this is true
    } catch (err) {
      const error = err as AxiosError<{ error: { message: string } }>
      setServerError(error.response?.data?.error?.message ?? 'Registration failed. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-xl font-semibold text-navy-900 mb-2 font-sans">Registration submitted</h1>
          <p className="text-slate-500 text-sm mb-6">
            Your request is pending admin approval. You'll receive an email once it's reviewed.
          </p>
          <Link to="/login" className="text-navy-500 hover:underline text-sm">
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-xl font-semibold text-navy-900 mb-6 font-sans">Request access</h1>

        {serverError && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">{serverError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input id="name" label="Full name" error={errors.name?.message} {...register('name')} />

          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="username"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="employeeId"
            label="Employee ID"
            error={errors.employeeId?.message}
            {...register('employeeId')}
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="departmentPreference" className="text-sm font-medium text-slate-900">
              Department
            </label>
            <select
              id="departmentPreference"
              className="px-3 py-2 rounded-md border border-slate-100 text-sm outline-none focus:border-navy-500"
              {...register('departmentPreference')}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.departmentPreference && (
              <span className="text-xs text-red-600">{errors.departmentPreference.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="reasonForAccess" className="text-sm font-medium text-slate-900">
              Reason for access
            </label>
            <textarea
              id="reasonForAccess"
              rows={3}
              className="px-3 py-2 rounded-md border border-slate-100 text-sm outline-none focus:border-navy-500 resize-none"
              {...register('reasonForAccess')}
            />
            {errors.reasonForAccess && (
              <span className="text-xs text-red-600">{errors.reasonForAccess.message}</span>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit request'}
          </Button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-navy-500 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}