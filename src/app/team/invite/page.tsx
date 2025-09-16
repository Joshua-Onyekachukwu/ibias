'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/contexts/SubscriptionContext'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  Mail, 
  Plus, 
  Trash2, 
  Crown, 
  Shield, 
  User,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'

interface TeamMember {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'member' | 'viewer'
  status: 'active' | 'pending' | 'suspended'
  invited_at: string
  last_login?: string
}

interface InviteForm {
  email: string
  role: 'member' | 'viewer'
}

export default function TeamInvite() {
  const { user, profile } = useAuth()
  const { subscription } = useSubscription()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [inviteForm, setInviteForm] = useState<InviteForm>({ email: '', role: 'member' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()

  // Get team member limits based on subscription
  const getTeamLimits = () => {
    switch (subscription?.plan_type) {
      case 'starter':
        return { limit: 1, current: teamMembers.length }
      case 'professional':
        return { limit: 5, current: teamMembers.length }
      case 'enterprise':
        return { limit: null, current: teamMembers.length } // Unlimited
      default:
        return { limit: 1, current: teamMembers.length }
    }
  }

  const teamLimits = getTeamLimits()
  const canInviteMore = teamLimits.limit === null || teamLimits.current < teamLimits.limit

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canInviteMore) {
      setMessage({ type: 'error', text: 'You have reached your team member limit. Please upgrade your plan.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', inviteForm.email)
        .eq('company_id', profile?.company_id)
        .single()

      if (existingUser) {
        setMessage({ type: 'error', text: 'This user is already part of your team.' })
        return
      }

      // Create team invitation
      const { error } = await supabase
        .from('team_invitations')
        .insert({
          company_id: profile?.company_id,
          email: inviteForm.email,
          role: inviteForm.role,
          invited_by: user?.id,
          status: 'pending'
        })

      if (error) throw error

      // TODO: Send invitation email
      setMessage({ type: 'success', text: 'Invitation sent successfully!' })
      setInviteForm({ email: '', role: 'member' })
      
      // Refresh team members list
      // fetchTeamMembers()
    } catch (error) {
      console.error('Error inviting team member:', error)
      setMessage({ type: 'error', text: 'Failed to send invitation. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 'member':
        return <Shield className="h-4 w-4 text-blue-500" />
      case 'viewer':
        return <User className="h-4 w-4 text-gray-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800'
      case 'member':
        return 'bg-blue-100 text-blue-800'
      case 'viewer':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground">
              Invite and manage your team members
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {teamLimits.limit === null ? 'Unlimited' : `${teamLimits.current}/${teamLimits.limit}`} members
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Invite Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Invite Team Member
              </CardTitle>
              <CardDescription>
                Add new team members to collaborate on your analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={inviteForm.role}
                    onValueChange={(value: 'member' | 'viewer') => 
                      setInviteForm({ ...inviteForm, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="font-medium">Member</div>
                            <div className="text-xs text-muted-foreground">Can view and edit data</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="font-medium">Viewer</div>
                            <div className="text-xs text-muted-foreground">Can only view data</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {message && (
                  <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                    {message.type === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                      {message.text}
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !canInviteMore}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Invitation...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invitation
                    </>
                  )}
                </Button>

                {!canInviteMore && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You've reached your team member limit. 
                      <Button variant="link" className="p-0 h-auto font-medium" asChild>
                        <a href="/pricing">Upgrade your plan</a>
                      </Button> to add more members.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Team Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Team
              </CardTitle>
              <CardDescription>
                Manage your existing team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current user (admin) */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-medium">{user?.full_name || 'You'}</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRoleIcon('admin')}
                    <Badge className={getRoleBadgeColor('admin')}>Admin</Badge>
                  </div>
                </div>

                {teamMembers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No team members yet</p>
                    <p className="text-sm">Invite your first team member to get started</p>
                  </div>
                ) : (
                  teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                          {member.full_name?.charAt(0) || member.email.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{member.full_name || member.email}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(member.role)}
                        <Badge className={getRoleBadgeColor(member.role)}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Limits Info */}
        <Card>
          <CardHeader>
            <CardTitle>Team Member Limits</CardTitle>
            <CardDescription>
              Your current plan allows for the following team member limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-400">1</div>
                <div className="text-sm text-muted-foreground">Starter Plan</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-muted-foreground">Growth Plan</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">25</div>
                <div className="text-sm text-muted-foreground">Scale Plan</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">∞</div>
                <div className="text-sm text-muted-foreground">Enterprise Plan</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}