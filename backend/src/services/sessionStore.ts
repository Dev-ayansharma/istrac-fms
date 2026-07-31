import { redis } from '../config/redis.js'

const SESSION_PREFIX = 'session:'
const BLACKLIST_PREFIX = 'blacklist:'

export const sessionStore = {
  // Store an active refresh token session, TTL matches token expiry (7 days)
  async set(userId: string, tokenId: string, ttlSeconds = 60 * 60 * 24 * 7) {
    await redis.set(`${SESSION_PREFIX}${tokenId}`, userId, 'EX', ttlSeconds)
  },

  // Fast lookup — is this token ID a valid active session?
  async get(tokenId: string): Promise<string | null> {
    return redis.get(`${SESSION_PREFIX}${tokenId}`)
  },

  // Force-logout (Ch. 5.3) — admin invalidates instantly
  async revoke(tokenId: string) {
    await redis.del(`${SESSION_PREFIX}${tokenId}`)
    await redis.set(`${BLACKLIST_PREFIX}${tokenId}`, '1', 'EX', 60 * 60 * 24 * 7)
  },

  async isBlacklisted(tokenId: string): Promise<boolean> {
    const result = await redis.get(`${BLACKLIST_PREFIX}${tokenId}`)
    return result !== null
  },
}