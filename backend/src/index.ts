import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { corsOptions } from './config/cors.js'
const app = express()
app.use(cors(corsOptions))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(env.PORT, () => {
  console.log(`Backend running on port ${env.PORT}`)
})