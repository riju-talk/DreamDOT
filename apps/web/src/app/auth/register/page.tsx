"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signIn as nextAuthSignIn } from "next-auth/react"
import { Sparkles, Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { OAuthButtons } from "../../../components/auth/OAuthButtons"
import { ModeToggle } from "@/components/mode-toggle"

export default function RegisterPage() {
  const { data: session, status } = useSession()
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

  // OAuth feature flags from environment
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true"
  const githubEnabled = process.env.NEXT_PUBLIC_GITHUB_OAUTH_ENABLED === "true"
  const discordEnabled = process.env.NEXT_PUBLIC_DISCORD_OAUTH_ENABLED === "true"

  // redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/feed")
    }
  }, [status, router])

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }
    
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)

    try {
      // 1) Create account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        throw new Error(data.error || 'Registration failed')
      }

      // 2) Auto sign-in with new credentials
      const result = await nextAuthSignIn("credentials", {
        redirect: false,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      if (result?.ok) {
        toast.success("Welcome to DreamDOT!", {
          description: "Your account has been created and you are now signed in."
        })
        router.push("/feed")
      } else {
        throw new Error("Account created but auto sign-in failed. Please sign in manually.")
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      const errorMessage = err.message || 'Something went wrong during registration'
      toast.error("Registration failed", {
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex items-center justify-center bg-muted/30 dark:bg-[#1f2421] px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center rounded-xl shadow-lg overflow-hidden bg-white dark:bg-[#2a302d] dark:border dark:border-[#216869]">
          {/* Left: Illustration */}
          <div className="hidden lg:block">
            <img
              src="https://res.cloudinary.com/diaoy8eua/image/upload/v1750944374/pexels-lukasfst-19635556_ywjhpd.jpg"
              alt="DreamDOT visual"
              className="object-cover h-[800px] w-[600px]"
            />
          </div>

          {/* Right: Registration Card */}
          <Card className="w-full max-w-md rounded-none lg:rounded-l-none lg:rounded-r-xl shadow-none border-none bg-white dark:bg-[#2a302d]">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="relative overflow-hidden rounded-lg p-1.5 bg-primary">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-primary">DreamDOT</span>
              </div>
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>
                Join thousands of creators and start sharing your dreams
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? 'border-destructive' : ''}
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      className={errors.username ? 'border-destructive' : ''}
                      required
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive mt-1">{errors.username}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'border-destructive' : ''}
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <Tooltip open={!pwdValid && formData.password.length > 0}>
                    <TooltipTrigger asChild>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pr-10 ${errors.password ? 'border-destructive' : ''}`}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? 'Hide password' : 'Show password'}
                            </span>
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-destructive mt-1">{errors.password}</p>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start">
                      <ul className="text-xs list-disc list-inside space-y-1">
                        <li>At least 8 characters</li>
                        <li>One uppercase letter</li>
                        <li>One number</li>
                        <li>One special character</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>

                  {/* Confirm Password */}
                  <Tooltip open={!matchValid && formData.confirmPwd.length > 0}>
                    <TooltipTrigger asChild>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPwd">Re-enter Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPwd"
                            name="confirmPwd"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.confirmPwd}
                            onChange={handleChange}
                            className={`w-full pr-10 ${errors.confirmPwd ? 'border-destructive' : ''}`}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? 'Hide password' : 'Show password'}
                            </span>
                          </button>
                        </div>
                        {errors.confirmPwd && (
                          <p className="text-sm text-destructive mt-1">{errors.confirmPwd}</p>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start">
                      Passwords do not match
                    </TooltipContent>
                  </Tooltip>

                  <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
              </form>

              <OAuthButtons 
                isLoading={isLoading}
                googleEnabled={googleEnabled}
                githubEnabled={githubEnabled}
                discordEnabled={discordEnabled}
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-primary hover:underline font-medium"
                  tabIndex={isLoading ? -1 : 0}
                >
                  Sign in
                </Link>
              </p>
              <p className="text-sm text-center text-muted-foreground w-full">
                <Link 
                  href="/feed"
                  className="text-foreground/60 hover:text-foreground hover:underline font-medium transition-colors"
                >
                  Continue as Guest
                </Link>
              </p>
              <div className="flex justify-center pt-2 border-t border-border/50 w-full">
                <ModeToggle />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}