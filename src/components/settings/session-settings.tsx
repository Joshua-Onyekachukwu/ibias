'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock, Shield, Users, AlertTriangle } from 'lucide-react'
import { getSessionConfig } from '@/config/session'
import type { SessionConfig } from '@/config/session'

interface SessionSettingsProps {
  onConfigChange?: (config: SessionConfig) => void
}

export function SessionSettings({ onConfigChange }: SessionSettingsProps) {
  const [config, setConfig] = useState<SessionConfig>(getSessionConfig())
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setConfig(getSessionConfig())
  }, [])

  const handleConfigChange = (key: keyof SessionConfig, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    setHasChanges(true)
    onConfigChange?.(newConfig)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // In a real implementation, you would save to user preferences or environment
      // For now, we'll just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000))
      setHasChanges(false)
    } catch (error) {
      console.error('Failed to save session settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setConfig(getSessionConfig())
    setHasChanges(false)
  }

  const getInactivityLabel = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    return `${hours}h ${remainingMinutes}m`
  }

  const getSessionDurationLabel = (hours: number) => {
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    if (remainingHours === 0) return `${days} day${days > 1 ? 's' : ''}`
    return `${days}d ${remainingHours}h`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session Timeout Settings
          </CardTitle>
          <CardDescription>
            Configure how long you can remain inactive before being automatically logged out
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="inactivity-timeout">Inactivity Timeout</Label>
            <Select
              value={config.maxInactiveMinutes.toString()}
              onValueChange={(value) => handleConfigChange('maxInactiveMinutes', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes (High Security)</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours (Recommended)</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
                <SelectItem value="480">8 hours (Development)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              You'll be logged out after {getInactivityLabel(config.maxInactiveMinutes)} of inactivity
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-duration">Maximum Session Duration</Label>
            <Select
              value={config.maxSessionHours.toString()}
              onValueChange={(value) => handleConfigChange('maxSessionHours', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 hours (High Security)</SelectItem>
                <SelectItem value="8">8 hours (Work Day)</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">24 hours (Recommended)</SelectItem>
                <SelectItem value="48">48 hours</SelectItem>
                <SelectItem value="72">72 hours (Development)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Sessions will expire after {getSessionDurationLabel(config.maxSessionHours)} regardless of activity
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="check-interval">Session Check Frequency</Label>
            <Select
              value={config.sessionCheckIntervalMinutes.toString()}
              onValueChange={(value) => handleConfigChange('sessionCheckIntervalMinutes', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Every minute (High Security)</SelectItem>
                <SelectItem value="2">Every 2 minutes</SelectItem>
                <SelectItem value="5">Every 5 minutes (Recommended)</SelectItem>
                <SelectItem value="10">Every 10 minutes</SelectItem>
                <SelectItem value="15">Every 15 minutes</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How often to check if your session is still valid
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Concurrent Sessions
          </CardTitle>
          <CardDescription>
            Manage how many devices you can be logged in from simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="concurrent-sessions">Maximum Concurrent Sessions</Label>
            <Select
              value={config.maxConcurrentSessions.toString()}
              onValueChange={(value) => handleConfigChange('maxConcurrentSessions', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 session (Highest Security)</SelectItem>
                <SelectItem value="3">3 sessions</SelectItem>
                <SelectItem value="5">5 sessions</SelectItem>
                <SelectItem value="10">10 sessions (Recommended)</SelectItem>
                <SelectItem value="15">15 sessions</SelectItem>
                <SelectItem value="20">20 sessions (Development)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              You can be logged in from up to {config.maxConcurrentSessions} devices at once
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Advanced security and error handling options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Graceful Error Handling</Label>
              <p className="text-sm text-muted-foreground">
                Continue sessions even when database errors occur
              </p>
            </div>
            <Switch
              checked={config.enableGracefulErrorHandling}
              onCheckedChange={(checked) => handleConfigChange('enableGracefulErrorHandling', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require MFA for Admin</Label>
              <p className="text-sm text-muted-foreground">
                Require multi-factor authentication for admin users
              </p>
            </div>
            <Switch
              checked={config.requireMFAForAdmin}
              onCheckedChange={(checked) => handleConfigChange('requireMFAForAdmin', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {config.maxInactiveMinutes < 30 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>High Security Mode:</strong> Short inactivity timeouts may interrupt your workflow. 
            Consider using 30 minutes or more for better user experience.
          </AlertDescription>
        </Alert>
      )}

      {config.maxSessionHours > 48 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Extended Sessions:</strong> Long session durations may pose security risks. 
            Consider using 24 hours or less for production environments.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || saving}
          className="flex-1"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={!hasChanges || saving}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}