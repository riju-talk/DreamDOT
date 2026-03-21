import { SocialDiscoverHero } from "../../../components/social-discover-hero"
import { SocialFeedWrapper } from "../../../components/social-feed-wrapper"
import { TrendingHashtags } from "../../../components/trending-hashtags"
import { SuggestedCreators } from "../../../components/suggested-creators"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../../../components/app-sidebar"
import { TopNav } from "../../../components/top-nav"
import { MobileNav } from "../../../components/mobile-nav"
import { ScrollableContent } from "@/components/scrollable-content"

export default async function DiscoverPage() {
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
        <AppSidebar />
        <SidebarInset className="relative bg-transparent z-[2]">
          <TopNav />
          <ScrollableContent>
            <main className="container mx-auto px-6 md:px-12 py-16">
              <div className="space-y-16">
                <SocialDiscoverHero />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                  <div className="lg:col-span-3">
                    <SocialFeedWrapper />
                  </div>
                  <div className="space-y-12">
                     <TrendingHashtags />
                     <SuggestedCreators />
                     
                     <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl">
                      <h4 className="text-sm font-serif mb-4 text-white/60">Discovery Stats</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">New Visions</span>
                          <span className="text-lg font-mono text-primary">+1,240</span>
                        </div>
                        <div className="w-full h-[1px] bg-white/[0.05]" />
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Resonance Level</span>
                          <span className="text-lg font-mono text-primary">High</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
