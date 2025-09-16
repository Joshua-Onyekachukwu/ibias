'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Key,
  Mail,
  Smartphone,
  Clock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

interface UserSettings {
  profile: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company: string
    role: string
    bio: string
    avatar: string
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    smsNotifications: boolean
    weeklyReports: boolean
    aiInsights: boolean
    securityAlerts: boolean
    marketingEmails: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'team'
    dataSharing: boolean
    analyticsTracking: boolean
    thirdPartyIntegrations: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    dateFormat: string
    currency: string
    dashboardLayout: 'default' | 'compact' | 'detailed'
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: number
    loginAlerts: boolean
    passwordLastChanged: string
  }
}

export default function SettingsPage() {
  const { user, userProfile, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: userProfile?.full_name?.split(' ')[0] || '',
      lastName: userProfile?.full_name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: '',
      company: '',
      role: '',
      bio: '',
      avatar: userProfile?.avatar_url || ''
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      weeklyReports: true,
      aiInsights: true,
      securityAlerts: true,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: 'team',
      dataSharing: true,
      analyticsTracking: true,
      thirdPartyIntegrations: true
    },
    preferences: {
      theme: theme as 'light' | 'dark' | 'system' || 'system',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      dashboardLayout: 'default'
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginAlerts: true,
      passwordLastChanged: '2024-01-15'
    }
  })

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update theme if changed
      if (settings.preferences.theme !== theme) {
        setTheme(settings.preferences.theme)
      }
      
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = () => {
    toast.success('Data export initiated. You will receive an email when ready.')
  }

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires email confirmation. Check your inbox.')
  }

  const updateSetting = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={settings.profile.avatar} />
                      <AvatarFallback className="text-lg">
                        {settings.profile.firstName.charAt(0)}{settings.profile.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={settings.profile.firstName}
                        onChange={(e) => updateSetting('profile', 'firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={settings.profile.lastName}
                        onChange={(e) => updateSetting('profile', 'lastName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={settings.profile.phone}
                        onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={settings.profile.company}
                        onChange={(e) => updateSetting('profile', 'company', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={settings.profile.role}
                        onChange={(e) => updateSetting('profile', 'role', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={settings.profile.bio}
                      onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about updates and activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(settings.notifications).map(([key, value]) => {
                    const labels = {
                      emailNotifications: 'Email Notifications',
                      pushNotifications: 'Push Notifications',
                      smsNotifications: 'SMS Notifications',
                      weeklyReports: 'Weekly Reports',
                      aiInsights: 'AI Insights',
                      securityAlerts: 'Security Alerts',
                      marketingEmails: 'Marketing Emails'
                    }
                    
                    const descriptions = {
                      emailNotifications: 'Receive notifications via email',
                      pushNotifications: 'Receive browser push notifications',
                      smsNotifications: 'Receive SMS notifications for critical alerts',
                      weeklyReports: 'Get weekly performance summaries',
                      aiInsights: 'Receive AI-generated insights and recommendations',
                      securityAlerts: 'Get notified about security events',
                      marketingEmails: 'Receive product updates and marketing content'
                    }

                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>{labels[key as keyof typeof labels]}</Label>
                          <p className="text-sm text-gray-500">
                            {descriptions[key as keyof typeof descriptions]}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => updateSetting('notifications', key, checked)}
                        />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Data</CardTitle>
                  <CardDescription>
                    Control your privacy settings and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Profile Visibility</Label>
                      <Select
                        value={settings.privacy.profileVisibility}
                        onValueChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="team">Team Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {Object.entries(settings.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => {
                      const labels = {
                        dataSharing: 'Data Sharing',
                        analyticsTracking: 'Analytics Tracking',
                        thirdPartyIntegrations: 'Third-party Integrations'
                      }
                      
                      const descriptions = {
                        dataSharing: 'Allow sharing anonymized data for platform improvements',
                        analyticsTracking: 'Enable usage analytics for better user experience',
                        thirdPartyIntegrations: 'Allow data sharing with connected integrations'
                      }

                      return (
                        <div key={key} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>{labels[key as keyof typeof labels]}</Label>
                            <p className="text-sm text-gray-500">
                              {descriptions[key as keyof typeof descriptions]}
                            </p>
                          </div>
                          <Switch
                            checked={value as boolean}
                            onCheckedChange={(checked) => updateSetting('privacy', key, checked)}
                          />
                        </div>
                      )
                    })}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Data Management</h4>
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Display & Preferences</CardTitle>
                  <CardDescription>
                    Customize your dashboard appearance and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select
                        value={settings.preferences.theme}
                        onValueChange={(value) => updateSetting('preferences', 'theme', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center gap-2">
                              <Sun className="h-4 w-4" />
                              Light
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center gap-2">
                              <Moon className="h-4 w-4" />
                              Dark
                            </div>
                          </SelectItem>
                          <SelectItem value="system">
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              System
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select
                        value={settings.preferences.language}
                        onValueChange={(value) => updateSetting('preferences', 'language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select
                        value={settings.preferences.timezone}
                        onValueChange={(value) => updateSetting('preferences', 'timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <Select
                        value={settings.preferences.dateFormat}
                        onValueChange={(value) => updateSetting('preferences', 'dateFormat', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={settings.preferences.currency}
                        onValueChange={(value) => updateSetting('preferences', 'currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="JPY">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Dashboard Layout</Label>
                      <Select
                        value={settings.preferences.dashboardLayout}
                        onValueChange={(value) => updateSetting('preferences', 'dashboardLayout', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and authentication preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {settings.security.twoFactorEnabled && (
                          <Badge variant="secondary">Enabled</Badge>
                        )}
                        <Switch
                          checked={settings.security.twoFactorEnabled}
                          onCheckedChange={(checked) => updateSetting('security', 'twoFactorEnabled', checked)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Login Alerts</Label>
                        <p className="text-sm text-gray-500">
                          Get notified when someone logs into your account
                        </p>
                      </div>
                      <Switch
                        checked={settings.security.loginAlerts}
                        onCheckedChange={(checked) => updateSetting('security', 'loginAlerts', checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Session Timeout (minutes)</Label>
                      <Select
                        value={settings.security.sessionTimeout.toString()}
                        onValueChange={(value) => updateSetting('security', 'sessionTimeout', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Password & Authentication</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Password</p>
                          <p className="text-sm text-gray-500">
                            Last changed: {settings.security.passwordLastChanged}
                          </p>
                        </div>
                        <Button variant="outline">
                          Change Password
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Active Sessions</p>
                          <p className="text-sm text-gray-500">
                            Manage your active login sessions
                          </p>
                        </div>
                        <Button variant="outline">
                          View Sessions
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-end mt-8"
        >
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            size="lg"
            className="min-w-[120px]"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}