import {Redis} from 'ioredis'
import { env } from './env.js'

export const redis = new Redis(env.REDIS_URL)  //for the client purpose separation of redis is done
export const redisPub = new Redis(env.REDIS_URL) // for publishing purpose
export const redisSub = new Redis(env.REDIS_URL)  // for subscribing purpose

redis.on('error', (err) => console.error('Redis client error:', err))
redisPub.on('error', (err) => console.error('Redis publisher error:', err))
redisSub.on('error', (err) => console.error('Redis subscriber error:', err))