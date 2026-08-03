"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Lock, Key, Smartphone, AlertTriangle, Eye, EyeOff, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Session } from "next-auth"

interface SecuritySettingsTabProps {
  user?: Session["user"]
}

export function SecuritySettingsTab({ user }: SecuritySettingsTabProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("All password fields are required")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setIsSaving(true)
    try {
      // TODO: Implement API call to change password
      // POST /api/auth/change-password
      toast.success("Password updated successfully")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      toast.error("Failed to update password")
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggle2FA = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement API call to enable/disable 2FA
      // POST /api/auth/2fa/toggle
      setTwoFactorEnabled(!twoFactorEnabled)
      toast.success(
        twoFactorEnabled
          ? "Two-factor authentication disabled"
          : "Two-factor authentication enabled"
      )
    } catch (error) {
      toast.error("Failed to update 2FA settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Password & Security */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Key className="size-5 text-[#5a8c5a] dark:text-primary" />
            <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
              Password & Security
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Update your password and manage security settings
          </p>
        </div>

        <div className="space-y-5">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary pr-10"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-xs font-bold text-slate-900 dark:text-slate-100">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary pr-10"
                placeholder="Enter new password (min. 8 characters)"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary pr-10"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleUpdatePassword}
            disabled={isSaving}
            className="w-full h-11 rounded-full bg-[#5a8c5a] dark:bg-primary text-sm font-black uppercase tracking-[0.12em] text-white dark:text-primary-foreground shadow-sm dark:shadow-glow hover:bg-[#4a7c4a] dark:hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="size-5 text-[#5a8c5a] dark:text-primary" />
            <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
              Two-Factor Authentication
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Add an extra layer of security to your account
          </p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5">
          <div>
            <p className="font-bold text-sm text-slate-900 dark:text-slate-50">
              {twoFactorEnabled ? "2FA is enabled" : "2FA is disabled"}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {twoFactorEnabled
                ? "Your account is protected with two-factor authentication"
                : "Enable 2FA to secure your account with an authenticator app"}
            </p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={handleToggle2FA}
            disabled={isSaving}
          />
        </div>
      </Card>

      {/* Active Sessions */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="size-5 text-[#5a8c5a] dark:text-primary" />
            <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
              Active Sessions
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage your active sessions and connected devices
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5">
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-50">
                Current Session
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Chrome on Windows • Just now
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 rounded-full">
              Active
            </span>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-6 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
            <h3 className="font-serif text-lg font-black italic text-red-600 dark:text-red-400">
              Danger Zone
            </h3>
          </div>
          <p className="text-sm text-red-600/75 dark:text-red-400/75">
            Irreversible and destructive actions
          </p>
        </div>

        <Button
          variant="destructive"
          className="w-full h-11 rounded-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.12em]"
        >
          <Trash2 className="size-4 mr-2" />
          Delete Account
        </Button>
      </Card>
    </div>
  )
}
