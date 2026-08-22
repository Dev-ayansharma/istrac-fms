import { useSystemConfig } from '../hooks/useSystemConfig'

import { PageHeader, Panel } from '../components'
import { ConfigField } from '../components/ConfigField'
import { ConfigToggle } from '../components/ConfigToggle'

export function SystemConfigPanel() {
  const { data: config, isLoading } = useSystemConfig()

  if (isLoading || !config) {
    return (
      <div className="max-w-3xl space-y-6">
        <PageHeader
          eyebrow="Administration"
          title="System configuration"
          description="System-wide upload, security, access, and synchronisation settings."
        />

        <Panel title="Settings">
          <p className="num text-[11px] text-text-dim">Loading…</p>
        </Panel>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="System configuration"
        description="System-wide upload, security, access, and synchronisation settings."
      />

      {/* Upload Limits */}
      <Panel title="Upload limits" meta="2 keys">
        <p className="text-[12px] leading-5 text-text-dim">
          Restrictions applied to every file entering the archive.
        </p>

        <div className="mt-5 space-y-5">
          <ConfigField
            settingKey="maxUploadSizeBytes"
            label="Max upload size (bytes)"
            type="number"
            value={String(config.maxUploadSizeBytes)}
            helpText="Default: 524288000 (500 MB)"
          />

          <ConfigField
            settingKey="allowedExtensions"
            label="Allowed extensions (comma-separated)"
            value={config.allowedExtensions.join(',')}
          />
        </div>
      </Panel>

      {/* Security */}
      <Panel title="Security" meta="2 keys">
        <p className="text-[12px] leading-5 text-text-dim">
          Scanning and download protection.
        </p>

        <div className="mt-5 space-y-5">
          <ConfigToggle
            settingKey="virusScanEnabled"
            label="Enable virus scan on upload"
            checked={config.virusScanEnabled}
            helpText="Requires a configured ClamAV or equivalent scan hook."
          />

          <ConfigField
            settingKey="downloadRateLimitPerHour"
            label="Download rate limit (per user, per hour)"
            type="number"
            value={String(config.downloadRateLimitPerHour)}
          />
        </div>
      </Panel>

      {/* Email / Access */}
      <Panel title="Email / access" meta="1 key">
        <p className="text-[12px] leading-5 text-text-dim">
          How long a guest link stays usable.
        </p>

        <div className="mt-5">
          <ConfigField
            settingKey="guestAccessExpiryDays"
            label="Default guest access expiry (days)"
            type="number"
            value={String(config.guestAccessExpiryDays)}
          />
        </div>
      </Panel>

      {/* HDD Sync */}
      <Panel title="HDD sync" meta="1 key">
        <p className="text-[12px] leading-5 text-text-dim">
          How often the archive is reconciled against disk.
        </p>

        <div className="mt-5">
          <ConfigField
            settingKey="hddSyncIntervalMinutes"
            label="Sync interval (minutes)"
            type="number"
            value={String(config.hddSyncIntervalMinutes)}
            helpText="Default: 15 minutes."
          />
        </div>
      </Panel>
    </div>
  )
}
