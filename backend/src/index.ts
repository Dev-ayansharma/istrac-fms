import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { corsOptions } from './config/cors.js'
import { prisma } from './config/db.js'
const app = express()
app.use(cors(corsOptions))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const server = app.listen(env.PORT, () => {
  console.log(`Backend running on port ${env.PORT}`)
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