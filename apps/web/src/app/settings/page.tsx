"use client"
import Image from "next/image"
import { useState } from "react"
import { AuthenticatedLayout } from "../../../components/authenticated-layout"
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa"
import { Save, Settings } from "lucide-react"
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChangePassword } from "../../../components/change-passoword"
import { DeleteAccount } from "../../../components/delete-account"
import { PrivacySettings } from "../../../components/privacy-settings"
import { NotificationSettings } from "../../../components/notification-settings"
import { SecuritySettings } from "../../../components/security-settings"
import { IntegrationsSettings } from "../../../components/integrations-settings"
import { uploadImageToImageKit } from "@/lib/imagekitupload"
import { COUNTRIES } from "@/lib/countries"
import { Toaster, toast } from "sonner"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")

  return (
    <AuthenticatedLayout>
      <Toaster position="top-center" richColors />
      <div className="space-y-8">
        <div>
          <Badge variant="outline" className="mb-4 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-[0.3em] uppercase">
            <Settings className="mr-2 h-3 w-3" /> System
          </Badge>
          <h1 className="text-4xl font-serif tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account, privacy, and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-8 mt-8">
            <Card className="border-border/50 shadow-[var(--shadow-float)]">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Account Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              {/* Account content here - keep existing form */}
            </Card>

            <ChangePassword />
            <DeleteAccount />
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="mt-8">
            <PrivacySettings />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-8">
            <NotificationSettings />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-8">
            <SecuritySettings />
          </TabsContent>
        </Tabs>

        {/* Integrations Card */}
        <Card className="border-border/50 shadow-[var(--shadow-float)]">
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Connect external services</CardDescription>
          </CardHeader>
          <CardContent>
            <IntegrationsSettings />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
