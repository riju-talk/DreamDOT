import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../../../components/app-sidebar"
import { TopNav } from "../../../components/top-nav"
import { CreatePostPrompt } from "../../../components/create-post-prompt"
import { UnifiedFeed } from "../../../components/unified-feed"
import { TrendingCreators } from "../../../components/trending-creators"
import { PopularTags } from "../../../components/popular-tags"
import { ScrollableContent } from "../../../components/scrollable-content"
import { MobileNav } from "../../../components/mobile-nav"
import { motion } from "framer-motion"

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-foreground relative font-sans overflow-hidden selection:bg-primary/30">
      {/* Texture Overlay */}
      <div className="fixed inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[160px] opacity-20 animate-pulse transition-opacity duration-1000" />
        <div className="absolute bottom-[10%] left-[-10%] w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[140px] opacity-20" />
        <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] opacity-10" />
      </div>

      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="relative bg-transparent z-[2]">
          <TopNav />
          <ScrollableContent>
            <main className="container mx-auto px-6 md:px-12 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                <div className="lg:col-span-3 space-y-16">
                  <header className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <h2 className="text-5xl md:text-6xl font-serif tracking-tight text-white/90 leading-[1.1]">
                        Curated <span className="text-white/20 italic font-light">Inspirations</span>
                      </h2>
                      <div className="flex items-center gap-4 mt-6">
                        <div className="h-[1px] w-12 bg-primary/40" />
                        <p className="text-[10px] text-primary/60 font-mono uppercase tracking-[0.4em] font-bold">The Digital Atelier Collective</p>
                      </div>
                    </motion.div>
                  </header>
                  <CreatePostPrompt />
                  <UnifiedFeed />
                </div>
                <div className="space-y-12 hidden lg:block">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-10"
                  >
                    <TrendingCreators />
                    <PopularTags />
                    
                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl">
                      <h4 className="text-sm font-serif mb-4 text-white/60">Atelier Stats</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Active Manifestations</span>
                          <span className="text-lg font-mono text-primary">12,402</span>
                        </div>
                        <div className="w-full h-[1px] bg-white/[0.05]" />
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Creator Resonance</span>
                          <span className="text-lg font-mono text-primary">98.2%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </main>
          </ScrollableContent>
          <MobileNav />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
