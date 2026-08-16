import { useSystemConfig } from '../hooks/useSystemConfig'
import { Card } from '../components'
import { ConfigField } from '../components/ConfigField'
import { ConfigToggle } from '../components/ConfigToggle'

export function SystemConfigPanel() {
  const { data: config, isLoading } = useSystemConfig()

  if (isLoading || !config) return <p className="text-text-muted">Loading...</p>

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold text-text-primary">System Configuration</h1>

      <Card>
        <h2 className="text-sm font-medium text-text-secondary mb-3">Upload Limits</h2>
        <div className="space-y-3">
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
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-text-secondary mb-3">Security</h2>
        <div className="space-y-3">
          <ConfigToggle
            settingKey="virusScanEnabled"
            label="Enable virus scan on upload"
            checked={config.virusScanEnabled}
            helpText="Requires a configured ClamAV or equivalent scan hook (Ch.7.2)"
          />
          <ConfigField
            settingKey="downloadRateLimitPerHour"
            label="Download rate limit (per user, per hour)"
            type="number"
            value={String(config.downloadRateLimitPerHour)}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-text-secondary mb-3">Email / Access</h2>
        <div className="space-y-3">
          <ConfigField
            settingKey="guestAccessExpiryDays"
            label="Default guest access expiry (days)"
            type="number"
            value={String(config.guestAccessExpiryDays)}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-text-secondary mb-3">HDD Sync</h2>
        <div className="space-y-3">
          <ConfigField
            settingKey="hddSyncIntervalMinutes"
            label="Sync interval (minutes)"
            type="number"
            value={String(config.hddSyncIntervalMinutes)}
            helpText="Default: 15, per architecture doc Ch.6.2"
          />
        </div>
      </Card>
    </div>
  )
}