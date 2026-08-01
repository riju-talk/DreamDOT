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
  "h-12 rounded-xl border-[#dfe6d8] bg-white/85 px-4 text-[#101611] placeholder:text-[#778471] focus-visible:ring-[#60d435] dark:border-[#f5f2e8]/12 dark:bg-[#060907]/75 dark:text-[#f5f2e8] dark:placeholder:text-[#7f907b] dark:focus-visible:ring-[#8cff4d]"

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
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7f0] text-[#4dbb21] dark:bg-[#090d0a] dark:text-[#8cff4d]">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f7f0] text-[#101611] dark:bg-[#090d0a] dark:text-[#f5f2e8]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,212,53,0.22),transparent_34%),linear-gradient(90deg,rgba(16,22,17,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(16,22,17,0.04)_1px,transparent_1px)] bg-[length:auto,72px_72px,72px_72px] dark:bg-[radial-gradient(circle_at_top_right,rgba(140,255,77,0.13),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.025)_1px,transparent_1px)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,247,240,0.08),#f5f7f0_76%)] dark:bg-[linear-gradient(180deg,rgba(9,13,10,0.08),#090d0a_76%)]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-8">
        <section className="mx-auto flex w-full max-w-xl flex-col">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="DreamDOT home">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#60d435] text-[#071006] dark:bg-[#8cff4d]">
                <Sparkles className="size-4" />
              </span>
              <span className="font-serif text-2xl font-black italic text-[#4dbb21] dark:text-[#8cff4d]">DreamDOT</span>
            </Link>
            <ModeToggle />
          </div>

          <div className="rounded-[2rem] border border-[#101611]/10 bg-white/82 p-5 shadow-[0_28px_100px_rgba(16,22,17,0.12)] backdrop-blur-2xl dark:border-[#f5f2e8]/10 dark:bg-[#111713]/88 dark:shadow-[0_28px_110px_rgba(0,0,0,0.38)] sm:p-7">
            <div className="mb-7">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#4dbb21] dark:text-[#8cff4d]">Return to the room</p>
              <h1 className="mt-3 font-serif text-5xl font-black italic leading-none sm:text-6xl">
                Welcome back.
              </h1>
              <p className="mt-4 text-sm leading-6 text-[#52604d] dark:text-[#aebdaa]">
                Sign in to publish, message collaborators, manage credits, and continue building your creator profile.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#263124] dark:text-[#dce7d4]">
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
                  <Label htmlFor="password" className="text-[#263124] dark:text-[#dce7d4]">
                    Password
                  </Label>
                  <Link href="/auth/register" className="text-xs font-bold text-[#4dbb21] hover:text-[#2f8615] dark:text-[#8cff4d] dark:hover:text-[#b1ff85]">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#64735f] transition-colors hover:text-[#4dbb21] dark:text-[#9faf9a] dark:hover:text-[#8cff4d]"
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
                className="h-12 w-full rounded-full bg-[#60d435] text-sm font-black uppercase tracking-[0.12em] text-[#071006] shadow-[0_0_32px_rgba(96,212,53,0.22)] hover:bg-[#7cec4e] dark:bg-[#8cff4d] dark:shadow-[0_0_32px_rgba(140,255,77,0.25)] dark:hover:bg-[#b1ff85]"
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

            <div className="mt-7 grid gap-3 border-t border-[#101611]/10 pt-5 text-center text-sm text-[#52604d] dark:border-[#f5f2e8]/10 dark:text-[#aebdaa] sm:grid-cols-2">
              <p>
                New to DreamDOT?{" "}
                <Link href="/auth/register" className="font-bold text-[#4dbb21] hover:text-[#2f8615] dark:text-[#8cff4d] dark:hover:text-[#b1ff85]">
                  Create account
                </Link>
              </p>
              <Link href="/feed" className="font-bold text-[#a36e00] hover:text-[#765000] dark:text-[#f0c15d] dark:hover:text-[#ffd88a]">
                Preview feed without signing in
              </Link>
            </div>
          </div>
        </section>

        <section className="hidden min-h-[660px] overflow-hidden rounded-[2rem] border border-[#60d435]/25 bg-white/75 p-6 shadow-[0_34px_120px_rgba(16,22,17,0.14)] backdrop-blur-xl dark:border-[#8cff4d]/18 dark:bg-[#101612]/86 dark:shadow-[0_40px_140px_rgba(0,0,0,0.42)] lg:block">
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] border border-[#101611]/8 bg-[#f8faf3] p-7 dark:border-[#f5f2e8]/8 dark:bg-[#060907]">
            <Image
              src={signinImage}
              alt=""
              fill
              priority
              sizes="44vw"
              className="object-cover opacity-78 dark:opacity-68"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(248,250,243,0.92),rgba(248,250,243,0.22)_50%,rgba(248,250,243,0.9))] dark:bg-[linear-gradient(135deg,rgba(6,9,7,0.9),rgba(6,9,7,0.18)_50%,rgba(6,9,7,0.9))]" />

            <div className="relative flex items-center justify-between text-xs font-black uppercase tracking-[0.24em] text-[#263124] dark:text-[#dce7d4]">
              <span>Feed Preview</span>
              <span className="text-[#4dbb21] dark:text-[#8cff4d]">Public</span>
            </div>

            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#4dbb21] dark:text-[#8cff4d]">No account required</p>
              <h2 className="mt-5 max-w-xl font-serif text-7xl font-black italic leading-[0.88]">
                Look around first.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-[#52604d] dark:text-[#c8d2c3]">
                The feed can now be opened as a preview. Sign in only when you want to create, buy, message, or save.
              </p>
            </div>

            <div className="relative grid gap-3">
              {previewNotes.map((note) => {
                const Icon = note.icon
                return (
                  <div key={note.label} className="flex items-center gap-3 border border-[#101611]/10 bg-white/72 p-3 backdrop-blur-xl dark:border-[#f5f2e8]/10 dark:bg-[#0a0f0c]/78">
                    <span className="flex size-9 items-center justify-center rounded-full bg-[#60d435]/12 text-[#4dbb21] dark:bg-[#8cff4d]/10 dark:text-[#8cff4d]">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm font-semibold text-[#263124] dark:text-[#dbe4d5]">{note.label}</span>
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
