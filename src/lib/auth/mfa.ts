'use client'

import { createClient } from '@/utils/supabase/client'
import * as OTPAuth from 'otpauth'
import QRCode from 'qrcode'

export interface MFASetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface MFAVerification {
  token: string
  backupCode?: string
}

class MFAService {
  private supabase = createClient()

  /**
   * Generate TOTP secret and QR code for MFA setup
   */
  async setupTOTP(userId: string, email: string): Promise<MFASetup> {
    try {
      // Generate a random secret
      const secret = new OTPAuth.Secret({ size: 20 })
      const secretBase32 = secret.base32

      // Create TOTP instance
      const totp = new OTPAuth.TOTP({
        issuer: 'IBIAS',
        label: email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secretBase32,
      })

      // Generate QR code
      const qrCode = await QRCode.toDataURL(totp.toString())

      // Generate backup codes
      const backupCodes = this.generateBackupCodes()

      // Store MFA settings in database
      const { error } = await this.supabase
        .from('user_mfa_settings')
        .upsert({
          user_id: userId,
          totp_secret: secretBase32,
          backup_codes: backupCodes,
          is_enabled: false, // Will be enabled after verification
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      return {
        secret: secretBase32,
        qrCode,
        backupCodes
      }
    } catch (error) {
      console.error('Error setting up TOTP:', error)
      throw new Error('Failed to setup two-factor authentication')
    }
  }

  /**
   * Verify TOTP token and enable MFA
   */
  async verifyAndEnableTOTP(userId: string, token: string): Promise<boolean> {
    try {
      // Get user's MFA settings
      const { data: mfaSettings, error } = await this.supabase
        .from('user_mfa_settings')
        .select('totp_secret')
        .eq('user_id', userId)
        .single()

      if (error || !mfaSettings?.totp_secret) {
        throw new Error('MFA not set up for this user')
      }

      // Verify the token
      const totp = new OTPAuth.TOTP({
        secret: mfaSettings.totp_secret,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
      })

      const isValid = totp.validate({ token, window: 1 }) !== null

      if (isValid) {
        // Enable MFA
        const { error: updateError } = await this.supabase
          .from('user_mfa_settings')
          .update({
            is_enabled: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (updateError) throw updateError
        return true
      }

      return false
    } catch (error) {
      console.error('Error verifying TOTP:', error)
      throw new Error('Failed to verify two-factor authentication')
    }
  }

  /**
   * Verify MFA token during login
   */
  async verifyMFA(userId: string, verification: MFAVerification): Promise<boolean> {
    try {
      const { data: mfaSettings, error } = await this.supabase
        .from('user_mfa_settings')
        .select('*')
        .eq('user_id', userId)
        .eq('is_enabled', true)
        .single()

      if (error || !mfaSettings) {
        return true // MFA not enabled, allow login
      }

      // Check backup code first
      if (verification.backupCode) {
        const backupCodes = mfaSettings.backup_codes as string[]
        const isValidBackupCode = backupCodes.includes(verification.backupCode)
        
        if (isValidBackupCode) {
          // Remove used backup code
          const updatedBackupCodes = backupCodes.filter(code => code !== verification.backupCode)
          await this.supabase
            .from('user_mfa_settings')
            .update({ backup_codes: updatedBackupCodes })
            .eq('user_id', userId)
          
          return true
        }
        return false
      }

      // Verify TOTP token
      const totp = new OTPAuth.TOTP({
        secret: mfaSettings.totp_secret,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
      })

      return totp.validate({ token: verification.token, window: 1 }) !== null
    } catch (error) {
      console.error('Error verifying MFA:', error)
      return false
    }
  }

  /**
   * Check if user has MFA enabled
   */
  async isMFAEnabled(userId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('user_mfa_settings')
        .select('is_enabled')
        .eq('user_id', userId)
        .single()

      if (error) return false
      return data?.is_enabled || false
    } catch (error) {
      console.error('Error checking MFA status:', error)
      return false
    }
  }

  /**
   * Disable MFA for user
   */
  async disableMFA(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('user_mfa_settings')
        .update({
          is_enabled: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error disabling MFA:', error)
      throw new Error('Failed to disable two-factor authentication')
    }
  }

  /**
   * Generate backup codes
   */
  private generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()
      codes.push(code)
    }
    return codes
  }

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(userId: string): Promise<string[]> {
    try {
      const newBackupCodes = this.generateBackupCodes()
      
      const { error } = await this.supabase
        .from('user_mfa_settings')
        .update({
          backup_codes: newBackupCodes,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) throw error
      return newBackupCodes
    } catch (error) {
      console.error('Error regenerating backup codes:', error)
      throw new Error('Failed to regenerate backup codes')
    }
  }
}

export const mfaService = new MFAService()
export default mfaService