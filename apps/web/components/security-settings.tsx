'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, Laptop, LogOut } from 'lucide-react'
import { toast } from 'sonner'

interface Session {
  id: string
  device: string
  ip: string
  lastActive: string
  current: boolean
}

export function SecuritySettings() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/users/me/sessions')

      if (res.ok) {
        const data = await res.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error('[Security] Error loading sessions:', error)
      toast.error('Failed to load active sessions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }

    try {
      setIsChangingPassword(true)
      const res = await fetch('/api/users/me/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (res.ok) {
        toast.success('Password changed successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('[Security] Error changing password:', error)
      toast.error('Error changing password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogoutSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/users/me/sessions/${sessionId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setSessions(sessions.filter((s) => s.id !== sessionId))
        toast.success('Session ended')
      } else {
        toast.error('Failed to end session')
      }
    } catch (error) {
      console.error('[Security] Error ending session:', error)
      toast.error('Error ending session')
    }
  }

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="bg-[#121412] border-[#2a2826] text-[#FFFFFF]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#99FF33]" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="bg-[#1a1918] border-[#2a2826] text-[#FFFFFF]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 8 characters)"
              className="bg-[#1a1918] border-[#2a2826] text-[#FFFFFF]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="bg-[#1a1918] border-[#2a2826] text-[#FFFFFF]"
            />
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className="bg-[#99FF33] text-[#121412] hover:bg-[#99FF33]/90 w-full"
          >
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </Button>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="bg-[#121412] border-[#2a2826] text-[#FFFFFF]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Laptop className="h-5 w-5 text-[#99FF33]" />
            Active Sessions
          </CardTitle>
          <CardDescription>Manage your active sessions on other devices</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-[#6B8E6E]">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-[#6B8E6E]">No active sessions</div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#1a1918] border border-[#2a2826]"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Laptop className="h-4 w-4 text-[#99FF33]" />
                      <h4 className="font-semibold">{session.device}</h4>
                      {session.current && (
                        <Badge className="bg-[#99FF33] text-[#121412]">Current</Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#6B8E6E]">
                      IP: {session.ip} • Last active: {session.lastActive}
                    </p>
                  </div>

                  {!session.current && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLogoutSession(session.id)}
                      className="border-[#2a2826] text-[#99FF33]"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      End Session
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
