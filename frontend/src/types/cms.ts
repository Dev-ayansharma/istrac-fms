export interface CmsBlock {
  blockKey: string
  content: Record<string, unknown>
}

export interface HeroContent {
  title: string
  subtitle: string
  ctaText: string
}