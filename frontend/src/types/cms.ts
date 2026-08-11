export interface CmsBlock {
  blockKey: string
  content: Record<string, unknown>
}

export interface HeroContent {
  title: string
  subtitle: string
  ctaText: string
}

export interface AnnouncementContent {
  visible: boolean
  text: string
  backgroundColor?: string // e.g. "orange" | "red" | "navy" — admin-selectable
}