import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { EnvConfig } from '../types/types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

function required(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required env var: ${key}. Check your .env file against .env.example.`)
  }
  return value
}

export const env: EnvConfig = {
  DATABASE_URL: required('DATABASE_URL'),
  REDIS_URL: required('REDIS_URL'),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),
  HDD_MOUNT_PATH: required('HDD_MOUNT_PATH'),
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173']
 
}