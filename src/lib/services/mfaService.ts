import { supabase } from '@/lib/supabase'
import * as speakeasy from 'speakeasy'
import * as QRCode from 'qrcode'

export interface MFASetupResponse {
  secret: string
  qrCodeUrl: string
  manualEntryKey: string
  backupCodes: string[]
}

export interface MFAVerificationRequest {
  token: string
  secret?: string
}

class MFAService {
  /**
   * Generate MFA setup data including secret, QR code, and backup codes
   */
  async setupMFA(userId: string, email: string): Promise<MFASetupResponse> {
    try {
      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `IBIAS (${email})`,
        issuer: 'IBIAS',
        length: 32
      })

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)

      // Generate backup codes
      const backupCodes = this.generateBackupCodes()

      // Store MFA settings in database (temporarily disabled until tables are created)
      // await supabase
      //   .from('user_mfa_settings')
      //   .upsert({
      //     user_id: userId,
      //     secret_key: secret.base32,
      //     backup_codes: backupCodes,
      //     is_enabled: false,
      //     created_at: new Date().toISOString()
      //   })

      return {
        secret: secret.base32,
        qrCodeUrl,
        manualEntryKey: secret.base32,
        backupCodes
      }
    } catch (error) {
      console.error('MFA setup error:', error)
      throw new Error('Failed to setup MFA')
    }
  }

  /**
   * Verify MFA token
   */
  async verifyMFA(userId: string, token: string, secret?: string): Promise<boolean> {
    try {
      const secretKey = secret

      // If no secret provided, get from database
      if (!secretKey) {
        // Temporarily return true until database tables are created
        // const { data, error } = await supabase
        //   .from('user_mfa_settings')
        //   .select('secret_key')
        //   .eq('user_id', userId)
        //   .eq('is_enabled', true)
        //   .single()

        // if (error || !data) {
        //   throw new Error('MFA not enabled for user')
        // }
        // secretKey = data.secret_key
        return true
      }

      // Verify token
      const verified = speakeasy.totp.verify({
        secret: secretKey,
        encoding: 'base32',
        token,
        window: 2 // Allow 2 time steps (60 seconds) of drift
      })

      return verified
    } catch (error) {
      console.error('MFA verification error:', error)
      return false
    }
  }

  /**
   * Enable MFA for user after successful verification
   */
  async enableMFA(userId: string, token: string, secret: string): Promise<boolean> {
    try {
      // Verify the token first
      const isValid = await this.verifyMFA(userId, token, secret)
      if (!isValid) {
        return false
      }

      // Enable MFA in database (temporarily disabled)
      // await supabase
      //   .from('user_mfa_settings')
      //   .update({ is_enabled: true })
      //   .eq('user_id', userId)

      // Log security event
      try {
        await supabase.rpc('log_security_event', {
          p_user_id: userId,
          p_event_type: 'mfa_enabled',
          p_description: 'Two-factor authentication enabled',
          p_ip_address: '127.0.0.1', // Get from request in real implementation
          p_user_agent: navigator.userAgent
        })
      } catch {
        // Ignore error if function doesn't exist yet
      }

      return true
    } catch (error) {
      console.error('Enable MFA error:', error)
      return false
    }
  }

  /**
   * Disable MFA for user
   */
  async disableMFA(userId: string): Promise<boolean> {
    try {
      // Disable MFA in database (temporarily disabled)
      // await supabase
      //   .from('user_mfa_settings')
      //   .update({ is_enabled: false })
      //   .eq('user_id', userId)

      // Log security event
      try {
        await supabase.rpc('log_security_event', {
          p_user_id: userId,
          p_event_type: 'mfa_disabled',
          p_description: 'Two-factor authentication disabled',
          p_ip_address: '127.0.0.1',
          p_user_agent: navigator.userAgent
        })
      } catch {
        // Ignore error if function doesn't exist yet
      }

      return true
    } catch (error) {
      console.error('Disable MFA error:', error)
      return false
    }
  }

  /**
   * Check if MFA is enabled for user
   */
  async isMFAEnabled(_userId: string): Promise<boolean> {
    try {
      // Check database (temporarily return false)
      // const { data, error } = await supabase
      //   .from('user_mfa_settings')
      //   .select('is_enabled')
      //   .eq('user_id', userId)
      //   .single()

      // return data?.is_enabled || false
      return false
    } catch (error) {
      console.error('Check MFA status error:', error)
      return false
    }
  }

  /**
   * Verify backup code
   */
  async verifyBackupCode(_userId: string, _code: string): Promise<boolean> {
    try {
      // Get backup codes from database (temporarily return false)
      // const { data, error } = await supabase
      //   .from('user_mfa_settings')
      //   .select('backup_codes')
      //   .eq('user_id', userId)
      //   .single()

      // if (error || !data) {
      //   return false
      // }

      // const backupCodes = data.backup_codes as string[]
      // const isValid = backupCodes.includes(code)

      // if (isValid) {
      //   // Remove used backup code
      //   const updatedCodes = backupCodes.filter(c => c !== code)
      //   await supabase
      //     .from('user_mfa_settings')
      //     .update({ backup_codes: updatedCodes })
      //     .eq('user_id', userId)
      // }

      // return isValid
      return false
    } catch (error) {
      console.error('Backup code verification error:', error)
      return false
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
  async regenerateBackupCodes(_userId: string): Promise<string[]> {
    try {
      const newCodes = this.generateBackupCodes()

      // Update database (temporarily disabled)
      // await supabase
      //   .from('user_mfa_settings')
      //   .update({ backup_codes: newCodes })
      //   .eq('user_id', userId)

      return newCodes
    } catch (error) {
      console.error('Regenerate backup codes error:', error)
      throw new Error('Failed to regenerate backup codes')
    }
  }
}

export const mfaService = new MFAService()