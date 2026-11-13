"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, TrendingUp, Heart, MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

import { motion } from "framer-motion"

export function SocialDiscoverHero() {
  return (
    <div className="relative overflow-hidden rounded-[40px] bg-card dark:bg-[#050505] border border-border dark:border-white/[0.05] p-12 mb-16 group">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full dark:bg-gradient-to-br dark:from-primary/5 dark:via-transparent dark:to-purple-500/5 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-primary/40" />
            <span className="text-[10px] text-primary/60 font-mono uppercase tracking-[0.4em] font-bold">The Collective Mind</span>
            <div className="h-[1px] w-8 bg-primary/40" />
          </div>
          <h1 className="text-6xl md:text-7xl font-serif tracking-tighter text-foreground dark:text-white/90 leading-tight">
            Discover <span className="text-muted-foreground dark:text-white/20 italic">Visions.</span>
          </h1>
          <p className="text-lg text-muted-foreground dark:text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            Explore the frontier of the Digital Atelier. Traverse through curated manifests, connect with fellow visionaries, and find your resonance.
          </p>
        </motion.div>

        <div className="w-full max-w-3xl relative p-1 rounded-full bg-background/50 dark:bg-white/[0.03] border border-border dark:border-white/[0.05] backdrop-blur-xl focus-within:border-primary/40 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative flex items-center">
            <Search className="absolute left-6 h-5 w-5 text-muted-foreground dark:text-white/20" />
            <Input
              type="search"
              placeholder="Attune to a frequency, creator, or symbol..."
              className="pl-16 pr-32 py-8 text-xl border-none bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/40 dark:placeholder:text-white/10 placeholder:italic font-serif"
            />
            <Button className="absolute right-2 h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(153,255,51,0.2)]">
              Attune
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-4">
          {[
            { icon: TrendingUp, label: "Vibrations", value: "50K+", color: "primary" },
            { icon: Heart, label: "Resonance", value: "2.4M+", color: "primary" },
            { icon: Sparkles, label: "Visionaries", value: "180K+", color: "primary" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-card/50 dark:bg-white/[0.02] border border-border dark:border-white/[0.05] hover:border-primary/30 dark:hover:border-white/10 transition-colors duration-500"
            >
              <stat.icon className="h-5 w-5 text-primary/60" />
              <div className="text-left">
                <p className="text-sm font-mono text-foreground dark:text-white/80 font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground dark:text-white/20 uppercase tracking-widest font-bold">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
