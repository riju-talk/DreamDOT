'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">500</h1>
          <p className="text-2xl font-semibold text-muted-foreground">Something went wrong</p>
        </div>

        <p className="text-muted-foreground max-w-md mx-auto">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={() => reset()} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
