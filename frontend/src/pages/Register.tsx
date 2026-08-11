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
<div className="min-h-screen flex items-center justify-center bg-page">
  <div className="w-full max-w-sm bg-card border border-border-subtle rounded-lg shadow-xl p-8 text-center">
    <h1 className="text-xl font-semibold text-text-primary mb-2 font-sans">Registration submitted</h1>
    <p className="text-text-secondary text-sm mb-6">
      Your request is pending admin approval. You'll receive an email once it's reviewed.
    </p>
    <Link to="/login" className="text-accent-light hover:underline text-sm">
      Back to login
    </Link>
  </div>
</div>
    )
  }

  return (
  // Form state — wrapper + select/textarea updated
<div className="min-h-screen flex items-center justify-center bg-page">
  <div className="w-full max-w-sm bg-card border border-border-subtle rounded-lg shadow-xl p-8">
    <h1 className="text-xl font-semibold text-text-primary mb-6 font-sans">Request access</h1>

    {serverError && (
      <div className="mb-4 p-3 rounded-md bg-critical-bg text-critical text-sm">{serverError}</div>
    )}

    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input id="name" label="Full name" error={errors.name?.message} {...register('name')} />
      <Input id="email" label="Email" type="email" autoComplete="username" error={errors.email?.message} {...register('email')} />
      <Input id="employeeId" label="Employee ID" error={errors.employeeId?.message} {...register('employeeId')} />

      <div className="flex flex-col gap-1">
        <label htmlFor="departmentPreference" className="text-sm font-medium text-text-secondary">
          Department
        </label>
        <select
          id="departmentPreference"
          className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm outline-none focus:border-accent"
          {...register('departmentPreference')}
        >
          <option value="">Select a department</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        {errors.departmentPreference && <span className="text-xs text-critical">{errors.departmentPreference.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reasonForAccess" className="text-sm font-medium text-text-secondary">
          Reason for access
        </label>
        <textarea
          id="reasonForAccess"
          rows={3}
          className="px-3 py-2 rounded-md bg-surface border border-border-default text-text-primary text-sm outline-none focus:border-accent resize-none"
          {...register('reasonForAccess')}
        />
        {errors.reasonForAccess && <span className="text-xs text-critical">{errors.reasonForAccess.message}</span>}
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit request'}
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-light hover:underline">Sign in</Link>
      </p>
    </form>
  </div>
</div>
  )
}