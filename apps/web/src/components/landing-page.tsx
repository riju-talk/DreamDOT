"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpenText,
  Eye,
  LockKeyhole,
  MessageSquareText,
  Mic2,
  Palette,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  Video,
  WalletCards,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Publish", href: "#publish" },
  { label: "Discover", href: "#discover" },
  { label: "Earn", href: "#earn" },
  { label: "Trust", href: "#trust" },
]

const creatorModes = [
  { label: "Writing", icon: PenLine },
  { label: "Illustration", icon: Palette },
  { label: "Audio", icon: Mic2 },
  { label: "Video", icon: Video },
  { label: "Research", icon: BookOpenText },
]

const archiveCards = [
  {
    index: "01",
    title: "Publish In Every Medium",
    body: "Long-form essays, image sets, audio, video, research drops, templates, and code all live inside one creator workspace.",
    icon: Sparkles,
  },
  {
    index: "02",
    title: "Find The Right Audience",
    body: "A unified feed, discover surface, trending topics, and marketplace routes turn finished work into something people can actually find.",
    icon: Search,
  },
  {
    index: "03",
    title: "Keep The Conversation Close",
    body: "Direct and group messaging bring collaborators, readers, and fans into the same orbit as the work.",
    icon: MessageSquareText,
  },
]

const economyStats = [
  { value: "95%", label: "creator-first revenue share" },
  { value: "50 MB", label: "validated media uploads" },
  { value: "4", label: "credit packages ready for checkout" },
  { value: "1", label: "profile for portfolio, feed, sales, and chat" },
]

