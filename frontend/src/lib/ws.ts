import { useAuthStore } from '../store/authStore'

type MessageHandler = (channel: string, payload: unknown) => void

class WSClient {
  private socket: WebSocket | null = null
  private handlers = new Map<string, MessageHandler[]>()
  private reconnectAttempt = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null

  connect() {
    const token = useAuthStore.getState().accessToken
    const wsUrl = `${import.meta.env.VITE_WS_URL}?token=${token ?? ''}`

    this.socket = new WebSocket(wsUrl)

    this.socket.onopen = () => {
      this.reconnectAttempt = 0
      this.startHeartbeat()
    }

    this.socket.onmessage = (event) => {
      try {
        const { channel, payload } = JSON.parse(event.data)
        const channelHandlers = this.handlers.get(channel) || []
        channelHandlers.forEach((h) => h(channel, payload))
      } catch {
        // ignore malformed messages
      }
    }

    this.socket.onclose = (event) => {
      this.stopHeartbeat()
      // Per Ch.12.4: code 4401 = server rejected an invalid/expired token — don't spam-retry
      if (event.code !== 4401) {
        this.scheduleReconnect()
      }
    }
  }

  private scheduleReconnect() {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, then once per minute — matches Ch.12.4
    const delays = [1000, 2000, 4000, 8000, 16000]
    const delay = delays[this.reconnectAttempt] ?? 60000
    this.reconnectAttempt++

    this.reconnectTimer = setTimeout(() => this.connect(), delay)
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.socket?.send(JSON.stringify({ type: 'ping' }))
    }, 30000)
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer)
  }

  subscribe(channel: string, handler: MessageHandler) {
    if (!this.handlers.has(channel)) this.handlers.set(channel, [])
    this.handlers.get(channel)!.push(handler)

    return () => {
      const list = this.handlers.get(channel) || []
      this.handlers.set(channel, list.filter((h) => h !== handler))
    }
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.stopHeartbeat()
    this.socket?.close()
  }
}

export const wsClient = new WSClient()