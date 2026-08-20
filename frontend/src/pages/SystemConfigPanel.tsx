import { useSystemConfig } from '../hooks/useSystemConfig'

import { Card } from '../components'
import { ConfigField } from '../components/ConfigField'
import { ConfigToggle } from '../components/ConfigToggle'
import { systemConfigFixture } from '../mocks/Fixtures'
export function SystemConfigPanel() {
  const { data: config, isLoading } = useSystemConfig()
const displayConfig = config ?? systemConfigFixture
  if (isLoading || !config) {
    return (
      <p className="text-sm text-text-muted">
        Loading...
      </p>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          System Configuration
        </h1>

        <p className="mt-1 text-sm text-text-muted">
          Manage system-wide upload, security, access, and synchronization settings.
        </p>
      </div>

      {/* Upload Limits */}
      <Card>
        <div className="mb-4 border-b border-border-subtle pb-3">
          <h2 className="text-sm font-semibold text-text-primary">
            Upload Limits
          </h2>

          <p className="mt-1 text-xs text-text-muted">
            Configure file upload restrictions.
          </p>
        </div>

        <div className="space-y-4">
          <ConfigField
            settingKey="maxUploadSizeBytes"
            label="Max upload size (bytes)"
            type="number"
            value={String(displayConfig.maxUploadSizeBytes)}
            helpText="Default: 524288000 (500 MB)"
          />

          <ConfigField
            settingKey="allowedExtensions"
            label="Allowed extensions (comma-separated)"
            value={displayConfig.allowedExtensions.join(',')}
          />
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="mb-4 border-b border-border-subtle pb-3">
          <h2 className="text-sm font-semibold text-text-primary">
            Security
          </h2>

          <p className="mt-1 text-xs text-text-muted">
            Configure security and download protection settings.
          </p>
        </div>

        <div className="space-y-4">
          <ConfigToggle
            settingKey="virusScanEnabled"
            label="Enable virus scan on upload"
            checked={displayConfig.virusScanEnabled}
            helpText="Requires a configured ClamAV or equivalent scan hook."
          />

          <ConfigField
            settingKey="downloadRateLimitPerHour"
            label="Download rate limit (per user, per hour)"
            type="number"
            value={String(displayConfig.downloadRateLimitPerHour)}
          />
        </div>
      </Card>

      {/* Email / Access */}
      <Card>
        <div className="mb-4 border-b border-border-subtle pb-3">
          <h2 className="text-sm font-semibold text-text-primary">
            Email / Access
          </h2>

          <p className="mt-1 text-xs text-text-muted">
            Configure guest access and expiration settings.
          </p>
        </div>

        <div className="space-y-4">
          <ConfigField
            settingKey="guestAccessExpiryDays"
            label="Default guest access expiry (days)"
            type="number"
            value={String(displayConfig.guestAccessExpiryDays)}
          />
        </div>
      </Card>

      {/* HDD Sync */}
      <Card>
        <div className="mb-4 border-b border-border-subtle pb-3">
          <h2 className="text-sm font-semibold text-text-primary">
            HDD Sync
          </h2>

          <p className="mt-1 text-xs text-text-muted">
            Configure synchronization frequency.
          </p>
        </div>

        <div className="space-y-4">
          <ConfigField
            settingKey="hddSyncIntervalMinutes"
            label="Sync interval (minutes)"
            type="number"
            value={String(displayConfig.hddSyncIntervalMinutes)}
            helpText="Default: 15 minutes."
          />
        </div>
      </Card>
    </div>
  )
}