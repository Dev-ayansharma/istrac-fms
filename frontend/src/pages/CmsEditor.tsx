import { useState } from 'react'

import { PreviewRefreshProvider } from '../context/PreviewRefreshContext'
import { PageHeader } from '../components'
import { LivePreviewPanel } from '../components/LivePreviewPanel'
import { HeroTab } from '../components/cms-editor/HeroTab'
import { AnnouncementTab } from '../components/cms-editor/AnnouncementTab'
import { GalleryTab } from '../components/cms-editor/GalleryTab'
import { BannerTab } from '../components/cms-editor/BannerTab'
import { InfoTab } from '../components/cms-editor/InfoTab'

const TABS = [
  {
    key: 'hero',
    label: 'Hero',
    component: HeroTab,
  },
  {
    key: 'announcements',
    label: 'Announcement',
    component: AnnouncementTab,
  },
  {
    key: 'gallery',
    label: 'Gallery',
    component: GalleryTab,
  },
  {
    key: 'banner',
    label: 'Banner',
    component: BannerTab,
  },
  {
    key: 'info',
    label: 'Info',
    component: InfoTab,
  },
] as const

export function CmsEditor() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]['key']>('hero')

  const ActiveComponent =
    TABS.find((tab) => tab.key === activeTab)?.component ?? HeroTab

  return (
    <PreviewRefreshProvider>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Administration"
          title="Landing page"
          description="Edit the public page block by block. The preview reloads each time you save."
        />

        {/* Block rail */}
        <div className="flex gap-1 overflow-x-auto border-b border-border-subtle">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-pressed={isActive}
                className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors duration-150 ${
                  isActive
                    ? 'border-b-accent text-accent-light'
                    : 'border-b-transparent text-text-dim hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:h-[calc(100vh-19rem)] lg:grid-cols-2">
          {/* Editor */}
          <div className="min-w-0 lg:overflow-y-auto lg:pr-1">
            <ActiveComponent />
          </div>

          {/* Live preview */}
          <LivePreviewPanel />
        </div>
      </div>
    </PreviewRefreshProvider>
  )
}
