"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Eye, Lock } from "lucide-react"
import { toast } from "sonner"
import type { Session } from "next-auth"

interface PrivacySettingsTabProps {
  user?: Session["user"]
}

export function PrivacySettingsTab({ user }: PrivacySettingsTabProps) {
  const [privacy, setPrivacy] = useState({
    showEmail: false,
    allowMessages: true,
    allowNotifications: true,
    showOnlineStatus: true,
    showActivityStatus: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (key: keyof typeof privacy) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement API call to save privacy settings
      // PUT /api/settings/privacy
      toast.success("Privacy settings updated")
    } catch (error) {
      toast.error("Failed to update privacy settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Privacy */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="size-5 text-[#5a8c5a] dark:text-primary" />
            <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
              Profile Privacy
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Control who can see your profile and interact with you
          </p>
        </div>

        <div className="space-y-4">
          {/* Show Email Address */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5">
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-50">
                Show Email Address
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Allow others to see your email
              </p>
            </div>
            <Switch
              checked={privacy.showEmail}
              onCheckedChange={() => handleToggle("showEmail")}
            />
          </div>

          {/* Allow Messages */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5">
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-50">
                Allow Messages
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Let others send you direct messages
              </p>
            </div>
            <Switch
              checked={privacy.allowMessages}
              onCheckedChange={() => handleToggle("allowMessages")}
            />
          </div>

          {/* Allow Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5">
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-50">
                Allow Notifications
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Receive notifications from followers
              </p>
            </div>
            <Switch
              checked={privacy.allowNotifications}
              onCheckedChange={() => handleToggle("allowNotifications")}
            />
          </div>
        </div>
      </Card>

      {/* Activity Privacy */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="size-5 text-[#5a8c5a] dark:text-primary" />
            <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
              Activity Privacy
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Control visibility of your activity
          </p>
        </div>

        <div className="space-y-4">
          {/* Show Online Status */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5">
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-50">
                Show Online Status
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Let others see when you're online
              </p>
            </div>
            <Switch
              checked={privacy.showOnlineStatus}
              onCheckedChange={() => handleToggle("showOnlineStatus")}
            />
          </div>

          {/* Show Activity Status */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5">
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-50">
                Show Activity Status
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Show what you're currently doing
              </p>
            </div>
            <Switch
              checked={privacy.showActivityStatus}
              onCheckedChange={() => handleToggle("showActivityStatus")}
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full h-11 rounded-full bg-[#5a8c5a] dark:bg-primary text-sm font-black uppercase tracking-[0.12em] text-white dark:text-primary-foreground shadow-sm dark:shadow-glow hover:bg-[#4a7c4a] dark:hover:bg-primary/90 disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save Privacy Settings"}
      </Button>
    </div>
  )
}
