"use client"

import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signIn as nextAuthSignIn } from "next-auth/react"
import { ArrowRight, Check, Eye, EyeOff, Loader2, PenLine, ShieldCheck, Sparkles, WalletCards } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { OAuthButtons } from "../../../components/auth/OAuthButtons"
import { ModeToggle } from "@/components/mode-toggle"

const fieldClass =
  "h-12 rounded-xl border-emerald-200 dark:border-emerald-900/30 bg-white/85 px-4 text-slate-900 placeholder:text-slate-500 focus-visible:ring-emerald-500 dark:bg-slate-950/75 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus-visible:ring-emerald-600"

const registerImage =
  "https://res.cloudinary.com/diaoy8eua/image/upload/v1750944374/pexels-lukasfst-19635556_ywjhpd.jpg"

const perks = [
  { label: "Publish writing, art, audio, video, and research", icon: PenLine },
  { label: "Open a direct audience room with messages", icon: Sparkles },
  { label: "Sell with credit-powered creator economics", icon: WalletCards },
  { label: "Control visibility before every release", icon: ShieldCheck },
]

export default function RegisterPage() {
  const { status } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPwd: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof formData>>({})

  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true"
  const githubEnabled = process.env.NEXT_PUBLIC_GITHUB_OAUTH_ENABLED === "true"
  const discordEnabled = process.env.NEXT_PUBLIC_DISCORD_OAUTH_ENABLED === "true"

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/feed")
    }
  }, [status, router])

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return false
    if (!/[0-9]/.test(pwd)) return false
    if (!/[A-Z]/.test(pwd)) return false
    if (!/[^A-Za-z0-9_]/.test(pwd)) return false
    return true
  }

  const pwdValid = useMemo(() => validatePassword(formData.password), [formData.password])
  const matchValid = useMemo(
    () => formData.password.length > 0 && formData.password === formData.confirmPwd,
    [formData.password, formData.confirmPwd]
  )

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password does not meet requirements"
    }
    if (!formData.confirmPwd) {
      newErrors.confirmPwd = "Please confirm your password"
    } else if (formData.password !== formData.confirmPwd) {
      newErrors.confirmPwd = "Passwords do not match"
    }

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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          username: formData.username.trim(),
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      const result = await nextAuthSignIn("credentials", {
        redirect: false,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      if (result?.ok) {
        toast.success("Welcome to DreamDOT!", {
          description: "Your account has been created and you are now signed in.",
        })
        router.push("/feed")
      } else {
        throw new Error("Account created but auto sign-in failed. Please sign in manually.")
      }
    } catch (err: unknown) {
      console.error("Registration error:", err)
      const errorMessage = err instanceof Error ? err.message : "Something went wrong during registration"
      toast.error("Registration failed", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-400">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,118,86,0.12),transparent_34%),linear-gradient(90deg,rgba(15,23,16,0.03)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,16,0.025)_1px,transparent_1px)] bg-[length:auto,72px_72px,72px_72px] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,180,125,0.08),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.015)_1px,transparent_1px)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),#ffffff_76%)] dark:bg-[linear-gradient(180deg,rgba(15,23,16,0.04),#0f1710_76%)]" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch lg:py-8">
          <section className="hidden min-h-screen overflow-hidden rounded-[2rem] border border-emerald-200 dark:border-emerald-900/30 bg-white/75 dark:bg-slate-900/86 p-6 shadow-[0_34px_120px_rgba(15,23,16,0.14)] dark:shadow-[0_40px_140px_rgba(0,0,0,0.42)] backdrop-blur-xl lg:block">
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/40 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-900">
              <Image
                src={registerImage}
                alt=""
                fill
                priority
                sizes="46vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(248,250,243,0.92),rgba(248,250,243,0.3)_48%,rgba(248,250,243,0.9))] dark:bg-[linear-gradient(135deg,rgba(15,23,16,0.86),rgba(15,23,16,0.28)_48%,rgba(15,23,16,0.9)]" />
              <div className="relative flex items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 text-white">
                    <Sparkles className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-400">Creator access</p>
                    <p className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-100">Open your atelier.</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <h1 className="max-w-xl font-serif text-5xl font-black italic leading-[0.88] text-slate-900 dark:text-slate-100">
                  Build your creative room
                </h1>
                <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Create one identity for publishing, discovery, community, and credits.
                </p>
              </div>

              <div className="relative z-10 grid gap-3">
                {perks.map((perk) => {
                  const Icon = perk.icon
                  return (
                    <div key={perk.label} className="flex items-center gap-3 border border-slate-200/40 dark:border-slate-700/40 bg-white/72 dark:bg-slate-800/78 p-3 backdrop-blur-xl">
                      <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                        <Icon className="size-4" />
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{perk.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="mx-auto flex w-full max-w-xl flex-col">
            <div className="rounded-[2rem] border border-slate-200/40 dark:border-slate-700/40 bg-white/82 dark:bg-slate-900/88 p-5 shadow-[0_28px_100px_rgba(15,23,16,0.12)] dark:shadow-[0_28px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <Link href="/" className="inline-flex items-center gap-2" aria-label="DreamDOT home">
                  <span className="flex size-8 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 text-white">
                    <Sparkles className="size-4" />
                  </span>
                  <span className="font-serif text-lg font-black italic text-emerald-700 dark:text-emerald-400 hidden sm:inline">DreamDOT</span>
                </Link>
                <ModeToggle />
              </div>

              <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-400">Join the dream</p>
                <h2 className="mt-3 font-serif text-4xl font-black italic leading-none sm:text-5xl">
                  Create your account
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Start publishing, selling, and building a direct creative room around your work.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-900 dark:text-slate-100">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ada Lovelace"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${fieldClass} ${errors.name ? "border-red-400" : ""}`}
                      required
                    />
                    {errors.name && <p className="text-xs text-red-300">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-900 dark:text-slate-100">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="dreamsmith"
                      value={formData.username}
                      onChange={handleChange}
                      className={`${fieldClass} ${errors.username ? "border-red-400" : ""}`}
                      required
                    />
                    {errors.username && <p className="text-xs text-red-300">{errors.username}</p>}
                  </div>
                </div>

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
                    required
                  />
                  {errors.email && <p className="text-xs text-red-300">{errors.email}</p>}
                </div>

                <Tooltip open={!pwdValid && formData.password.length > 0}>
                  <TooltipTrigger asChild>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-900 dark:text-slate-100">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`${fieldClass} pr-11 ${errors.password ? "border-red-400" : ""}`}
                          required
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
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <ul className="space-y-1 text-xs">
                      <li>At least 8 characters</li>
                      <li>One uppercase letter</li>
                      <li>One number</li>
                      <li>One special character</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>

                <Tooltip open={!matchValid && formData.confirmPwd.length > 0}>
                  <TooltipTrigger asChild>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPwd" className="text-slate-900 dark:text-slate-100">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPwd"
                          name="confirmPwd"
                          type={showPassword ? "text" : "password"}
                          placeholder="Repeat your password"
                          value={formData.confirmPwd}
                          onChange={handleChange}
                          className={`${fieldClass} pr-11 ${errors.confirmPwd ? "border-red-400" : ""}`}
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400">
                          {matchValid ? <Check className="size-4" /> : <Eye className="size-4 opacity-45" />}
                        </span>
                      </div>
                      {errors.confirmPwd && <p className="text-xs text-red-300">{errors.confirmPwd}</p>}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    Passwords do not match
                  </TooltipContent>
                </Tooltip>

                <Button
                  type="submit"
                  className="h-12 w-full rounded-full bg-emerald-600 dark:bg-emerald-500 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_0_32px_rgba(34,118,86,0.22)] hover:bg-emerald-700 dark:hover:bg-emerald-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating
                    </>
                  ) : (
                    <>
                      Create Account
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
                  mode="signup"
                />
              </div>

              <div className="mt-7 grid gap-3 border-t border-slate-200/40 dark:border-slate-700/40 pt-5 text-center text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2">
                <p>
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">
                    Sign in
                  </Link>
                </p>
                <Link href="/feed" className="font-bold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300">
                  Preview the feed
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </TooltipProvider>
  )
}
