"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Image as ImageIcon, Mic, PenTool, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AppSidebar } from "../../components/app-sidebar";
import { TopNav } from "../../components/top-nav";

const MOCK_ITEMS = [
  {
    id: 1,
    type: "audio",
    title: "Quiet Draft Sessions",
    date: "2h ago",
    image:
      "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1800&auto=format&fit=crop",
  },
  {
    id: 2,
    type: "article",
    title: "Notes on Deep Work for Creators",
    excerpt: "A practical writing and reflection framework that respects attention.",
    date: "5h ago",
  },
  {
    id: 3,
    type: "image",
    title: "Reading Table Study",
    date: "1d ago",
    image:
      "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1800&auto=format&fit=crop",
  },
  {
    id: 4,
    type: "image",
    title: "Ink and Paper",
    date: "2d ago",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1800&auto=format&fit=crop",
  },
  {
    id: 5,
    type: "article",
    title: "Storyboard to Script",
    excerpt: "How to move from scene ideas to production-ready narrative.",
    date: "3d ago",
  },
  {
    id: 6,
    type: "audio",
    title: "Ambient Concentration Mix",
    date: "4d ago",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1800&auto=format&fit=crop",
  },
];

export function UnifiedHome({ session }: { session: any }) {
  if (!session) {
    return (
      <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
        <TopNav />
        <main className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="relative w-full overflow-hidden rounded-3xl border border-foreground/10 bg-card p-6 shadow-[var(--shadow-float)] sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 mx-auto max-w-3xl text-center"
            >
              <p className="mb-5 inline-flex rounded-full border border-primary/25 bg-primary/10 px-4 py-1 text-[11px] font-medium tracking-[0.24em] text-primary uppercase">
                Built for serious creators
              </p>

              <h1 className="text-balance font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
                A calm studio for writing, sketching, reading, and shipping work.
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base md:text-lg">
                DreamDOT is your focused creative workspace: publish thoughtfully,
                collaborate intentionally, and keep your output organized.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/auth/register">
                  <Button size="lg" className="h-11 rounded-full px-6 text-sm sm:h-12">
                    Start creating
                  </Button>
                </Link>
                <Link href="/feed">
                  <Button size="lg" variant="outline" className="h-11 rounded-full px-6 text-sm sm:h-12">
                    Explore feed
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full overflow-x-clip bg-background">
        <AppSidebar />

        <SidebarInset className="min-w-0 flex-1 overflow-x-clip">
          <TopNav />

          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <section className="overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7 lg:p-10">
              <div className="grid items-start gap-6 lg:grid-cols-[1fr_auto]">
                <div className="min-w-0">
                  <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary" /> Studio status: active
                  </p>
                  <h1 className="text-balance font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                    Welcome back, {session.user.name?.split(" ")[0] || "Creator"}.
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                    Continue your work with clean composition, stable spacing, and distraction-free tools.
                  </p>
                </div>

                <Link href="/create" className="w-full lg:w-auto">
                  <Button className="h-12 w-full rounded-2xl px-6 text-sm sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> New project
                  </Button>
                </Link>
              </div>
            </section>

            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="font-serif text-2xl">Your creator board</h2>
                <Link href="/items" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {MOCK_ITEMS.map((item) => (
                  <article
                    key={item.id}
                    className="group flex h-full min-h-[250px] flex-col overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    {item.image ? (
                      <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <TypeIcon type={item.type} />
                        <span className="truncate text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                          {item.type}
                        </span>
                      </div>

                      <h3 className="text-pretty font-semibold leading-snug text-foreground">{item.title}</h3>

                      {item.excerpt ? (
                        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
                      ) : null}

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                        <Link href={`/items/${item.id}`}>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function TypeIcon({ type }: { type: string }) {
  const className = "h-4 w-4 text-primary";

  return (
    <div className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl bg-muted")}> 
      {type === "audio" && <Mic className={className} />}
      {type === "image" && <ImageIcon className={className} />}
      {type === "article" && <FileText className={className} />}
      {type !== "audio" && type !== "image" && type !== "article" && <PenTool className={className} />}
    </div>
  );
}
