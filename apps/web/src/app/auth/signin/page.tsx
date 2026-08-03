"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signIn as nextAuthSignIn, SignInResponse } from "next-auth/react"
import { ArrowRight, Eye, EyeOff, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OAuthButtons } from "../../../components/auth/OAuthButtons"
import { ModeToggle } from "@/components/mode-toggle"

interface FormData {
  email: string
  password: string
}

const fieldClass =
  "h-12 rounded-xl border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 px-4 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary"

const signinImage =
  "https://res.cloudinary.com/diaoy8eua/image/upload/v1750937757/pexels-artem-yellow-422929671-15157857_qqkdym.jpg"

export default function SignInPage() {
  const { status } = useSession()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/feed")
    }
  }, [status, router])

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = (await nextAuthSignIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })) as SignInResponse | undefined

      if (result?.error) {
        toast.error("Sign in failed", {
          description: "Invalid credentials. Check your details and try again.",
        })
        return
      }

      if (result?.ok) {
        toast.success("Welcome back!", {
          description: "You have successfully signed in to DreamDOT.",
        })
        router.push("/feed")
      }
    } catch (err: unknown) {
      console.error("Sign in error:", err)
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again."
      toast.error("Sign in error", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true"
  const githubEnabled = process.env.NEXT_PUBLIC_GITHUB_OAUTH_ENABLED === "true"
  const discordEnabled = process.env.NEXT_PUBLIC_DISCORD_OAUTH_ENABLED === "true"

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-background text-[#5a8c5a] dark:text-primary">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white dark:bg-background text-slate-900 dark:text-slate-50">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(90,140,90,0.08),transparent_34%),linear-gradient(90deg,rgba(15,23,16,0.02)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,16,0.015)_1px,transparent_1px)] bg-[length:auto,72px_72px,72px_72px] dark:bg-[radial-gradient(circle_at_top_right,rgba(153,255,51,0.06),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.01)_1px,transparent_1px)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),#ffffff_76%)] dark:bg-[linear-gradient(180deg,rgba(15,23,16,0.02),var(--background)_76%)]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:items-stretch lg:gap-8 lg:py-10">
        <section className="mx-auto flex w-full max-w-md flex-col justify-center">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="DreamDOT home">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#5a8c5a] dark:bg-primary text-white">
                <Sparkles className="size-4" />
              </span>
              <span className="font-serif text-2xl font-black italic text-[#5a8c5a] dark:text-primary hidden sm:inline">DreamDOT</span>
            </Link>
            <ModeToggle />
          </div>

          <div className="flex h-full flex-col rounded-2xl border border-[#5a8c5a]/15 dark:border-primary/15 bg-white dark:bg-muted/20 p-6 shadow-sm sm:p-8 backdrop-blur-sm">
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5a8c5a] dark:text-primary">Return to the room</p>
              <h1 className="mt-3 font-serif text-4xl font-black italic leading-none text-slate-900 dark:text-slate-50">
                Welcome back
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Sign in to publish, message, manage credits, and continue building your creator profile.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${fieldClass} ${errors.email ? "border-red-400 dark:border-red-400" : ""}`}
                  autoComplete="email"
                />
                {errors.email && <p className="text-xs text-red-500 dark:text-red-400">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Password
                  </Label>
                  <Link href="/auth/register" className="text-xs font-bold text-[#5a8c5a] hover:text-[#4a7c4a] dark:text-primary dark:hover:text-primary/80">
                    Need access?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${fieldClass} pr-11 ${errors.password ? "border-red-400 dark:border-red-400" : ""}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 transition-colors hover:text-[#5a8c5a] dark:text-slate-400 dark:hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 dark:text-red-400">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-[#5a8c5a] dark:bg-primary text-sm font-black uppercase tracking-[0.12em] text-white dark:text-primary-foreground shadow-sm dark:shadow-glow hover:bg-[#4a7c4a] dark:hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing In
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <OAuthButtons
                isLoading={isLoading}
                googleEnabled={googleEnabled}
                githubEnabled={githubEnabled}
                discordEnabled={discordEnabled}
                mode="signin"
              />
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#5a8c5a]/10 dark:border-primary/10 pt-4 text-xs font-bold text-slate-600 dark:text-slate-400">
              <p>
                New to DreamDOT?{" "}
                <Link href="/auth/register" className="text-[#5a8c5a] hover:text-[#4a7c4a] dark:text-primary dark:hover:text-primary/80">
                  Create account
                </Link>
              </p>
              <Link href="/feed" className="text-[#5a8c5a] hover:text-[#4a7c4a] dark:text-primary dark:hover:text-primary/80">
                Preview
              </Link>
            </div>
          </div>
        </section>

        <section className="hidden overflow-hidden rounded-2xl border border-[#5a8c5a]/20 dark:border-primary/20 bg-white/80 dark:bg-muted/10 p-6 shadow-sm dark:shadow-glow lg:flex lg:flex-col">
          <div className="relative w-full flex-1 overflow-hidden rounded-xl border-2 border-[#5a8c5a] dark:border-primary shadow-[0_0_30px_rgba(90,140,90,0.3)] dark:shadow-[0_0_30px_rgba(153,255,51,0.4)]">
            <Image
              src={signinImage}
              alt="Welcome back to DreamDOT"
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <h2 className="font-serif text-5xl sm:text-6xl font-black italic text-center text-white leading-tight drop-shadow-lg">
                Look around first
              </h2>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
