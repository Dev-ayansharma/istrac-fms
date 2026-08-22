import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/axios'
import { useAuthStore } from '../store/authStore'
import { Button, Input } from '../components'
import { PasswordStrengthMeter, isPasswordValid } from '../components/PasswordStrengthMeter'
import { newPasswordSchema } from '../../schemas/authSchemas'

export function ForcePasswordChange() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setAuth = useAuthStore((s) => s.setAuth)
  const accessToken = useAuthStore((s) => s.accessToken)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(newPasswordSchema),
  })
  const watchedPassword = watch('newPassword') || ''

  async function onSubmit(data: { newPassword: string }) {
    await api.post('/auth/change-password', { newPassword: data.newPassword })
    // Clears temp_pass server-side; refresh local user state to match
    if (user && accessToken) setAuth({ ...user, tempPass: false }, accessToken)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-page">
      <div className="w-full max-w-sm bg-card border border-border-subtle rounded-lg shadow-xl p-8">
        <h1 className="text-xl font-semibold text-text-primary mb-2 font-sans">Set a permanent password</h1>
        <p className="text-text-secondary text-sm mb-6">
          You're using a temporary password. Set a new one to continue.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input id="newPassword" label="New password" type="password" error={errors.newPassword?.message as string} {...register('newPassword')} />
          <PasswordStrengthMeter password={watchedPassword} />
          <Input id="confirmPassword" label="Confirm password" type="password" error={errors.confirmPassword?.message as string} {...register('confirmPassword')} />
          <Button type="submit" variant="primary" className="w-full" disabled={!isPasswordValid(watchedPassword) || isSubmitting}>
            Set password
          </Button>
        </form>
      </div>
    </div>
  )
}