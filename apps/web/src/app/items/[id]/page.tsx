"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../../../../components/app-sidebar";
import { TopNav } from "../../../../components/top-nav";
import { MobileNav } from "../../../../components/mobile-nav";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductViewPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-foreground relative font-sans overflow-hidden selection:bg-primary/30">
      {/* Texture Overlay */}
      <div className="fixed inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[160px] opacity-20 animate-pulse transition-opacity duration-1000" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[140px] opacity-20" />
      </div>

      <SidebarProvider>
        <div className="flex w-full relative z-[2] bg-transparent">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopNav />
            <main className="flex-1 container mx-auto px-6 md:px-12 py-16">
              <div className="max-w-6xl mx-auto space-y-20">
                {/* Artist Info */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-6"
                >
                  <div className="relative">
                    <Avatar className="h-16 w-16 border border-white/10 ring-offset-background">
                      <AvatarImage src="/user.jpg" />
                      <AvatarFallback className="bg-primary/20 text-primary font-serif">AV</AvatarFallback>
                    </Avatar>
                    <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-md opacity-50" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-serif text-white/90 flex items-center gap-2">
                       ArtisticVision <Sparkles className="h-5 w-5 text-primary" />
                    </h1>
                    <p className="text-sm text-white/40 font-light italic mt-1">
                      Exploring the digital cosmos — one pixel at a time.
                    </p>
                  </div>
                </motion.div>

                {/* Product Card */}
                <Card className="dream-card bg-white/[0.02] backdrop-blur-3xl border-white/[0.05] p-0 overflow-hidden shadow-2xl group">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative aspect-square lg:aspect-auto w-full bg-white/[0.03] overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                       <div className="w-full h-full flex items-center justify-center p-12">
                         <div className="w-full h-full rounded-[32px] bg-muted/20 animate-pulse transition-transform duration-1000 group-hover:scale-105" />
                       </div>
                    </div>

                    <div className="p-12 space-y-10 flex flex-col justify-center">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          {["#digitalart", "#cyberpunk", "#premium"].map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-widest bg-white/[0.03] border-white/10 px-3 py-1 font-mono text-white/40">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="text-5xl font-serif text-white/90 leading-tight">
                          Neon <span className="text-white/20">Dreamscape</span>
                        </CardTitle>
                        <p className="text-lg text-white/40 font-light leading-relaxed italic">
                          A vivid cyberpunk digital painting capturing the
                          essence of a futuristic city night. Great for collectors,
                          designers, and sci-fi lovers.
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Resonance Cost</p>
                          <div className="h-[1px] flex-1 mx-4 bg-white/[0.05]" />
                          <p className="text-3xl font-mono text-primary font-bold">₹499</p>
                        </div>
                        
                        <Button className="w-full h-16 text-sm font-bold uppercase tracking-[0.3em] bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(153,255,51,0.2)]">
                          Manifest Ownership
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 pt-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4].map((n) => (
                            <Star key={n} className="w-4 h-4 fill-primary/60 stroke-primary/80" />
                          ))}
                          <Star className="w-4 h-4 fill-white/5 stroke-white/10" />
                        </div>
                        <span className="text-[10px] text-white/40 font-mono font-bold uppercase tracking-widest">
                          4.2 Resonance • 89 Witnesses
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Reviews */}
                <div className="space-y-12">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-serif text-white/90">Testimonials</h2>
                    <div className="h-[1px] flex-1 bg-white/[0.05]" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {[...Array(2)].map((_, i) => (
                      <Card key={i} className="dream-card bg-white/[0.02] backdrop-blur-3xl border-white/[0.05] p-8 space-y-6 group/review hover:bg-white/[0.04] transition-all duration-500">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border border-white/10">
                            <AvatarFallback className="bg-primary/10 text-primary/60 font-serif">JS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white/80">John Star</p>
                            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold font-mono">2 cycles ago</p>
                          </div>
                        </div>
                        <div className="flex gap-1 group-hover/review:scale-110 transition-transform duration-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < 4 ? "fill-primary/40 stroke-primary/60" : "fill-white/5 stroke-white/10"}`}
                            />
                          ))}
                        </div>
                        <p className="text-white/60 font-serif italic leading-relaxed">
                          "Absolutely stunning work! The neon effects look vibrant on my display."
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Add Review */}
                <div className="max-w-2xl mx-auto space-y-8 p-12 rounded-[40px] bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-serif text-white/90">Inscribe your Review</h3>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Leave your mark on this vision</p>
                  </div>
                  <div className="space-y-4">
                    <Input placeholder="Visionary Name" className="h-14 bg-white/[0.03] border-white/[0.05] focus:border-primary/40 focus:ring-0 rounded-xl font-serif text-lg" />
                    <Textarea placeholder="Share your resonance..." rows={4} className="bg-white/[0.03] border-white/[0.05] focus:border-primary/40 focus:ring-0 rounded-2xl p-6 font-serif text-lg italic" />
                    <Button className="w-full h-14 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all duration-500">
                      Submit Resonance
                    </Button>
                  </div>
                </div>
              </div>
            </main>
            <MobileNav />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
