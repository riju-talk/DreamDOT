"use client"

import Link from "next/link"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const errorMessages: Record<string, { title: string; description: string }> = {
  OAuthSignin: {
    title: "OAuth Sign In Error",
    description: "Unable to sign in with this provider. Please try again or use a different method.",
  },
  OAuthCallback: {
    title: "OAuth Callback Error",
    description: "The authentication provider returned an error. Please try again.",
  },
  OAuthCreateAccount: {
    title: "Unable to Create Account",
    description: "Could not create an account with the provided information.",
  },
  EmailCreateAccount: {
    title: "Email Account Creation Failed",
    description: "Unable to create an account with this email.",
  },
  Callback: {
    title: "Authentication Error",
    description: "An error occurred during authentication. Please try again.",
  },
  EmailSignInError: {
    title: "Email Sign In Failed",
    description: "Invalid email or password. Please check your credentials.",
  },
  SessionCallback: {
    title: "Session Error",
    description: "Unable to establish a session. Please sign in again.",
  },
  AccessDenied: {
    title: "Access Denied",
    description: "You do not have permission to access this resource.",
  },
  default: {
    title: "Authentication Error",
    description: "An unexpected error occurred. Please try again.",
  },
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center" />}>
      <AuthErrorContent />
    </Suspense>
  )
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "default"

  const errorInfo = errorMessages[error] || errorMessages.default

  return (
    <main className="flex min-h-screen items-center justify-center bg-white dark:bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#5a8c5a]/15 dark:border-primary/15 bg-white dark:bg-muted/20 p-8 shadow-sm backdrop-blur-sm">
          <div className="flex justify-center mb-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
              <AlertCircle className="size-6" />
            </div>
          </div>

          <h1 className="text-center font-serif text-2xl font-black italic text-slate-900 dark:text-slate-50">
            {errorInfo.title}
          </h1>

          <p className="mt-4 text-center text-sm leading-6 text-slate-600 dark:text-slate-400">
            {errorInfo.description}
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              asChild
              className="h-12 w-full rounded-full bg-[#5a8c5a] dark:bg-primary text-sm font-black uppercase tracking-[0.12em] text-white dark:text-primary-foreground shadow-sm dark:shadow-glow hover:bg-[#4a7c4a] dark:hover:bg-primary/90"
            >
              <Link href="/auth/signin">
                <ArrowLeft className="size-4" />
                Try Again
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 w-full rounded-full border-[#5a8c5a]/30 dark:border-primary/30 text-[#5a8c5a] dark:text-primary hover:bg-[#5a8c5a]/10 dark:hover:bg-primary/10"
            >
              <Link href="/">Return Home</Link>
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Error code: <span className="font-mono">{error}</span>
          </p>
        </div>
      </div>
    </main>
  )
}
