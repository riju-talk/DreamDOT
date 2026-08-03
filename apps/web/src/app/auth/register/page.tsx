"use client"

import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signIn as nextAuthSignIn } from "next-auth/react"
import { ArrowRight, Check, Eye, EyeOff, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { OAuthButtons } from "../../../components/auth/OAuthButtons"
import { ModeToggle } from "@/components/mode-toggle"

const fieldClass =
  "h-12 rounded-xl border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 px-4 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary"

const registerImage =
  "https://res.cloudinary.com/diaoy8eua/image/upload/v1750944374/pexels-lukasfst-19635556_ywjhpd.jpg"

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
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-background text-[#5a8c5a] dark:text-primary">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen overflow-hidden bg-white dark:bg-background text-slate-900 dark:text-slate-50">
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(90,140,90,0.08),transparent_34%),linear-gradient(90deg,rgba(15,23,16,0.02)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,16,0.015)_1px,transparent_1px)] bg-[length:auto,72px_72px,72px_72px] dark:bg-[radial-gradient(circle_at_top_left,rgba(153,255,51,0.06),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.01)_1px,transparent_1px)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),#ffffff_76%)] dark:bg-[linear-gradient(180deg,rgba(15,23,16,0.02),var(--background)_76%)]" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:items-stretch lg:gap-8 lg:py-8">
          <section className="hidden overflow-hidden rounded-2xl border border-[#5a8c5a]/20 dark:border-primary/20 bg-white/80 dark:bg-muted/10 p-6 shadow-sm dark:shadow-glow lg:flex lg:flex-col">
            <div className="relative w-full flex-1 overflow-hidden rounded-xl border-2 border-[#5a8c5a] dark:border-primary shadow-[0_0_30px_rgba(90,140,90,0.3)] dark:shadow-[0_0_30px_rgba(153,255,51,0.4)]">
              <Image
                src={registerImage}
                alt="Build your creative room"
                fill
                priority
                sizes="50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <h1 className="font-serif text-5xl sm:text-6xl font-black italic text-center text-white leading-tight drop-shadow-lg">
                  Build your creative room
                </h1>
              </div>
            </div>
          </section>

          <section className="mx-auto flex w-full max-w-md flex-col justify-center">
            <div className="mb-6 flex items-center justify-between gap-4">
              <Link href="/" className="inline-flex items-center gap-2" aria-label="DreamDOT home">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#5a8c5a] dark:bg-primary text-white">
                  <Sparkles className="size-4" />
                </span>
                <span className="font-serif text-lg font-black italic text-[#5a8c5a] dark:text-primary hidden sm:inline">DreamDOT</span>
              </Link>
              <ModeToggle />
            </div>

            <div className="flex h-full flex-col rounded-2xl border border-[#5a8c5a]/15 dark:border-primary/15 bg-white dark:bg-muted/20 p-6 shadow-sm sm:p-8 backdrop-blur-sm">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5a8c5a] dark:text-primary">Join the dream</p>
                <h2 className="mt-2 font-serif text-3xl font-black italic leading-none text-slate-900 dark:text-slate-50">
                  Create account
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ada Lovelace"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${fieldClass} ${errors.name ? "border-red-400 dark:border-red-400" : ""}`}
                      required
                    />
                    {errors.name && <p className="text-xs text-red-500 dark:text-red-400">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="dreamsmith"
                      value={formData.username}
                      onChange={handleChange}
                      className={`${fieldClass} ${errors.username ? "border-red-400 dark:border-red-400" : ""}`}
                      required
                    />
                    {errors.username && <p className="text-xs text-red-500 dark:text-red-400">{errors.username}</p>}
                  </div>
                </div>

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
                    required
                  />
                  {errors.email && <p className="text-xs text-red-500 dark:text-red-400">{errors.email}</p>}
                </div>

                <Tooltip open={!pwdValid && formData.password.length > 0}>
                  <TooltipTrigger asChild>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-xs font-bold text-slate-900 dark:text-slate-100">
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
                          className={`${fieldClass} pr-11 ${errors.password ? "border-red-400 dark:border-red-400" : ""}`}
                          required
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
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start" className="bg-slate-900 dark:bg-slate-50 text-slate-50 dark:text-slate-900">
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
                      <Label htmlFor="confirmPwd" className="text-xs font-bold text-slate-900 dark:text-slate-100">
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
                          className={`${fieldClass} pr-11 ${errors.confirmPwd ? "border-red-400 dark:border-red-400" : ""}`}
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {matchValid ? (
                            <Check className="size-4 text-[#5a8c5a] dark:text-primary" />
                          ) : (
                            <Eye className="size-4 text-slate-400 opacity-45" />
                          )}
                        </span>
                      </div>
                      {errors.confirmPwd && <p className="text-xs text-red-500 dark:text-red-400">{errors.confirmPwd}</p>}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start" className="bg-slate-900 dark:bg-slate-50 text-slate-50 dark:text-slate-900">
                    Passwords do not match
                  </TooltipContent>
                </Tooltip>

                <Button
                  type="submit"
                  className="h-12 w-full rounded-full bg-[#5a8c5a] dark:bg-primary text-sm font-black uppercase tracking-[0.12em] text-white dark:text-primary-foreground shadow-sm dark:shadow-glow hover:bg-[#4a7c4a] dark:hover:bg-primary/90"
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

              <div className="mt-5">
                <OAuthButtons
                  isLoading={isLoading}
                  googleEnabled={googleEnabled}
                  githubEnabled={githubEnabled}
                  discordEnabled={discordEnabled}
                  mode="signup"
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#5a8c5a]/10 dark:border-primary/10 pt-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                <p>
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-[#5a8c5a] hover:text-[#4a7c4a] dark:text-primary dark:hover:text-primary/80">
                    Sign in
                  </Link>
                </p>
                <Link href="/feed" className="text-[#5a8c5a] hover:text-[#4a7c4a] dark:text-primary dark:hover:text-primary/80">
                  Browse as guest
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </TooltipProvider>
  )
}
