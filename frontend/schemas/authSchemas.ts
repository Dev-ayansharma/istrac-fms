import { z } from 'zod'



export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(10, 'Password must be at least 10 characters long').refine(
    (password) => /[A-Z]/.test(password),
    { message: 'Password must contain at least one uppercase letter' }
  ).refine(
    (password) => /[a-z]/.test(password),
    { message: 'Password must contain at least one lowercase letter' }
  ).refine(
    (password) => /[0-9]/.test(password),
    { message: 'Password must contain at least one number' }
  ).refine(
    (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    { message: 'Password must contain at least one special character' }
  )
  
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