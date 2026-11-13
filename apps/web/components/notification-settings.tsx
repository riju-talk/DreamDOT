'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bell } from 'lucide-react'
import { toast } from 'sonner'

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  frequency: 'realtime' | 'daily' | 'weekly'
  quietHoursStart: string
  quietHoursEnd: string
  types: {
    newFollowers: boolean
    itemPurchases: boolean
    comments: boolean
    messages: boolean
    liveStreams: boolean
  }
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    frequency: 'realtime',
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    types: {
      newFollowers: true,
      itemPurchases: true,
      comments: true,
      messages: true,
      liveStreams: true,
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNotificationSettings()
  }, [])

  const loadNotificationSettings = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/users/me/notifications')

      if (res.ok) {
        const data = await res.json()
        setSettings(data.notifications)
      }
    } catch (error) {
      console.error('[Notifications] Error loading settings:', error)
      toast.error('Failed to load notification settings')
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setIsSaving(true)
      const res = await fetch('/api/users/me/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: settings }),
      })

      if (res.ok) {
        toast.success('Notification settings saved')
      } else {
        toast.error('Failed to save notification settings')
      }
    } catch (error) {
      console.error('[Notifications] Error saving settings:', error)
      toast.error('Error saving notification settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-[#121412] border-[#2a2826]">
        <CardContent className="pt-6 text-center text-[#6B8E6E]">
          Loading notification settings...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#121412] border-[#2a2826] text-[#FFFFFF]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#99FF33]" />
          Notification Settings
        </CardTitle>
        <CardDescription>Control how and when you receive notifications</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]">
            <div>
              <Label className="text-[#FFFFFF]">Email Notifications</Label>
              <p className="text-xs text-[#6B8E6E]">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]">
            <div>
              <Label className="text-[#FFFFFF]">Push Notifications</Label>
              <p className="text-xs text-[#6B8E6E]">Receive in-app notifications</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, pushNotifications: checked })
              }
            />
          </div>
        </div>

        {/* Frequency */}
        <div className="space-y-2 pt-6 border-t border-[#2a2826]">
          <Label htmlFor="frequency" className="text-[#FFFFFF]">
            Notification Frequency
          </Label>
          <Select
            value={settings.frequency}
            onValueChange={(value: any) => setSettings({ ...settings, frequency: value })}
          >
            <SelectTrigger className="bg-[#1a1918] border-[#2a2826]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1918] border-[#2a2826]">
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Digest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quiet Hours */}
        <div className="space-y-4 pt-6 border-t border-[#2a2826]">
          <h3 className="font-semibold text-[#FFFFFF]">Quiet Hours (Do Not Disturb)</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quietStart" className="text-sm">
                Start Time
              </Label>
              <input
                id="quietStart"
                type="time"
                value={settings.quietHoursStart}
                onChange={(e) =>
                  setSettings({ ...settings, quietHoursStart: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#1a1918] border border-[#2a2826] text-[#FFFFFF]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quietEnd" className="text-sm">
                End Time
              </Label>
              <input
                id="quietEnd"
                type="time"
                value={settings.quietHoursEnd}
                onChange={(e) =>
                  setSettings({ ...settings, quietHoursEnd: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#1a1918] border border-[#2a2826] text-[#FFFFFF]"
              />
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-4 pt-6 border-t border-[#2a2826]">
          <h3 className="font-semibold text-[#FFFFFF]">Notification Types</h3>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]">
            <Label className="text-[#FFFFFF]">New Followers</Label>
            <Switch
              checked={settings.types.newFollowers}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  types: { ...settings.types, newFollowers: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]">
            <Label className="text-[#FFFFFF]">Item Purchases</Label>
            <Switch
              checked={settings.types.itemPurchases}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  types: { ...settings.types, itemPurchases: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]">
            <Label className="text-[#FFFFFF]">Comments</Label>
            <Switch
              checked={settings.types.comments}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  types: { ...settings.types, comments: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]">
            <Label className="text-[#FFFFFF]">Messages</Label>
            <Switch
              checked={settings.types.messages}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  types: { ...settings.types, messages: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1918]">
            <Label className="text-[#FFFFFF]">Live Streams</Label>
            <Switch
              checked={settings.types.liveStreams}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  types: { ...settings.types, liveStreams: checked },
                })
              }
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-[#2a2826] flex justify-end">
          <Button
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-[#99FF33] text-[#121412] hover:bg-[#99FF33]/90"
          >
            {isSaving ? 'Saving...' : 'Save Notification Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
