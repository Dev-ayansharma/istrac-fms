import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/axios'
import { wsClient } from '../lib/ws'
import { type CmsBlock } from '../types/cms'

interface CmsContextValue {
  cmsBlocks: Record<string, Record<string, unknown>>
  isLoading: boolean
}

const CmsContext = createContext<CmsContextValue>({ cmsBlocks: {}, isLoading: true })

export function CmsProvider({ children }: { children: ReactNode }) {
  const [cmsBlocks, setCmsBlocks] = useState<Record<string, Record<string, unknown>>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .get<CmsBlock[]>('/cms')
      .then(({ data }) => {
        const blocksByKey = Object.fromEntries(data.map((b) => [b.blockKey, b.content]))
        setCmsBlocks(blocksByKey)
      })
      .finally(() => setIsLoading(false))

    wsClient.connect()

    // Backend publishes on the 'cms' channel (DB-005 pub/sub) whenever an admin saves a CMS block
    const unsubscribe = wsClient.subscribe('cms', (_channel, payload) => {
      const update = payload as { blockKey: string; content: Record<string, unknown> }
      setCmsBlocks((prev) => ({ ...prev, [update.blockKey]: update.content }))
    })

    return () => {
      unsubscribe()
      wsClient.disconnect()
    }
  }, [])

  return <CmsContext.Provider value={{ cmsBlocks, isLoading }}>{children}</CmsContext.Provider>
}

export function useCms() {
  return useContext(CmsContext)
}