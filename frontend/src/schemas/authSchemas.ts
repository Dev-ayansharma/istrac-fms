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

export type LoginFormData = z.infer<typeof loginSchema>