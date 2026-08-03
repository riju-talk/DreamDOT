"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"

export default function SignOutPage() {
  useEffect(() => {
    signOut({ redirect: true, callbackUrl: "/" })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-background">
      <div className="text-center">
        <p className="text-slate-600 dark:text-slate-400">Signing you out...</p>
      </div>
    </div>
  )
}
