import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.email('Enter a valid email address'),
})

export const otpSchema = z.object({
  otp: z.string().length(6, 'Enter the 6-digit code'),
})

export const newPasswordSchema = z
  .object({
    newPassword: z.string().min(10),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(10, 'Password must be at least 10 characters long')
  
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.email('Enter a valid email address'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  departmentPreference: z.string().min(1, 'Select a department'),
  reasonForAccess: z.string().min(10, 'Please provide at least a brief reason (10+ characters)'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>