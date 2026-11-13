'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Lock, Users, Ban } from 'lucide-react'
import { toast } from 'sonner'

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private'
  showEmail: boolean
  allowMessages: boolean
  allowNotifications: boolean
  showOnlineStatus: boolean
  showActivityStatus: boolean
}

export function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    allowMessages: true,
    allowNotifications: true,
    showOnlineStatus: true,
    showActivityStatus: true,
  })

  const [blockedUsers, setBlockedUsers] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPrivacySettings()
  }, [])

  const loadPrivacySettings = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/users/me/privacy')

      if (res.ok) {
        const data = await res.json()
        setSettings(data.privacy)
        setBlockedUsers(data.blockedUsers || [])
      }
    } catch (error) {
      console.error('[Privacy] Error loading settings:', error)
      toast.error('Failed to load privacy settings')
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setIsSaving(true)
      const res = await fetch('/api/users/me/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privacy: settings }),
      })

      if (res.ok) {
        toast.success('Privacy settings saved')
      } else {
        toast.error('Failed to save privacy settings')
      }
    } catch (error) {
      console.error('[Privacy] Error saving settings:', error)
      toast.error('Error saving privacy settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-[#121412] border-[#2a2826]">
        <CardContent className="pt-6 text-center text-[#6B8E6E]">
          Loading privacy settings...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#121412] border-[#2a2826] text-[#FFFFFF]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-[#99FF33]" />
          Privacy Settings
        </CardTitle>
        <CardDescription>Control who can see your profile and interact with you</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Visibility */}
        <div className="space-y-2">
          <Label htmlFor="visibility">Profile Visibility</Label>
          <Select
            value={settings.profileVisibility}
            onValueChange={(value: any) =>
              setSettings({ ...settings, profileVisibility: value })
            }
          >
            <SelectTrigger className="bg-[#1a1918] border-[#2a2826]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1918] border-[#2a2826]">
              <SelectItem value="public">Public - Everyone can see</SelectItem>
              <SelectItem value="friends">Friends Only</SelectItem>
              <SelectItem value="private">Private - Only me</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggle Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]">
            <div>
              <Label className="text-[#FFFFFF]">Show Email Address</Label>
              <p className="text-xs text-[#6B8E6E]">Allow others to see your email</p>
            </div>
            <Switch
              checked={settings.showEmail}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, showEmail: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]">
            <div>
              <Label className="text-[#FFFFFF]">Allow Messages</Label>
              <p className="text-xs text-[#6B8E6E]">Let others send you messages</p>
            </div>
            <Switch
              checked={settings.allowMessages}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, allowMessages: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]">
            <div>
              <Label className="text-[#FFFFFF]">Allow Notifications</Label>
              <p className="text-xs text-[#6B8E6E]">Receive notifications from others</p>
            </div>
            <Switch
              checked={settings.allowNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, allowNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]">
            <div>
              <Label className="text-[#FFFFFF]">Show Online Status</Label>
              <p className="text-xs text-[#6B8E6E]">Let others see when you're online</p>
            </div>
            <Switch
              checked={settings.showOnlineStatus}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, showOnlineStatus: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]">
            <div>
              <Label className="text-[#FFFFFF]">Show Activity Status</Label>
              <p className="text-xs text-[#6B8E6E]">Show what you're doing</p>
            </div>
            <Switch
              checked={settings.showActivityStatus}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, showActivityStatus: checked })
              }
            />
          </div>
        </div>

        {/* Blocked Users */}
        {blockedUsers.length > 0 && (
          <div className="space-y-2 pt-6 border-t border-[#2a2826]">
            <h3 className="font-semibold flex items-center gap-2">
              <Ban className="h-4 w-4 text-[#99FF33]" />
              Blocked Users ({blockedUsers.length})
            </h3>
            <div className="space-y-2">
              {blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]"
                >
                  <span className="text-sm">{user.name}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Unblock user
                      setBlockedUsers(blockedUsers.filter((u) => u.id !== user.id))
                      toast.success('User unblocked')
                    }}
                    className="text-xs border-[#99FF33]"
                  >
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-6 border-t border-[#2a2826] flex justify-end">
          <Button
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-[#99FF33] text-[#121412] hover:bg-[#99FF33]/90"
          >
            {isSaving ? 'Saving...' : 'Save Privacy Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
