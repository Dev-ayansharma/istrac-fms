import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { corsOptions } from './config/cors.js'
import { prisma } from './config/db.js'
import { redis } from './config/redis.js'
import { pubsub } from './lib/pubsub.js'

const app = express()
app.use(cors(corsOptions))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'okok' })
})

app.get('/health/redis', async (_req, res) => {
  try {
    await redis.set('healthcheck', 'ok', 'EX', 10)
    const value = await redis.get('healthcheck')
    res.json({ status: 'ok', redis: value })
  } catch (err) {
    res.status(503).json({ status: 'error', message: 'Redis unreachable' })
  }
})

const server = app.listen(env.PORT, () => {
  console.log(`Backend running on port ${env.PORT}`)
  console.log(`Environment: ${env.NODE_ENV}`)
 
})

async function shutdown() {
  console.log('Shutting down server...')  
  server.close(() => {
    
    console.log('Server closed.')
    prisma.$disconnect()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)