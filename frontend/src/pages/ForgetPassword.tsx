import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { AxiosError } from 'axios'
import { api } from '../lib/axios'
import { Alert, AuthCard, AuthFrame, Button, Input } from '../components'
import { PasswordStrengthMeter, isPasswordValid } from '../components/PasswordStrengthMeter'
import { forgotPasswordSchema, otpSchema, newPasswordSchema } from '../../schemas/authSchemas'

type Step = 'email' | 'otp' | 'newPassword' | 'done'

/** Presentational only — a hairline rail showing how far through the reset you are. */
const STEP_ORDER: Step[] = ['email', 'otp', 'newPassword']

function StepRail({ step }: { step: Step }) {
  const index = STEP_ORDER.indexOf(step)
  if (index === -1) return null

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <span className="col-label">Password reset</span>
        <span className="num text-[10px] text-text-dim">
          STEP {String(index + 1).padStart(2, '0')} / {String(STEP_ORDER.length).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-2.5 flex gap-1" aria-hidden="true">
        {STEP_ORDER.map((_, i) => (
          <span
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= index ? 'bg-accent' : 'bg-border-subtle'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

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
    <AuthFrame
      actions={
        <Link to="/login">
          <Button variant="outline" size="sm">
            Log in
          </Button>
        </Link>
      }
    >
      {step === 'email' && (
        <AuthCard
          eyebrow="Account recovery"
          status="STEP 1 OF 3"
          title="Reset your password"
          description="Enter your email and we'll send a code if an account exists."
        >
          <StepRail step={step} />

          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="username"
              error={emailForm.formState.errors.email?.message as string}
              {...emailForm.register('email')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={emailForm.formState.isSubmitting}
            >
              Send code
            </Button>
          </form>
        </AuthCard>
      )}

      {step === 'otp' && (
        <AuthCard
          eyebrow="Account recovery"
          status="STEP 2 OF 3"
          title="Enter the code"
          description={`If ${email} is registered, a 6-digit code was sent to it.`}
        >
          <StepRail step={step} />

          {otpError && (
            <Alert variant="critical" title="Code rejected" className="mb-5">
              {otpError}
            </Alert>
          )}

          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
            <Input
              id="otp"
              label="6-digit code"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              onPaste={handleOtpPaste}
              hint="Pasting is disabled — type the code in."
              error={otpForm.formState.errors.otp?.message as string}
              className="num text-center text-lg tracking-[0.4em]"
              {...otpForm.register('otp')}
            />

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Verify
            </Button>
          </form>
        </AuthCard>
      )}

      {step === 'newPassword' && (
        <AuthCard
          eyebrow="Account recovery"
          status="STEP 3 OF 3"
          title="Set a new password"
          description="Choose something you haven't used on this account before."
        >
          <StepRail step={step} />

          <form onSubmit={pwForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              id="newPassword"
              label="New password"
              type="password"
              autoComplete="new-password"
              error={pwForm.formState.errors.newPassword?.message as string}
              {...pwForm.register('newPassword')}
            />

            <PasswordStrengthMeter password={watchedPassword} />

            <Input
              id="confirmPassword"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              error={pwForm.formState.errors.confirmPassword?.message as string}
              {...pwForm.register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!isPasswordValid(watchedPassword) || pwForm.formState.isSubmitting}
            >
              Reset password
            </Button>
          </form>
        </AuthCard>
      )}

      {step === 'done' && (
        <AuthCard
          eyebrow="Complete"
          status="PASSWORD SET"
          tone="nominal"
          title="Password updated"
          description="You can now sign in with your new password."
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Back to log in
          </Button>
        </AuthCard>
      )}
    </AuthFrame>
  )
}
