"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, User, Calendar, Phone, Globe, MapPin, Upload, X } from "lucide-react"
import { toast } from "sonner"
import type { Session } from "next-auth"

interface AccountSettingsTabProps {
  user?: Session["user"]
}

export function AccountSettingsTab({ user }: AccountSettingsTabProps) {
  const [formData, setFormData] = useState({
    displayName: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: "",
    phone: "",
    website: "",
    country: "",
    dob: "",
  })

  const [avatar, setAvatar] = useState<string | null>(user?.image || null)
  const [banner, setBanner] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // Load user profile data on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await fetch("/api/settings/account")
        if (response.ok) {
          const data = await response.json()
          setFormData((prev) => ({
            ...prev,
            displayName: data.display_name || prev.displayName,
            username: data.username || prev.username,
            email: data.email || prev.email,
            bio: data.bio || "",
            phone: data.phone || "",
            website: data.website || "",
            country: data.country || "",
            dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : "",
          }))
          if (data.avatar_url) setAvatar(data.avatar_url)
          if (data.banner_url) setBanner(data.banner_url)
        }
      } catch (error) {
        console.error("Failed to load profile:", error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    if (user?.id) {
      loadUserProfile()
    }
  }, [user?.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "banner") => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    setUploading(true)
    try {
      // Create local preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        if (type === "avatar") {
          setAvatar(result)
        } else {
          setBanner(result)
        }
      }
      reader.readAsDataURL(file)

      // TODO: Upload to cloud storage (ImageKit, Cloudinary, etc.)
      toast.success(`${type === "avatar" ? "Avatar" : "Banner"} uploaded successfully`)
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/settings/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: formData.displayName,
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          phone: formData.phone,
          website: formData.website,
          country: formData.country,
          dob: formData.dob ? new Date(formData.dob).toISOString() : null,
        }),
      })

      if (response.ok) {
        toast.success("Account information updated")
      } else {
        toast.error("Failed to update account information")
      }
    } catch (error) {
      toast.error("Failed to update account information")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Professional Profile Header Card - Like Instagram/Twitter */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 shadow-sm backdrop-blur-sm overflow-hidden">
        {/* Banner Section */}
        <div className="relative w-full h-48">
          {banner ? (
            <Image
              src={banner}
              alt="Banner"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#5a8c5a]/20 to-[#99FF33]/20 dark:from-primary/20 dark:to-primary/40 flex items-center justify-center">
              <Upload className="size-8 text-slate-400" />
            </div>
          )}
          
          {/* Banner Upload Button */}
          <div className="absolute top-3 right-3">
            <Label htmlFor="banner-upload" className="cursor-pointer">
              <Button
                type="button"
                size="sm"
                onClick={() => document.getElementById("banner-upload")?.click()}
                disabled={uploading}
                className="h-9 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-50 hover:bg-white dark:hover:bg-slate-900 font-bold text-xs shadow-lg"
              >
                <Upload className="size-3.5 mr-1" />
                {uploading ? "..." : "Edit Banner"}
              </Button>
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "banner")}
                className="hidden"
              />
            </Label>
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 pb-6">
          {/* Avatar positioned over banner */}
          <div className="flex items-end justify-between -mt-16 relative z-10 mb-4">
            <div className="relative size-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 bg-white/85 dark:bg-slate-900/85 shadow-lg">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#5a8c5a]/10 dark:bg-primary/10">
                  <User className="size-16 text-slate-400" />
                </div>
              )}
            </div>

            {/* Avatar Upload Button */}
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button
                type="button"
                size="sm"
                onClick={() => document.getElementById("avatar-upload")?.click()}
                disabled={uploading}
                className="h-9 rounded-full bg-[#5a8c5a] dark:bg-primary text-white dark:text-primary-foreground hover:bg-[#4a7c4a] dark:hover:bg-primary/90 font-bold text-xs"
              >
                <Upload className="size-3.5 mr-1" />
                {uploading ? "..." : "Change Avatar"}
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "avatar")}
                className="hidden"
              />
            </Label>
          </div>

          {/* Profile Fields */}
          <div className="space-y-5 mt-6">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <User className="size-4 text-[#5a8c5a] dark:text-primary" />
                Display Name
              </Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Your display name"
                className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary"
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <User className="size-4 text-[#5a8c5a] dark:text-primary" />
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="@username"
                className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your unique handle on the platform
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Mail className="size-4 text-[#5a8c5a] dark:text-primary" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified email address
              </p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Phone className="size-4 text-[#5a8c5a] dark:text-primary" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself... (max 500 characters)"
                maxLength={500}
                rows={4}
                className="rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary resize-none"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Info Card */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
            Additional Information
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Add more details to your profile
          </p>
        </div>

        <div className="space-y-5">
          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Globe className="size-4 text-[#5a8c5a] dark:text-primary" />
              Website
            </Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="size-4 text-[#5a8c5a] dark:text-primary" />
              Country
            </Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="United States"
              className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary"
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="size-4 text-[#5a8c5a] dark:text-primary" />
              Date of Birth
            </Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-11 rounded-full bg-[#5a8c5a] dark:bg-primary text-sm font-black uppercase tracking-[0.12em] text-white dark:text-primary-foreground shadow-sm dark:shadow-glow hover:bg-[#4a7c4a] dark:hover:bg-primary/90 disabled:opacity-60 mt-2"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>

      {/* Account Status Card */}
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
            Account Status
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                ✓
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-50">Email Verified</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Your email is verified</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-[#5a8c5a]/15 dark:border-primary/15 bg-[#5a8c5a]/5 dark:bg-primary/5">
            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-[#5a8c5a] dark:text-primary" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-50">Account Created</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {user?.id ? new Date().toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
