import { redisPub, redisSub } from '../config/redis.js'

type Handler = (message: string) => void
const handlers = new Map<string, Handler[]>()

export const pubsub = {
  async publish(channel: string, message: object) {
    await redisPub.publish(channel, JSON.stringify(message))
  },

  subscribe(channel: string, handler: Handler) {
    if (!handlers.has(channel)) {
      handlers.set(channel, [])
      redisSub.subscribe(channel)
    }
    handlers.get(channel)!.push(handler)
  },
}

redisSub.on('message', (channel, message) => {
  const channelHandlers = handlers.get(channel) || []
  channelHandlers.forEach((h) => h(message))
})