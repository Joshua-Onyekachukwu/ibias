'use client'

import { PasswordReset } from '@/components/auth/PasswordReset'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Redirect to login page after successful password reset
    setTimeout(() => {
      router.push('/auth?message=Password reset successful. Please sign in with your new password.')
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <PasswordReset mode="reset" onSuccess={handleSuccess} />
    </div>
  )
}