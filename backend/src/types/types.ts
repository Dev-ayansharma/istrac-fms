export interface EnvConfig {
  DATABASE_URL: string
  REDIS_URL: string
  JWT_SECRET: string
  JWT_REFRESH_SECRET: string
  HDD_MOUNT_PATH: string
  PORT: number
  NODE_ENV: 'development' | 'production' | 'test'
  ALLOWED_ORIGINS: string[]
}