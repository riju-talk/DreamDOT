"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
    Plus, Mic, Image as ImageIcon, FileText,
    ArrowRight, PenTool, Music
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";
import { TopNav } from "../../components/top-nav";
import Link from "next/link";

const MOCK_ITEMS = [
    {
        id: 1,
        type: "audio",
        title: "Synthwave Explorations",
        date: "2h ago",
        image: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=2574&auto=format&fit=crop",
        height: "h-64",
    },
    {
        id: 2,
        type: "article",
        title: "The Future of Digital Ownership",
        excerpt: "Exploring how NFTs and blockchain are reshaping the creator economy...",
        date: "5h ago",
        height: "h-auto",
    },
    {
        id: 3,
        type: "image",
        title: "Neon Nights",
        date: "1d ago",
        image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2670&auto=format&fit=crop",
        height: "h-96",
    },
    {
        id: 4,
        type: "image",
        title: "Abstract Fluids",
        date: "2d ago",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        height: "h-72",
    },
    {
        id: 5,
        type: "audio",
        title: "Midnight Jazz",
        date: "3d ago",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2670&auto=format&fit=crop",
        height: "h-64",
    },
    {
        id: 6,
        type: "article",
        title: "Visual Design Systems",
        excerpt: "Why consistency is key to building a scalable brand identity in 2026.",
        date: "4d ago",
        height: "h-auto",
    },
];

