"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Mail, Zap } from "lucide-react"
import { toast } from "sonner"
import type { Session } from "next-auth"

interface NotificationsSettingsTabProps {
  user?: Session["user"]
}

export function NotificationsSettingsTab({ user }: NotificationsSettingsTabProps) {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newFollowers: true,
    itemPurchases: true,
    comments: true,
    messages: true,
    liveStreams: true,
    frequency: "immediate",
    quietHours: true,
    quietStart: "22:00",
    quietEnd: "08:00",
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "boolean" ? !prev[key] : prev[key],
    }))
  }

  const handleChange = (key: keyof typeof notifications, value: string) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement API call to save notification settings
      // PUT /api/settings/notifications
      toast.success("Notification settings updated")
    } catch (error) {
      toast.error("Failed to update notification settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="size-5 text-[#5a8c5a] dark:text-primary" />
            <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
              Notification Channels
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Choose how you want to receive notifications
          </p>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-[#5a8c5a] dark:text-primary" />
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-50">
                  Email Notifications
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={() => handleToggle("emailNotifications")}
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5">
            <div className="flex items-center gap-3">
              <Zap className="size-5 text-[#5a8c5a] dark:text-primary" />
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-50">
                  In-app Notifications
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Receive in-app alerts
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.pushNotifications}
              onCheckedChange={() => handleToggle("pushNotifications")}
            />
          </div>
        </div>
      </Card>

      {/* Notification Types */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
            What to notify me about
          </h3>
        </div>

        <div className="space-y-4">
          {[
            { key: "newFollowers", label: "New Followers", desc: "When someone follows you" },
            { key: "itemPurchases", label: "Item Purchases", desc: "When someone buys your items" },
            { key: "comments", label: "Comments", desc: "When someone comments on your posts" },
            { key: "messages", label: "Messages", desc: "When you receive direct messages" },
            { key: "liveStreams", label: "Live Streams", desc: "When creators you follow go live" },
          ].map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5"
            >
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-50">{label}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{desc}</p>
              </div>
              <Switch
                checked={notifications[key as keyof typeof notifications] as boolean}
                onCheckedChange={() => handleToggle(key as keyof typeof notifications)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
            Notification Preferences
          </h3>
        </div>

        <div className="space-y-5">
          {/* Frequency */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Notification Frequency
            </Label>
            <Select value={notifications.frequency} onValueChange={(value) => handleChange("frequency", value)}>
              <SelectTrigger className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quiet Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Quiet Hours (Do Not Disturb)
              </Label>
              <Switch
                checked={notifications.quietHours}
                onCheckedChange={() => handleToggle("quietHours")}
              />
            </div>

            {notifications.quietHours && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quietStart" className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Start Time
                  </Label>
                  <input
                    id="quietStart"
                    type="time"
                    value={notifications.quietStart}
                    onChange={(e) => handleChange("quietStart", e.target.value)}
                    className="w-full h-11 rounded-lg border border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 px-3 text-slate-900 dark:text-slate-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quietEnd" className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    End Time
                  </Label>
                  <input
                    id="quietEnd"
                    type="time"
                    value={notifications.quietEnd}
                    onChange={(e) => handleChange("quietEnd", e.target.value)}
                    className="w-full h-11 rounded-lg border border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 px-3 text-slate-900 dark:text-slate-50"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full h-11 rounded-full bg-[#5a8c5a] dark:bg-primary text-sm font-black uppercase tracking-[0.12em] text-white dark:text-primary-foreground shadow-sm dark:shadow-glow hover:bg-[#4a7c4a] dark:hover:bg-primary/90 disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save Notification Settings"}
      </Button>
    </div>
  )
}
