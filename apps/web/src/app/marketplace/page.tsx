import { MarketplaceHero } from "../../../components/marketplace-hero"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../../../components/app-sidebar"
import { TopNav } from "../../../components/top-nav"
import { MobileNav } from "../../../components/mobile-nav"
import { fetchItems } from "@/lib/mongoose/items"
import { MarketplaceSearch } from "../../../components/marketplace-search"
import { ScrollableContent } from "@/components/scrollable-content"

export const dynamic = "force-dynamic"

const CATEGORIES = ["Mixed", "Art", "Writing", "Audio", "Video", "Courses"]

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function MarketplacePage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedParams = await searchParams;
  const queryParam = resolvedParams?.q;
  const catParam = resolvedParams?.cat;
  
  const query = (typeof queryParam === 'string' ? queryParam : "").trim()
  const activeCategory = (typeof catParam === 'string' ? catParam : "mixed").toLowerCase()
  // Server-side fetch for initial render; searching happens client-side within the active category
  const results = await Promise.all(
    CATEGORIES.map((cat) =>
      fetchItems({ page: 1, limit: 12, category: cat.toLowerCase() === "mixed" ? undefined : cat })
    )
  )

  const itemsByCategory = results.map((r) => ({ items: r.items || [] }))

  return (
    <div className="min-h-screen bg-[#050505] text-foreground relative font-sans overflow-hidden selection:bg-primary/30">
      {/* Texture Overlay */}
      <div className="fixed inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[160px] opacity-20 animate-pulse transition-opacity duration-1000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[140px] opacity-20" />
      </div>

      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="relative bg-transparent z-[2]">
          <TopNav />
          <ScrollableContent>
            <main className="container mx-auto px-6 md:px-12 py-16">
              <div className="space-y-16">
                <MarketplaceHero />
                <MarketplaceSearch
                  itemsByCategory={itemsByCategory}
                  categories={CATEGORIES}
                  activeCategory={activeCategory}
                  query={query}
                />
              </div>
            </main>
          </ScrollableContent>
          <MobileNav />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