export function UnifiedHome({ session }: { session: any }) {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    if (!session) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-background text-foreground overflow-x-hidden relative">
                <TopNav />
                {/* Refined Persistent Background Ambient Glows */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-50" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-50" />
                </div>

                <main className="flex-1 flex flex-col relative z-10 items-center justify-center p-6 md:p-12 overflow-hidden min-h-[calc(100vh-64px)]">
                    <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay">
                        <img
                            src="/dreamdot_hero.png"
                            alt="DreamDOT Fluid"
                            className="w-full h-full object-cover scale-105"
                        />
                    </div>

                    <div className="relative z-10 text-center max-w-6xl w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="inline-block mb-10"
                        >
                            <span className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-primary text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase backdrop-blur-md">
                                The Architecture of Imagination
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tighter leading-[0.9] mb-10 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40 select-none pb-2"
                        >
                            Unbind <br />
                            <span className="italic opacity-60">Thought.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ delay: 0.5, duration: 1.5 }}
                            className="text-lg md:text-2xl text-foreground font-light max-w-2xl mx-auto mb-14 leading-relaxed"
                        >
                            A weightless digital atelier for the visionaries. <br className="hidden md:block" />
                            Escape gravity. Craft with light and sound.
                        </motion.p>

                        <div className="flex flex-col items-center gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link href="/auth/register">
                                    <Button size="lg" className="h-16 px-10 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary text-sm font-mono tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_30px_-10px_rgba(140,221,129,0.4)] hover:shadow-[0_0_50px_-5px_rgba(140,221,129,0.6)] hover:scale-105 border border-white/10 backdrop-blur-xl">
                                        Get Started
                                    </Button>
                                </Link>
                                <Link href="/feed">
                                    <Button size="lg" variant="ghost" className="h-16 px-10 rounded-full text-foreground/70 hover:text-foreground text-sm font-mono tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/10 backdrop-blur-xl group">
                                        Continue as Guest
                                        <ArrowRight className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </Button>
                                </Link>
                            </div>
                            <p className="text-[10px] font-mono text-foreground/30 tracking-widest uppercase">
                                Transmission established / 2026
                            </p>
                        </div>
                    </div>

                    {/* Cinematic Overlays */}
                    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

                    <motion.div style={{ y: y1 }} className="absolute top-[10%] left-[5%] z-20 hidden 2xl:block opacity-70 hover:opacity-100 transition-opacity">
                        <FloatingCard icon={PenTool} label="Drafting" delay={0.2} />
                    </motion.div>
                    <motion.div style={{ y: y2 }} className="absolute bottom-[20%] right-[5%] z-20 hidden 2xl:block opacity-70 hover:opacity-100 transition-opacity">
                        <FloatingCard icon={Music} label="composition" delay={1.4} />
                    </motion.div>
                    <motion.div style={{ y: y1 }} className="absolute top-[30%] right-[10%] z-20 hidden lg:block 2xl:hidden opacity-70 hover:opacity-100 transition-opacity">
                         <FloatingCard icon={ImageIcon} label="visuals" delay={2.6} />
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <SidebarProvider defaultOpen>
            <div className="flex w-full h-screen overflow-hidden bg-background">
                <AppSidebar />
                <SidebarInset className="flex-1 overflow-auto relative">
                    <TopNav />

                    {/* Dashboard specific background glows */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-30" />
                        <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-20" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10"
                    >
                        {/* --- DASHBOARD MODE: THE ATELIER --- */}
                        <div className="p-8 md:p-20 max-w-[1600px] mx-auto space-y-24">
                            <header className="relative py-24 overflow-hidden rounded-[64px] bg-foreground/[0.02] backdrop-blur-3xl px-12 md:px-24 group">
                                {/* Sub-bg for header */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-glow animate-pulse" />
                                            <span className="text-[10px] font-mono text-primary tracking-[0.4em] uppercase">Creative Node: Active</span>
                                        </div>
                                        <h1 className="text-6xl md:text-8xl font-serif text-foreground tracking-tighter leading-[0.8] mb-8">
                                            Welcome, <br />
                                            <span className="text-foreground/20 italic">{session.user.name?.split(' ')[0] || 'Visionary'}.</span>
                                        </h1>
                                        <p className="text-lg md:text-xl text-foreground/40 font-light max-w-xl leading-relaxed">
                                            The studio is calibrated to your unique frequency. <br />
                                            Your latest artifacts are resonating across the cluster.
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center md:items-end gap-6">
                                        <Link href="/create">
                                            <Button size="lg" className="h-20 px-12 rounded-[32px] bg-primary/90 text-primary-foreground hover:bg-primary shadow-glow border border-white/5 transition-all duration-700 hover:scale-105 active:scale-95 group flex flex-col items-start justify-center gap-1 min-w-[280px]">
                                                <div className="flex items-center gap-3">
                                                  <span className="text-lg font-serif">Craft New Dream</span>
                                                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                                                </div>
                                                <span className="text-[10px] font-mono opacity-50 tracking-[0.2em] uppercase">Initiate Synthesis</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </header>

                            {/* Masonry: Curated Exhibition */}
                            <div className="space-y-16">
                                <div className="flex items-center justify-between px-4">
                                    <h2 className="text-4xl font-serif italic text-foreground/30">Your Artifacts.</h2>
                                    <div className="h-[1px] flex-1 mx-16 bg-foreground/[0.03]" />
                                    <Button variant="link" className="text-primary font-mono text-xs tracking-[0.3em] uppercase hover:opacity-100 opacity-40">The Archive</Button>
                                </div>

                                <div className="columns-1 md:columns-2 lg:columns-3 gap-12 space-y-12">
                                    {MOCK_ITEMS.map((item, i) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                            className="break-inside-avoid"
                                        >
                                            <div className="group relative bg-foreground/[0.01] backdrop-blur-3xl border border-foreground/[0.03] rounded-[48px] overflow-hidden hover:border-primary/20 transition-all duration-1000">
                                                {item.image && (
                                                    <div className={cn("relative w-full overflow-hidden", item.height)}>
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="object-cover w-full h-full transition-all duration-[2s] group-hover:scale-110 filter saturate-[0.6] brightness-[0.8] group-hover:saturate-[1.1] group-hover:brightness-100"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
                                                    </div>
                                                )}

                                                <div className="p-12 relative">
                                                    <div className="flex items-center justify-between mb-10">
                                                        <div className="w-14 h-14 bg-foreground/[0.03] rounded-[24px] flex items-center justify-center backdrop-blur-md border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-700">
                                                            {item.type === 'audio' && <Mic className="w-5 h-5 text-primary/70" />}
                                                            {item.type === 'image' && <ImageIcon className="w-5 h-5 text-primary/70" />}
                                                            {item.type === 'article' && <FileText className="w-5 h-5 text-primary/70" />}
                                                        </div>
                                                        <span className="text-[10px] font-mono text-foreground/20 uppercase tracking-[0.5em] group-hover:text-primary transition-colors">{item.type}</span>
                                                    </div>

                                                    <h3 className="font-serif text-3xl lg:text-4xl mb-6 text-foreground/80 group-hover:text-foreground transition-colors duration-700 leading-tight">
                                                        {item.title}
                                                    </h3>

                                                    {item.excerpt && (
                                                        <p className="text-foreground/40 leading-relaxed mb-12 font-light text-lg">
                                                            {item.excerpt}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center justify-between pt-10 border-t border-foreground/[0.03] opacity-30 group-hover:opacity-100 transition-opacity">
                                                        <div className="flex items-center gap-4">
                                                          <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.3em]">
                                                              {item.date}
                                                          </span>
                                                        </div>
                                                        <Link href={`/items/${item.id}`}>
                                                          <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/20 hover:text-primary text-foreground/40 transition-all">
                                                              <ArrowRight className="w-5 h-5" />
                                                          </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}

function FloatingCard({ icon: Icon, label, delay }: { icon: any, label: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl flex items-center gap-6 w-64 group hover:border-primary/30 transition-colors duration-700 hover:bg-white/[0.05]"
        >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center border border-white/5 transition-transform duration-700 group-hover:scale-110">
                <Icon className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-3 flex-1">
                <div className="text-[10px] font-mono text-primary/40 uppercase tracking-[0.3em] group-hover:text-primary/60 transition-colors">{label}</div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ delay: delay + 0.5, duration: 1.5 }}
                        className="h-full w-full bg-gradient-to-r from-primary/40 to-transparent"
                    />
                </div>
                <div className="h-1.5 w-2/3 bg-white/5 rounded-full" />
            </div>
            <div className="absolute -right-1 -top-1 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(140,221,129,1)] border-2 border-[#0A0D0A]" />
        </motion.div>
    );
}
