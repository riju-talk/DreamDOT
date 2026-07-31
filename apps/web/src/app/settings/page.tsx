"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
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
import { ChangePassword } from "../../../components/change-passoword"
import { DeleteAccount } from "../../../components/delete-account"
import { uploadImageToImageKit } from "@/lib/imagekitupload"
import { COUNTRIES } from "@/lib/countries"

import { Toaster, toast } from "sonner"

export default function SettingsPage() {
  const [form, setForm] = useState({
    username: "",
    display_name: "",
    bio: "",
    dob: "",
    country: "",
    website: "",
  })

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [socialLinks, setSocialLinks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/settings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          const profile = data.profile || {}

          setForm({
            username: profile.username || "",
            display_name: profile.display_name || "",
            bio: profile.bio || "",
            dob: profile.dob?.split("T")[0] || "",
            country: profile.country || "",
            website: profile.website || "",
          })
          setAvatarUrl(profile.avatar_url || null)
          setBannerUrl(profile.banner_url || null)
          setSocialLinks(Array.isArray(profile.social_links) ? profile.social_links : [])
        } else {
          toast.error("Failed to load profile")
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        toast.error("Error loading profile")
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    folder: "avatar" | "banner"
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImageToImageKit(file, folder)
    if (url) {
      folder === "avatar" ? setAvatarUrl(url) : setBannerUrl(url)
    }
  }

  function addLink() {
    if (socialLinks.length < 4) {
      setSocialLinks([...socialLinks, ""])
    }
  }

  function updateLink(idx: number, val: string) {
    setSocialLinks(socialLinks.map((l, i) => (i === idx ? val : l)))
  }

  function removeLink(idx: number) {
    setSocialLinks(socialLinks.filter((_, i) => i !== idx))
  }

  async function handleSaveChanges() {
    try {
      setIsSaving(true)
      const token = localStorage.getItem("token")
      const data: Record<string, any> = {}
      const fields: string[] = []

      Object.entries(form).forEach(([key, value]) => {
        if (value?.toString().trim() !== "") {
          data[key] = value
          fields.push(key)
        }
      })

      if (avatarUrl) {
        data.avatar_url = avatarUrl
        fields.push("avatar_url")
      }
      if (bannerUrl) {
        data.banner_url = bannerUrl
        fields.push("banner_url")
      }

      const filteredLinks = socialLinks.filter((l) => l.trim() !== "")
      if (filteredLinks.length) {
        data.social_links = filteredLinks
        fields.push("social_links")
      }

      const payload = { fields, data }

      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (res.ok) {
        toast.success("Profile updated successfully!")
        if (json.profile) {
          setForm({
            username: json.profile.username || "",
            display_name: json.profile.display_name || "",
            bio: json.profile.bio || "",
            dob: json.profile.dob?.split("T")[0] || "",
            country: json.profile.country || "",
            website: json.profile.website || "",
          })
          setAvatarUrl(json.profile.avatar_url || null)
          setBannerUrl(json.profile.banner_url || null)
          setSocialLinks(json.profile.social_links || [])
        }
      } else {
        toast.error("Error: " + json.error)
      }
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Card className="border-border/50">
              <CardHeader>
                <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <Toaster position="top-center" richColors />
      <div className="space-y-8">
        <div>
          <Badge variant="outline" className="mb-4 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-[0.3em] uppercase">
            <Settings className="mr-2 h-3 w-3" /> System
          </Badge>
          <h1 className="text-4xl font-serif tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account details and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="border-border/50 shadow-[var(--shadow-float)] sticky top-6">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xl font-bold overflow-hidden">
                    {avatarUrl === 'loading' ? (
                      <div className="w-full h-full flex items-center justify-center animate-pulse text-xs">Uploading...</div>
                    ) : avatarUrl ? (
                      <Image 
                        src={avatarUrl} 
                        alt="Avatar" 
                        width={56} 
                        height={56} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span>{form.display_name?.charAt(0)?.toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{form.display_name}</h3>
                    <p className="text-xs text-muted-foreground">{form.username}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <Card className="border-border/50 shadow-[var(--shadow-float)]">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Account Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field id="username" label="Username" value={form.username}
                    onChange={(v) => setForm({ ...form, username: v })} />
                  <Field id="display_name" label="Display Name" value={form.display_name}
                    onChange={(v) => setForm({ ...form, display_name: v })} />
                  <Field id="bio" label="Bio" textarea value={form.bio}
                    onChange={(v) => setForm({ ...form, bio: v })} />
                  <Field id="dob" label="Date of Birth" type="date" value={form.dob}
                    onChange={(v) => setForm({ ...form, dob: v })} />
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={form.country}
                      onValueChange={(val: string) => setForm({ ...form, country: val })}
                    >
                      <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Field id="website" label="Website" type="url" value={form.website}
                    onChange={(v) => setForm({ ...form, website: v })} />
                  <AvatarUpload label="Upload Avatar" imageUrl={avatarUrl} onUpload={(e) => handleImageUpload(e, "avatar")} />
                  <BannerUpload label="Upload Banner" imageUrl={bannerUrl} onUpload={(e) => handleImageUpload(e, "banner")} />
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                  {socialLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <Input
                        value={link}
                        placeholder="https://..."
                        onChange={(e) => updateLink(idx, e.target.value)}
                      />
                      <Button variant="outline" size="sm" onClick={() => removeLink(idx)}>
                        <FaTrash />
                      </Button>
                    </div>
                  ))}
                  {socialLinks.length < 4 && (
                    <Button variant="ghost" size="sm" onClick={addLink} className="mt-2">
                      <FaPlus className="mr-2" /> Add link
                    </Button>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()} 
                  disabled={isSaving || isLoading}
                  className="gap-2"
                >
                  <FaTimes /> Cancel
                </Button>
                <Button 
                  onClick={handleSaveChanges} 
                  disabled={isSaving || isLoading}
                  className="gap-2"
                >
                  <Save /> {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>

            <ChangePassword />
            <DeleteAccount />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

function Field({
  id, label, type = "text", textarea = false,
  value, onChange
}: {
  id: string, label: string, value: string,
  onChange: (val: string) => void,
  type?: string, textarea?: boolean
}) {
  return (
    <div className="space-y-2 md:col-span-1">
      <Label htmlFor={id}>{label}</Label>
      {textarea ? (
        <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  )
}

function BannerUpload({
  label, imageUrl, onUpload
}: {
  label: string, imageUrl: string | null,
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative w-full h-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg overflow-hidden">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={label} 
            fill
            className="object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white text-sm">
            No banner uploaded
          </div>
        )}
      </div>
      <input type="file" accept="image/*" onChange={onUpload} className="text-sm" />
    </div>
  )
}

function AvatarUpload({
  label, imageUrl, onUpload
}: {
  label: string, imageUrl: string | null,
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={label} 
            fill
            className="object-cover" 
          />
        ) : (
          <span className="text-white text-2xl font-bold">?</span>
        )}
      </div>
      <input type="file" accept="image/*" onChange={onUpload} className="text-sm" />
    </div>
  )
}
