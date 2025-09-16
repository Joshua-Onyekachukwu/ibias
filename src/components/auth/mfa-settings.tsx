'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Smartphone, 
  Key, 
  Copy, 
  Check, 
  AlertTriangle,
  QrCode,
  Download,
  RefreshCw,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'

interface MFASettingsProps {
  onClose?: () => void
}

interface MFASetupData {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export function MFASettings({ onClose }: MFASettingsProps) {
  const { user, setupMFA, verifyMFA, disableMFA, isMFAEnabled } = useAuth()
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [setupData, setSetupData] = useState<MFASetupData | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [copiedCodes, setCopiedCodes] = useState(false)
  const [step, setStep] = useState<'status' | 'setup' | 'verify' | 'backup'>('status')

  useEffect(() => {
    checkMFAStatus()
  }, [user])

  const checkMFAStatus = async () => {
    if (!user) return
    
    try {
      const enabled = await isMFAEnabled()
      setIsEnabled(enabled)
    } catch (error) {
      console.error('Error checking MFA status:', error)
    }
  }

  const handleSetupMFA = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const data = await setupMFA()
      setSetupData(data)
      setStep('setup')
      toast({
        title: 'MFA Setup Started',
        description: 'Scan the QR code with your authenticator app'
      })
    } catch (error: any) {
      toast({
        title: 'Setup Failed',
        description: error.message || 'Failed to setup MFA',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifySetup = async () => {
    if (!verificationCode || !setupData) return
    
    setIsLoading(true)
    try {
      await verifyMFA(verificationCode)
      setIsEnabled(true)
      setStep('backup')
      toast({
        title: 'MFA Enabled',
        description: 'Two-factor authentication has been successfully enabled'
      })
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid verification code',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisableMFA = async () => {
    setIsLoading(true)
    try {
      await disableMFA()
      setIsEnabled(false)
      setStep('status')
      setSetupData(null)
      toast({
        title: 'MFA Disabled',
        description: 'Two-factor authentication has been disabled'
      })
    } catch (error: any) {
      toast({
        title: 'Disable Failed',
        description: error.message || 'Failed to disable MFA',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyBackupCodes = async () => {
    if (!setupData?.backupCodes) return
    
    const codesText = setupData.backupCodes.join('\n')
    await navigator.clipboard.writeText(codesText)
    setCopiedCodes(true)
    setTimeout(() => setCopiedCodes(false), 2000)
    toast({
      title: 'Backup Codes Copied',
      description: 'Store these codes in a safe place'
    })
  }

  const downloadBackupCodes = () => {
    if (!setupData?.backupCodes) return
    
    const codesText = setupData.backupCodes.join('\n')
    const blob = new Blob([codesText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ibias-backup-codes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: 'Backup Codes Downloaded',
      description: 'Keep this file in a secure location'
    })
  }

  const renderStatus = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className={`h-5 w-5 ${isEnabled ? 'text-green-500' : 'text-gray-400'}`} />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <Badge variant={isEnabled ? 'default' : 'secondary'}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        <CardDescription>
          Add an extra layer of security to your account with two-factor authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
          <Smartphone className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900">Authenticator App</h4>
            <p className="text-sm text-blue-700">
              Use apps like Google Authenticator, Authy, or 1Password to generate verification codes
            </p>
          </div>
        </div>
        
        {isEnabled ? (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-green-900">MFA is active</p>
                <p className="text-sm text-green-700">Your account is protected with 2FA</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDisableMFA}
              disabled={isLoading}
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Disable'}
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleSetupMFA} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Shield className="h-4 w-4 mr-2" />
            )}
            Enable Two-Factor Authentication
          </Button>
        )}
      </CardContent>
    </Card>
  )

  const renderSetup = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>Setup Authenticator</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setStep('status')}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Scan this QR code with your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {setupData && (
          <>
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <img 
                  src={setupData.qrCode} 
                  alt="MFA QR Code" 
                  className="w-48 h-48"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Manual Entry Key</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  value={setupData.secret} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(setupData.secret)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Use this key if you can't scan the QR code
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-lg font-mono"
              />
              <p className="text-xs text-gray-500">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
            
            <Button 
              onClick={handleVerifySetup}
              disabled={verificationCode.length !== 6 || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Key className="h-4 w-4 mr-2" />
              )}
              Verify and Enable
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )

  const renderBackupCodes = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Backup Codes</span>
        </CardTitle>
        <CardDescription>
          Save these backup codes in a secure location. Each code can only be used once.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Important</p>
              <p className="text-sm text-yellow-700">
                Store these codes safely. You'll need them to access your account if you lose your authenticator device.
              </p>
            </div>
          </div>
        </div>
        
        {setupData?.backupCodes && (
          <>
            <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg font-mono text-sm">
              {setupData.backupCodes.map((code, index) => (
                <div key={index} className="p-2 bg-white rounded border text-center">
                  {code}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={copyBackupCodes}
                className="flex-1"
              >
                {copiedCodes ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copiedCodes ? 'Copied!' : 'Copy Codes'}
              </Button>
              <Button 
                variant="outline" 
                onClick={downloadBackupCodes}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </>
        )}
        
        <Button 
          onClick={() => {
            setStep('status')
            onClose?.()
          }}
          className="w-full"
        >
          Complete Setup
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 'status' && renderStatus()}
          {step === 'setup' && renderSetup()}
          {step === 'backup' && renderBackupCodes()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default MFASettings