'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { AlertCircle, ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const homeLink = session?.user ? '/feed' : '/'

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground flex flex-col items-center justify-center px-4 py-12">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-[#5a8c5a]/10 dark:bg-primary/10 blur-[160px]" />
        <div className="absolute -right-32 top-1/3 h-[35rem] w-[35rem] rounded-full bg-[#5a8c5a]/5 dark:bg-primary/5 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--background)_92%_transparent)_68%,var(--background))]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 inline-flex items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#5a8c5a]/20 dark:bg-primary/20 rounded-full blur-2xl" />
              <div className="relative flex size-24 items-center justify-center rounded-full border border-[#5a8c5a]/30 dark:border-primary/30 bg-[#5a8c5a]/10 dark:bg-primary/10">
                <AlertCircle className="size-12 text-[#5a8c5a] dark:text-primary" />
              </div>
            </div>
          </motion.div>

          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 border border-[#5a8c5a]/25 dark:border-primary/25 bg-[#5a8c5a]/10 dark:bg-primary/10 px-4 py-2 mb-6">
              <span className="h-px w-8 bg-[#5a8c5a] dark:bg-primary" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#5a8c5a] dark:text-primary">
                Error 500
              </span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 font-serif text-5xl sm:text-6xl font-black italic leading-tight text-foreground"
          >
            Something slipped.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed"
          >
            An unexpected error occurred in the studio. Our team has been notified.
            {error?.digest && (
              <span className="block mt-3 text-sm text-muted-foreground/70 font-mono">
                Error ID: {error.digest}
              </span>
            )}
          </motion.p>

          {/* CTA Buttons */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <Button
                onClick={() => reset()}
                className="h-12 rounded-full bg-[#5a8c5a] dark:bg-primary px-7 text-sm font-black uppercase tracking-[0.12em] text-white dark:text-primary-foreground shadow-glow hover:bg-[#4a7c4a] dark:hover:bg-primary/90 transition-all"
              >
                Try Again
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-foreground/16 bg-foreground/5 px-7 text-sm font-black uppercase tracking-[0.12em] text-foreground dark:text-foreground dark:border-foreground/20 dark:bg-foreground/5 hover:bg-foreground/10 hover:text-foreground transition-all"
              >
                <Link href={homeLink}>
                  <Home className="size-4" />
                  {session?.user ? 'Back to Feed' : 'Go Home'}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
          )}

          {/* Additional Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground/50"
          >
            Still having trouble? Contact support
          </motion.p>
        </motion.div>
      </div>
    </main>
  )
}
