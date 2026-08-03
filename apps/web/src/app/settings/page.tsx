"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Settings, Lock, Bell, Eye, Link2, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { AccountSettingsTab } from "@/components/settings/account-tab"
import { SecuritySettingsTab } from "@/components/settings/security-tab"
import { PrivacySettingsTab } from "@/components/settings/privacy-tab"
import { NotificationsSettingsTab } from "@/components/settings/notifications-tab"
import { IntegrationsSettingsTab } from "@/components/settings/integrations-tab"
import { Toaster } from "sonner"

const tabs = [
  { value: "account", label: "Account", icon: Settings },
  { value: "security", label: "Security", icon: Shield },
  { value: "privacy", label: "Privacy", icon: Eye },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "integrations", label: "Integrations", icon: Link2 },
]

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState("account")

  if (status === "loading") {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (status === "unauthenticated") {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">You must be signed in to access settings.</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <Toaster position="top-center" richColors />
      
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="font-serif text-4xl font-black italic text-slate-900 dark:text-slate-50">
            Settings
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage your account, security, privacy, and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-white/50 dark:bg-muted/20 p-1 backdrop-blur-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 rounded-md data-[state=active]:bg-[#5a8c5a]/10 dark:data-[state=active]:bg-primary/10 data-[state=active]:text-[#5a8c5a] dark:data-[state=active]:text-primary text-xs font-bold uppercase transition-colors"
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <AccountSettingsTab user={session?.user} />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <SecuritySettingsTab user={session?.user} />
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <PrivacySettingsTab user={session?.user} />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <NotificationsSettingsTab user={session?.user} />
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <IntegrationsSettingsTab user={session?.user} />
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}
