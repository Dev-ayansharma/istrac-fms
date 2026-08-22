import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate} from 'react-router-dom'
import { AxiosError } from 'axios'
import { api } from '../lib/axios'
import { Button, Input } from '../components'
import { PasswordStrengthMeter, isPasswordValid } from '../components/PasswordStrengthMeter'
import { forgotPasswordSchema, otpSchema, newPasswordSchema } from '../../schemas/authSchemas'

type Step = 'email' | 'otp' | 'newPassword' | 'done'

export function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState<string | null>(null)

  // ---- Step 1: email ----
  const emailForm = useForm({ resolver: zodResolver(forgotPasswordSchema) })
  async function onEmailSubmit(data: { email: string }) {
    // Deliberately no error shown even if the email doesn't exist — Ch.5.5:
    // prevents user enumeration. Same success message either way.
    await api.post('/auth/forgot-password', data).catch(() => {})
    setEmail(data.email)
    setStep('otp')
  }

  // ---- Step 2: OTP ----
  const otpForm = useForm({ resolver: zodResolver(otpSchema) })
  function handleOtpPaste(e: React.ClipboardEvent) {
    // Ch.5.5-adjacent UX requirement from tracker: "OTP field blocks paste"
    e.preventDefault()
  }
  async function onOtpSubmit(data: { otp: string }) {
    setOtpError(null)
    try {
      // Verifying the OTP is real happens together with the actual reset call in step 3 —
      // here we just hold it locally and move forward; backend validates on final submit.
      setOtp(data.otp)
      setStep('newPassword')
    } catch {
      setOtpError('Invalid or expired code')
    }
  }

  // ---- Step 3: new password ----
  const pwForm = useForm({ resolver: zodResolver(newPasswordSchema) })
  const watchedPassword = pwForm.watch('newPassword') || ''
  async function onPasswordSubmit(data: { newPassword: string; confirmPassword: string }) {
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword: data.newPassword })
      setStep('done')
    } catch (err) {
      const error = err as AxiosError<{ error: { message: string } }>
      otpForm.setError('root', { message: error.response?.data?.error?.message ?? 'Reset failed' })
      setStep('otp') // wrong/expired OTP surfaces back at the OTP step
      setOtpError('Code expired or invalid — request a new one')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-page">
      <div className="w-full max-w-sm bg-card border border-border-subtle rounded-lg shadow-xl p-8">
        {step === 'email' && (
          <>
            <h1 className="text-xl font-semibold text-text-primary mb-2 font-sans">Reset your password</h1>
            <p className="text-text-secondary text-sm mb-6">
              Enter your email and we'll send a code if an account exists.
            </p>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <Input
                id="email"
                label="Email"
                type="email"
                error={emailForm.formState.errors.email?.message as string}
                {...emailForm.register('email')}
              />
              <Button type="submit" variant="primary" className="w-full" disabled={emailForm.formState.isSubmitting}>
                Send code
              </Button>
            </form>
          </>
        )}

        {step === 'otp' && (
          <>
            <h1 className="text-xl font-semibold text-text-primary mb-2 font-sans">Enter the code</h1>
            <p className="text-text-secondary text-sm mb-6">
              If {email} is registered, a 6-digit code was sent to it.
            </p>
            {otpError && <div className="mb-4 p-3 rounded-md bg-critical-bg text-critical text-sm">{otpError}</div>}
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
              <Input
                id="otp"
                label="6-digit code"
                inputMode="numeric"
                maxLength={6}
                onPaste={handleOtpPaste}
                error={otpForm.formState.errors.otp?.message as string}
                {...otpForm.register('otp')}
              />
              <Button type="submit" variant="primary" className="w-full">
                Verify
              </Button>
            </form>
          </>
        )}

        {step === 'newPassword' && (
          <>
            <h1 className="text-xl font-semibold text-text-primary mb-6 font-sans">Set a new password</h1>
            <form onSubmit={pwForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <Input
                id="newPassword"
                label="New password"
                type="password"
                error={pwForm.formState.errors.newPassword?.message as string}
                {...pwForm.register('newPassword')}
              />
              <PasswordStrengthMeter password={watchedPassword} />
              <Input
                id="confirmPassword"
                label="Confirm password"
                type="password"
                error={pwForm.formState.errors.confirmPassword?.message as string}
                {...pwForm.register('confirmPassword')}
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={!isPasswordValid(watchedPassword) || pwForm.formState.isSubmitting}
              >
                Reset password
              </Button>
            </form>
          </>
        )}

        {step === 'done' && (
          <div className="text-center">
            <h1 className="text-xl font-semibold text-text-primary mb-2 font-sans">Password updated</h1>
            <p className="text-text-secondary text-sm mb-6">You can now sign in with your new password.</p>
            <Button variant="primary" className="w-full" onClick={() => navigate('/login')}>
              Back to login
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}