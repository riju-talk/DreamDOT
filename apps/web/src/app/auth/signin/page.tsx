"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signIn as nextAuthSignIn, SignInResponse } from "next-auth/react"
import { ArrowRight, Eye, EyeOff, Loader2, MessageSquareText, Search, Sparkles, WalletCards } from "lucide-react"
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
  "h-12 rounded-xl border-emerald-200 dark:border-emerald-900/30 bg-white/85 px-4 text-slate-900 placeholder:text-slate-500 focus-visible:ring-emerald-500 dark:bg-slate-950/75 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus-visible:ring-emerald-600"

const signinImage =
  "https://res.cloudinary.com/diaoy8eua/image/upload/v1750937757/pexels-artem-yellow-422929671-15157857_qqkdym.jpg"

const previewNotes = [
  { label: "Browse public creator drops", icon: Search },
  { label: "See the social feed preview", icon: MessageSquareText },
  { label: "Return when you are ready to publish or buy", icon: WalletCards },
]

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
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-400">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,118,86,0.12),transparent_34%),linear-gradient(90deg,rgba(15,23,16,0.03)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,16,0.025)_1px,transparent_1px)] bg-[length:auto,72px_72px,72px_72px] dark:bg-[radial-gradient(circle_at_top_right,rgba(34,180,125,0.08),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.015)_1px,transparent_1px)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),#ffffff_76%)] dark:bg-[linear-gradient(180deg,rgba(15,23,16,0.04),#0f1710_76%)]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-8">
        <section className="mx-auto flex w-full max-w-xl flex-col">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="DreamDOT home">
              <span className="flex size-9 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 text-white">
                <Sparkles className="size-4" />
              </span>
              <span className="font-serif text-2xl font-black italic text-emerald-700 dark:text-emerald-400">DreamDOT</span>
            </Link>
            <ModeToggle />
          </div>

          <div className="rounded-[2rem] border border-slate-200/40 dark:border-slate-700/40 bg-white/82 dark:bg-slate-900/88 p-5 shadow-[0_28px_100px_rgba(15,23,16,0.12)] dark:shadow-[0_28px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-7">
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-400">Return to the room</p>
              <h1 className="mt-3 font-serif text-5xl font-black italic leading-none sm:text-6xl">
                Welcome back.
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Sign in to publish, message collaborators, manage credits, and continue building your creator profile.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-900 dark:text-slate-100">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${fieldClass} ${errors.email ? "border-red-400" : ""}`}
                  autoComplete="email"
                />
                {errors.email && <p className="text-xs text-red-300">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password" className="text-slate-900 dark:text-slate-100">
                    Password
                  </Label>
                  <Link href="/auth/register" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">
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
                    className={`${fieldClass} pr-11 ${errors.password ? "border-red-400" : ""}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-300">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-emerald-600 dark:bg-emerald-500 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_0_32px_rgba(34,118,86,0.22)] hover:bg-emerald-700 dark:hover:bg-emerald-600"
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

            <div className="mt-8">
              <OAuthButtons
                isLoading={isLoading}
                googleEnabled={googleEnabled}
                githubEnabled={githubEnabled}
                discordEnabled={discordEnabled}
                mode="signin"
              />
            </div>

            <div className="mt-7 grid gap-3 border-t border-slate-200/40 dark:border-slate-700/40 pt-5 text-center text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2">
              <p>
                New to DreamDOT?{" "}
                <Link href="/auth/register" className="font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">
                  Create account
                </Link>
              </p>
              <Link href="/feed" className="font-bold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300">
                Preview feed without signing in
              </Link>
            </div>
          </div>
        </section>

        <section className="hidden min-h-[660px] overflow-hidden rounded-[2rem] border border-emerald-200 dark:border-emerald-900/30 bg-white/75 dark:bg-slate-900/86 p-6 shadow-[0_34px_120px_rgba(15,23,16,0.14)] dark:shadow-[0_40px_140px_rgba(0,0,0,0.42)] backdrop-blur-xl lg:block">
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] border border-slate-200/40 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-900 p-7">
            <Image
              src={signinImage}
              alt=""
              fill
              priority
              sizes="44vw"
              className="object-cover opacity-78 dark:opacity-68"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(248,250,243,0.92),rgba(248,250,243,0.22)_50%,rgba(248,250,243,0.9))] dark:bg-[linear-gradient(135deg,rgba(15,23,16,0.9),rgba(15,23,16,0.18)_50%,rgba(15,23,16,0.9))]" />

            <div className="relative flex items-center justify-between text-xs font-black uppercase tracking-[0.24em] text-slate-900 dark:text-slate-100">
              <span>Feed Preview</span>
              <span className="text-emerald-700 dark:text-emerald-400">Public</span>
            </div>

            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-400">No account required</p>
              <h2 className="mt-5 max-w-xl font-serif text-7xl font-black italic leading-[0.88]">
                Look around first.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
                The feed can now be opened as a preview. Sign in only when you want to create, buy, message, or save.
              </p>
            </div>

            <div className="relative grid gap-3">
              {previewNotes.map((note) => {
                const Icon = note.icon
                return (
                  <div key={note.label} className="flex items-center gap-3 border border-slate-200/40 dark:border-slate-700/40 bg-white/72 dark:bg-slate-800/78 p-3 backdrop-blur-xl">
                    <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{note.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
