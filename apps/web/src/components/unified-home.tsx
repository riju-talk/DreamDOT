"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, FileText, Image as ImageIcon, Mic, PenTool, Plus, Sparkles, ChevronDown, Menu, X, Check, Star, TrendingUp, Users, Heart } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AuthenticatedLayout } from "../../components/authenticated-layout"
import { ModeToggle } from "../../components/mode-toggle"

const MOCK_ITEMS = [
  { id: 1, type: "audio", title: "Quiet Draft Sessions", date: "2h ago", image: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1800&auto=format&fit=crop" },
  { id: 2, type: "article", title: "Notes on Deep Work for Creators", excerpt: "A practical writing and reflection framework that respects attention.", date: "5h ago" },
  { id: 3, type: "image", title: "Reading Table Study", date: "1d ago", image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1800&auto=format&fit=crop" },
  { id: 4, type: "image", title: "Ink and Paper", date: "2d ago", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1800&auto=format&fit=crop" },
  { id: 5, type: "article", title: "Storyboard to Script", excerpt: "How to move from scene ideas to production-ready narrative.", date: "3d ago" },
  { id: 6, type: "audio", title: "Ambient Concentration Mix", date: "4d ago", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1800&auto=format&fit=crop" },
]

const features = [
  { icon: PenTool, title: "Writing & Blogging", description: "Distraction-free editor with markdown support and seamless publishing." },
  { icon: Mic, title: "Audio Production", description: "Marketplace for samples, tracks, and audio content to fuel your next hit." },
  { icon: ImageIcon, title: "Visual Arts", description: "Showcase portfolios and sell high-resolution work to clients worldwide." },
  { icon: FileText, title: "Publishing", description: "From draft to distribution — reach your audience with one click." },
]

const stats = [
  { icon: Users, value: "2.4M+", label: "Active Creators" },
  { icon: TrendingUp, value: "$50M+", label: "Creator Earnings" },
  { icon: Star, value: "4.8", label: "Avg. Rating" },
  { icon: Heart, value: "95%", label: "Revenue Share" },
]

function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled ? "bg-background/80 backdrop-blur-3xl shadow-[var(--shadow-float)]" : "bg-transparent"
    )}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-xl p-2 bg-primary shadow-[var(--shadow-glow)] transition-transform duration-500 group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif italic text-xl tracking-tighter group-hover:text-primary transition-colors">DreamDOT</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "Creators", "Pricing"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" asChild className="text-sm">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild className="shadow-[var(--shadow-glow)]">
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden">
            <div className="px-6 py-4 space-y-3">
              {["Features", "Creators", "Pricing"].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                  {item}
                </Link>
              ))}
              <div className="pt-4 space-y-3 border-t border-border">
                <Button variant="outline" asChild className="w-full"><Link href="/auth/signin">Sign In</Link></Button>
                <Button asChild className="w-full"><Link href="/auth/register">Get Started</Link></Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export function UnifiedHome({ session }: { session: any }) {
  if (!session) {
    return <LandingPage />
  }

  return (
    <AuthenticatedLayout>
      <section className="glass-panel overflow-hidden rounded-3xl p-8 lg:p-12">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <Badge variant="outline" className="mb-4 bg-primary/10 border-primary/20 text-primary">
              <span className="mr-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
              Studio active
            </Badge>
            <h1 className="font-serif text-4xl leading-tight lg:text-5xl">
              Welcome back, {session.user.name?.split(" ")[0] || "Creator"}.
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Continue your work with clean composition, stable spacing, and distraction-free tools.
            </p>
          </div>
          <Link href="/create">
            <Button size="lg" className="h-13 w-full rounded-2xl px-8 sm:w-auto shadow-[var(--shadow-glow)]">
              <Plus className="mr-2 h-4 w-4" /> New project
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Your creator board</h2>
          <Link href="/items" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {MOCK_ITEMS.map((item) => (
            <article key={item.id} className="group flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:shadow-[var(--shadow-glow)] hover:border-primary/20">
              {item.image ? (
                <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <TypeIcon type={item.type} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">{item.type}</span>
                </div>
                <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors">{item.title}</h3>
                {item.excerpt ? (
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
                ) : null}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AuthenticatedLayout>
  )
}

function TypeIcon({ type }: { type: string }) {
  const className = "h-4 w-4 text-primary"
  return (
    <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
      {type === "audio" && <Mic className={className} />}
      {type === "image" && <ImageIcon className={className} />}
      {type === "article" && <FileText className={className} />}
      {type !== "audio" && type !== "image" && type !== "article" && <PenTool className={className} />}
    </div>
  )
}

function LandingPage() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-blob" />
          <div className="absolute top-[20%] right-[15%] w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="outline" className="mb-8 px-5 py-2 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-[0.3em] uppercase">
              The Operating System for Creativity
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.9]"
          >
            Craft Your
            <br />
            <span className="italic mt-2 block text-gradient">Story.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto font-light leading-relaxed"
          >
            A weightless digital atelier for writers, artists, and musicians.
            Focus on the craft. We handle the gravity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth/register">
              <Button size="lg" className="h-14 px-10 rounded-full text-base shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-lg)] transition-all duration-500">
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/feed">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-base border-foreground/20">
                Explore the Feed
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> No credit card</div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Free for creators</div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 95% revenue share</div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-16">
            <ChevronDown className="h-6 w-6 mx-auto text-muted-foreground/40 animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-[0.3em] uppercase">Features</Badge>
            <h2 className="font-serif text-4xl lg:text-5xl">Everything you need to create</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Tools designed for serious creators who value craft and quality.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:shadow-[var(--shadow-glow)] hover:border-primary/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-12 lg:p-16"
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-[0.3em] uppercase">Get Started</Badge>
            <h2 className="font-serif text-4xl lg:text-5xl leading-tight">
              Ready to build your <span className="text-gradient">dream studio</span>?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Join thousands of creators already using DreamDOT. Free to start, premium when you grow.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="h-14 px-10 rounded-full text-base shadow-[var(--shadow-glow)]">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-xl p-2 bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif italic text-lg tracking-tighter">DreamDOT</span>
            </Link>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Support</Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 DreamDOT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
