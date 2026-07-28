import type { CorsOptions } from 'cors'
import { env } from './env.js'

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {

    if (!origin) return callback(null, true)

    if (env.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked: ${origin} is not an allowed origin`))
    }
  },
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}