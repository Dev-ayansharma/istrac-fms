import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/axios'
import { useAuthStore } from '../store/authStore'
import { AuthCard, AuthFrame, Button, Input } from '../components'
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
    <AuthFrame>
      <AuthCard
        eyebrow="Action required"
        status="TEMPORARY PASSWORD"
        title="Set a permanent password"
        description="You're signed in with a temporary password. Set a new one to continue."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="newPassword"
            label="New password"
            type="password"
            autoComplete="new-password"
            error={errors.newPassword?.message as string}
            {...register('newPassword')}
          />

          <PasswordStrengthMeter password={watchedPassword} />

          <Input
            id="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message as string}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!isPasswordValid(watchedPassword) || isSubmitting}
          >
            Set password
          </Button>
        </form>
      </AuthCard>
    </AuthFrame>
  )
}
