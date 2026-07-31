"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AuthenticatedLayout } from "../../../../components/authenticated-layout"
import { Star, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function ProductViewPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Artist Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <div className="relative">
            <Avatar className="h-16 w-16 border border-border ring-offset-background">
              <AvatarImage src="/user.jpg" />
              <AvatarFallback className="bg-primary/20 text-primary font-serif">AV</AvatarFallback>
            </Avatar>
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-md opacity-50" />
          </div>
          <div>
            <h1 className="text-2xl font-serif flex items-center gap-2">
               ArtisticVision <Sparkles className="h-5 w-5 text-primary" />
            </h1>
            <p className="text-sm text-muted-foreground/60 font-light italic mt-1">
              Exploring the digital cosmos — one pixel at a time.
            </p>
          </div>
        </motion.div>

        {/* Product Card */}
        <Card className="dream-card overflow-hidden shadow-[var(--shadow-float-lg)] group">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative aspect-square lg:aspect-auto w-full bg-muted/20 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
               <div className="w-full h-full flex items-center justify-center p-12">
                 <div className="w-full h-full rounded-[32px] bg-muted/20 animate-pulse transition-transform duration-1000 group-hover:scale-105" />
               </div>
            </div>

            <div className="p-12 space-y-10 flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {["#digitalart", "#cyberpunk", "#premium"].map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-widest px-3 py-1 font-mono">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-5xl font-serif leading-tight">
                  Neon <span className="text-muted-foreground/40">Dreamscape</span>
                </CardTitle>
                <p className="text-lg text-muted-foreground/60 font-light leading-relaxed italic">
                  A vivid cyberpunk digital painting capturing the
                  essence of a futuristic city night. Great for collectors,
                  designers, and sci-fi lovers.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.3em] font-bold">Resonance Cost</p>
                  <div className="h-[1px] flex-1 mx-4 bg-border" />
                  <p className="text-3xl font-mono text-primary font-bold">₹499</p>
                </div>
                
                <Button className="w-full h-16 text-sm font-bold uppercase tracking-[0.3em] shadow-[var(--shadow-glow)] rounded-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95">
                  Manifest Ownership
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <Star key={n} className="w-4 h-4 fill-primary/60 stroke-primary/80" />
                  ))}
                  <Star className="w-4 h-4 fill-muted stroke-border" />
                </div>
                <span className="text-[10px] text-muted-foreground/60 font-mono font-bold uppercase tracking-widest">
                  4.2 Resonance • 89 Witnesses
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Reviews */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-serif">Testimonials</h2>
            <div className="h-[1px] flex-1 bg-border" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="dream-card p-8 space-y-6 group/review transition-all duration-500">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary/60 font-serif">JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">John Star</p>
                    <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-bold font-mono">2 cycles ago</p>
                  </div>
                </div>
                <div className="flex gap-1 group-hover/review:scale-110 transition-transform duration-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < 4 ? "fill-primary/40 stroke-primary/60" : "fill-muted stroke-border"}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground/80 font-serif italic leading-relaxed">
                  &ldquo;Absolutely stunning work! The neon effects look vibrant on my display.&rdquo;
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Add Review */}
        <div className="max-w-2xl mx-auto space-y-8 glass-panel rounded-[40px] p-12">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-serif">Inscribe your Review</h3>
            <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-bold">Leave your mark on this vision</p>
          </div>
          <div className="space-y-4">
            <Input placeholder="Visionary Name" className="h-14 rounded-xl font-serif text-lg" />
            <Textarea placeholder="Share your resonance..." rows={4} className="rounded-2xl p-6 font-serif text-lg italic" />
            <Button className="w-full h-14 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all duration-500">
              Submit Resonance
            </Button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
