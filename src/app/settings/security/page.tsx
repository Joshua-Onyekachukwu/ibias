'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Key, 
  Monitor, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Smartphone,
  RefreshCw,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import MFASettings from '@/components/auth/mfa-settings'

interface SecurityEvent {
  id: string
  event_type: string
  description: string
  ip_address: string
  user_agent: string
  created_at: string
}

interface ActiveSession {
  id: string
  device_info: {
    browser?: string
    os?: string
    device?: string
  }
  ip_address: string
  last_activity: string
  is_current: boolean
  location?: string
}

export default function SecuritySettingsPage() {
  const { user, signOut } = useAuth()
  const [showMFA, setShowMFA] = useState(false)
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [autoLogout, setAutoLogout] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)

  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API calls
      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          event_type: 'login_success',
          description: 'Successful login',
          ip_address: '192.168.1.100',
          user_agent: 'Chrome 120.0.0.0',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          event_type: 'password_change',
          description: 'Password changed',
          ip_address: '192.168.1.100',
          user_agent: 'Chrome 120.0.0.0',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          event_type: 'login_failed',
          description: 'Failed login attempt',
          ip_address: '203.0.113.1',
          user_agent: 'Unknown',
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ]

      const mockSessions: ActiveSession[] = [
        {
          id: '1',
          device_info: {
            browser: 'Chrome',
            os: 'Windows 11',
            device: 'Desktop'
          },
          ip_address: '192.168.1.100',
          last_activity: new Date().toISOString(),
          is_current: true,
          location: 'New York, US'
        },
        {
          id: '2',
          device_info: {
            browser: 'Safari',
            os: 'iOS 17',
            device: 'iPhone'
          },
          ip_address: '192.168.1.101',
          last_activity: new Date(Date.now() - 3600000).toISOString(),
          is_current: false,
          location: 'New York, US'
        }
      ]

      setSecurityEvents(mockEvents)
      setActiveSessions(mockSessions)
    } catch (error) {
      console.error('Error loading security data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load security information',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const terminateSession = async (sessionId: string) => {
    try {
      // Mock API call - replace with actual implementation
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId))
      toast({
        title: 'Session Terminated',
        description: 'The session has been successfully terminated'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to terminate session',
        variant: 'destructive'
      })
    }
  }

  const terminateAllSessions = async () => {
    try {
      // Mock API call - replace with actual implementation
      setActiveSessions(prev => prev.filter(session => session.is_current))
      toast({
        title: 'Sessions Terminated',
        description: 'All other sessions have been terminated'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to terminate sessions',
        variant: 'destructive'
      })
    }
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login_success':
        return <Shield className="h-4 w-4 text-green-500" />
      case 'login_failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'password_change':
        return <Key className="h-4 w-4 text-blue-500" />
      case 'mfa_enabled':
        return <Smartphone className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getEventBadgeVariant = (eventType: string) => {
    switch (eventType) {
      case 'login_success':
      case 'mfa_enabled':
      case 'password_change':
        return 'default'
      case 'login_failed':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getDeviceIcon = (device?: string) => {
    switch (device?.toLowerCase()) {
      case 'mobile':
      case 'iphone':
      case 'android':
        return <Smartphone className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  if (showMFA) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setShowMFA(false)}
              className="mb-4"
            >
              ← Back to Security Settings
            </Button>
          </div>
          <MFASettings onClose={() => setShowMFA(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account security and monitor access activity
          </p>
        </div>

        {/* Security Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Overview</span>
            </CardTitle>
            <CardDescription>
              Your account security status and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-900">Password</span>
                </div>
                <p className="text-sm text-green-700 mt-1">Strong password set</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-blue-900">Two-Factor Auth</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">Recommended</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5 text-purple-500" />
                  <span className="font-medium text-purple-900">Active Sessions</span>
                </div>
                <p className="text-sm text-purple-700 mt-1">{activeSessions.length} devices</p>
              </div>
            </div>
            
            <Button onClick={() => setShowMFA(true)} className="w-full md:w-auto">
              <Smartphone className="h-4 w-4 mr-2" />
              Manage Two-Factor Authentication
            </Button>
          </CardContent>
        </Card>

        {/* Security Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Security Preferences</CardTitle>
            <CardDescription>
              Configure your security settings and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-logout after inactivity</Label>
                <p className="text-sm text-gray-500">
                  Automatically sign out after 30 minutes of inactivity
                </p>
              </div>
              <Switch 
                checked={autoLogout} 
                onCheckedChange={setAutoLogout}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email security notifications</Label>
                <p className="text-sm text-gray-500">
                  Get notified about suspicious account activity
                </p>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5" />
                  <span>Active Sessions</span>
                </CardTitle>
                <CardDescription>
                  Devices currently signed into your account
                </CardDescription>
              </div>
              {activeSessions.length > 1 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={terminateAllSessions}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  End All Other Sessions
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getDeviceIcon(session.device_info.device)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">
                          {session.device_info.browser} on {session.device_info.os}
                        </p>
                        {session.is_current && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{session.location}</span>
                        </span>
                        <span>{session.ip_address}</span>
                        <span>Last active: {formatDate(session.last_activity)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!session.is_current && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => terminateSession(session.id)}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      End Session
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Security Activity</span>
                </CardTitle>
                <CardDescription>
                  Monitor recent security events on your account
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAllEvents(!showAllEvents)}
              >
                {showAllEvents ? (
                  <><EyeOff className="h-4 w-4 mr-2" /> Show Less</>
                ) : (
                  <><Eye className="h-4 w-4 mr-2" /> Show All</>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(showAllEvents ? securityEvents : securityEvents.slice(0, 3)).map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getEventIcon(event.event_type)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{event.description}</p>
                        <Badge variant={getEventBadgeVariant(event.event_type)} className="text-xs">
                          {event.event_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{event.ip_address}</span>
                        <span>{event.user_agent}</span>
                        <span>{formatDate(event.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}