const trustSignals = [
  {
    title: "Visibility Control",
    body: "Publish public, unlisted, or private work as each release demands.",
    icon: Eye,
  },
  {
    title: "Secure Payments",
    body: "Stripe checkout and idempotent webhooks back the credits rail.",
    icon: ShieldCheck,
  },
  {
    title: "Encrypted Future",
    body: "The messaging contract already supports ciphertext, nonce, and key rotation.",
    icon: LockKeyhole,
  },
]

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Publish", href: "#publish" },
      { label: "Discover", href: "#discover" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Analytics", href: "/analytics" },
    ],
  },
  {
    title: "Creator Tools",
    links: [
      { label: "Create", href: "/create" },
      { label: "Feed", href: "/feed" },
      { label: "Messages", href: "/messages" },
      { label: "Wallet", href: "/wallet" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Trust", href: "#trust" },
      { label: "Sign In", href: "/auth/signin" },
      { label: "Join", href: "/auth/register" },
    ],
  },
]

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-primary/10 blur-[160px]" />
        <div className="absolute -right-32 top-1/3 h-[35rem] w-[35rem] rounded-full bg-primary/5 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--background)_92%_transparent)_68%,var(--background))]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-[2rem] border border-border bg-card/80 px-4 shadow-[var(--shadow-float)] backdrop-blur-2xl sm:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="DreamDOT home">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
              <Sparkles className="size-4" />
            </span>
            <span className="font-serif text-xl font-black italic text-primary">DreamDOT</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="hidden h-10 rounded-full px-4 text-foreground hover:bg-foreground/10 hover:text-foreground sm:inline-flex"
            >
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button
              asChild
              className="h-10 rounded-full bg-primary px-5 text-xs font-black uppercase tracking-[0.12em] text-primary-foreground shadow-glow hover:bg-primary/90"
            >
              <Link href="/auth/register">Start</Link>
            </Button>
          </div>
        </nav>
      </header>

      <section className="relative z-10 px-4 pb-14 pt-28 sm:px-6 lg:pb-24">
        <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="mb-8 inline-flex items-center gap-3 border border-primary/25 bg-primary/10 px-4 py-2">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-black uppercase tracking-[0.28em] text-primary">
                Creator-first atelier
              </span>
            </div>

            <h1 className="max-w-4xl font-serif text-[clamp(4rem,12vw,10rem)] font-black italic leading-[0.78] tracking-normal text-foreground">
              Unbind
              <span className="block font-sans not-italic text-[clamp(3.4rem,10vw,8.8rem)] leading-[0.85] text-primary">
                the work.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              DreamDOT gives writers, artists, researchers, musicians, makers, and fans one place to publish,
              discover, talk, sell, and support creative work with credits.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-13 rounded-none bg-primary px-7 text-sm font-black uppercase tracking-[0.12em] text-primary-foreground shadow-glow hover:bg-primary/90"
              >
                <Link href="/auth/register">
                  Join The Atelier
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-13 rounded-none border-foreground/16 bg-foreground/5 px-7 text-sm font-black uppercase tracking-[0.12em] text-foreground hover:bg-foreground/10 hover:text-foreground"
              >
                <Link href="/auth/signin">Enter DreamDOT</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {creatorModes.map((mode) => {
                const Icon = mode.icon
                return (
                  <span
                    key={mode.label}
                    className="inline-flex items-center gap-2 border border-border bg-foreground/5 px-3 py-2 text-xs font-bold text-muted-foreground"
                  >
                    <Icon className="size-3.5 text-primary" />
                    {mode.label}
                  </span>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.12 }}
            className="relative min-h-[520px]"
            aria-hidden="true"
          >
            <div className="absolute inset-0 border border-primary/20 bg-card/80 p-4 shadow-[var(--shadow-glow-lg)] backdrop-blur-2xl">
              <div className="relative h-full overflow-hidden border border-border bg-muted/50">
                <Image
                  src="/dreamdot_hero.png"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 44vw, 92vw"
                  className="object-cover opacity-80 dark:opacity-70 dark:mix-blend-screen"
                />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--card)_85%,transparent),transparent_50%,color-mix(in_srgb,var(--card)_90%,transparent))]" />
                <div className="absolute inset-x-5 top-5 flex items-center justify-between text-[0.65rem] font-black uppercase tracking-[0.2em] text-foreground">
                  <span>Live Workspace</span>
                  <span className="text-primary">Credit Ready</span>
                </div>
                <div className="absolute inset-x-5 bottom-5 grid gap-3 sm:grid-cols-2">
                  <div className="border border-border bg-card/80 p-4 backdrop-blur-xl">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-primary">
                      Draft
                    </p>
                    <p className="mt-3 font-serif text-3xl font-black italic leading-none">Weightless Void</p>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      Serialized essay with visual notes, gated early access, and reader discussion.
                    </p>
                  </div>
                  <div className="border border-border bg-card/80 p-4 backdrop-blur-xl">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-primary">
                      Room
                    </p>
                    <p className="mt-3 font-serif text-3xl font-black italic leading-none">Signal Thread</p>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      Collaborators, fans, files, read state, and presence in one creator channel.
                    </p>
                  </div>
                </div>
                <div className="absolute right-7 top-24 w-44 bg-primary p-4 text-primary-foreground shadow-glow">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.18em]">Creator Share</p>
                  <p className="mt-2 text-5xl font-black leading-none">95%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="publish" className="relative z-10 px-4 py-12 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border border-border bg-card/80 p-6 sm:p-8 lg:p-10 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Archive 01</p>
              <h2 className="mt-9 max-w-lg font-serif text-5xl font-black italic leading-[0.92] text-foreground sm:text-7xl">
                One studio for every drop.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                The product doc is clear: DreamDOT is not just a blog, gallery, shop, or chat app. It is the
                connective tissue for creating, publishing, discovering, messaging, and earning from one identity.
              </p>
            </div>

            <div className="grid gap-5">
              {archiveCards.map((card) => {
                const Icon = card.icon
                return (
                  <motion.article
                    key={card.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="grid gap-5 border border-border bg-card/80 p-5 backdrop-blur-xl sm:grid-cols-[auto_1fr] sm:p-6"
                  >
                    <div className="flex size-14 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-primary">
                        Archive {card.index}
                      </p>
                      <h3 className="mt-2 font-serif text-3xl font-black italic leading-none text-foreground">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.body}</p>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="discover" className="relative z-10 px-4 py-12 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl border border-border bg-card/80 p-5 sm:p-8 lg:p-10 backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Archive 02</p>
              <h2 className="mt-8 font-serif text-5xl font-black italic leading-[0.92] text-foreground sm:text-7xl">
                Discovery that feels alive.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                New work moves through feeds, creator profiles, marketplace shelves, and private conversations
                instead of disappearing into a single timeline.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="min-h-72 border border-border bg-muted/50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-primary">Feed</span>
                  <Search className="size-4 text-chart-3" />
                </div>
                <div className="mt-8 space-y-4">
                  {["Long reads", "Visual worlds", "Research drops", "Creator picks"].map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center border border-primary/25 text-xs font-black text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm font-bold text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="min-h-72 overflow-hidden border border-border bg-muted/50">
                <div className="relative h-36">
                  <Image src="/dreamdot_hero.png" alt="" fill sizes="320px" className="object-cover opacity-80 dark:opacity-70" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--background)_95%,transparent))]" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Marketplace</p>
                  <h3 className="mt-4 font-serif text-3xl font-black italic leading-none">Neural Folio Kit</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Writing, illustration, audio, video, research, templates, and code can each become a paid item.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="earn" className="relative z-10 px-4 py-12 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Archive 03</p>
              <h2 className="mt-5 font-serif text-5xl font-black italic leading-[0.92] text-foreground sm:text-7xl">
                Earn without leaving the room.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">
              Credits, item pricing, top-ups, and transaction history form the monetization spine described in the PRD.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {economyStats.map((stat) => (
              <article key={stat.label} className="border border-border bg-card/80 p-6 backdrop-blur-xl">
                <p className="font-serif text-5xl font-black italic leading-none text-primary">{stat.value}</p>
                <p className="mt-5 text-sm font-bold leading-6 text-muted-foreground">{stat.label}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="border border-border bg-card/80 p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex size-14 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                <WalletCards className="size-6" />
              </div>
              <h3 className="mt-8 font-serif text-4xl font-black italic leading-none">Credit Wallet</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Fans top up credits through Stripe-backed packages. Creators price work, sell access, and track
                transaction history from the same product ecosystem.
              </p>
            </div>
            <div className="border border-border bg-card/80 p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex size-14 items-center justify-center border border-chart-3/40 bg-chart-3/10 text-chart-3">
                <BadgeDollarSign className="size-6" />
              </div>
              <h3 className="mt-8 font-serif text-4xl font-black italic leading-none">Creator Terms</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                DreamDOT leads with creator control: one profile, portfolio context, direct audience relationships,
                and the 95% revenue-share positioning from the product plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="relative z-10 px-4 py-12 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-3">
            {trustSignals.map((signal) => {
              const Icon = signal.icon
              return (
                <article key={signal.title} className="border border-border bg-card/80 p-6 sm:p-8 backdrop-blur-xl">
                  <Icon className="size-7 text-primary" />
                  <h3 className="mt-7 font-serif text-3xl font-black italic leading-none">{signal.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{signal.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-5xl border border-primary/25 bg-card/80 p-8 text-center shadow-[var(--shadow-glow-lg)] backdrop-blur-2xl sm:p-12">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Limited access</p>
          <h2 className="mt-6 font-serif text-5xl font-black italic leading-[0.92] text-foreground sm:text-7xl">
            Ready to craft?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Open the atelier, publish the first piece, and start building a direct creative economy around it.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-13 rounded-none bg-primary px-7 text-sm font-black uppercase tracking-[0.12em] text-primary-foreground shadow-glow hover:bg-primary/90"
            >
              <Link href="/auth/register">
                Start Creating
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-13 rounded-none border-foreground/16 bg-foreground/5 px-7 text-sm font-black uppercase tracking-[0.12em] text-foreground hover:bg-foreground/10 hover:text-foreground"
            >
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border bg-secondary/60 px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_1.75fr_0.9fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-3" aria-label="DreamDOT home">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
                  <Sparkles className="size-4" />
                </span>
                <span className="font-serif text-2xl font-black italic text-primary">DreamDOT</span>
              </Link>
              <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                A creator-first home for publishing, community, discovery, messaging, and credit-powered
                monetization.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Writing", "Visual Art", "Audio", "Video", "Research"].map((item) => (
                  <span
                    key={item}
                    className="border border-border bg-foreground/5 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                    {group.title}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border border-primary/25 bg-card/80 p-5 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">Atelier Access</p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Start with a profile, publish your first item, and bring your audience into the same creative room.
              </p>
              <Button
                asChild
                className="mt-6 h-11 rounded-full bg-primary px-5 text-xs font-black uppercase tracking-[0.12em] text-primary-foreground shadow-glow hover:bg-primary/90"
              >
                <Link href="/auth/register">
                  Open Studio
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-5 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>© 2026 DreamDOT. Built for the weightless creative.</p>
            <div className="flex flex-wrap gap-5 font-bold uppercase tracking-[0.16em]">
              <Link href="#trust" className="hover:text-primary">
                Privacy
              </Link>
              <Link href="#earn" className="hover:text-primary">
                Terms
              </Link>
              <Link href="/settings" className="hover:text-primary">
                Account
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
