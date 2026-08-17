import { useState } from 'react'

import { PreviewRefreshProvider } from '../context/PreviewRefreshContext'
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
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-text-primary">
          CMS Editor
        </h1>

        <div className="grid h-[calc(100vh-180px)] grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Editor */}
          <div className="space-y-4 overflow-auto">
            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto border-b border-border-subtle">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      shrink-0
                      border-b-2
                      px-4 py-2
                      text-sm
                      transition-colors
                      ${
                        isActive
                          ? 'border-accent text-accent-light'
                          : 'border-transparent text-text-secondary hover:text-text-primary'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Active tab */}
            <ActiveComponent />
          </div>

          {/* Live preview */}
          <LivePreviewPanel />
        </div>
      </div>
    </PreviewRefreshProvider>
  )
}