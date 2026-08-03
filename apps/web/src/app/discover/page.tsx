import { SocialDiscoverHero } from "@/components/social-discover-hero"
import { SocialFeedWrapper } from "@/components/social-feed-wrapper"
import { TrendingHashtags } from "@/components/trending-hashtags"
import { SuggestedCreators } from "@/components/suggested-creators"
import { AuthenticatedLayout } from "@/components/authenticated-layout"

export default async function DiscoverPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-16">
        <SocialDiscoverHero />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          <div className="lg:col-span-3">
            <SocialFeedWrapper />
          </div>
          <div className="space-y-12">
             <TrendingHashtags />
             <SuggestedCreators />
             
             <div className="glass-panel rounded-[32px] p-8">
              <h4 className="text-sm font-serif mb-4 text-muted-foreground/60">Discovery Stats</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-bold">New Visions</span>
                  <span className="text-lg font-mono text-primary">+1,240</span>
                </div>
                <div className="w-full h-[1px] bg-border" />
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-bold">Resonance Level</span>
                  <span className="text-lg font-mono text-primary">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
