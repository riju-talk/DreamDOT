import { AuthenticatedLayout } from "../../../components/authenticated-layout"
import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Search, TrendingUp, Shield, DollarSign, Palette, Image as ImageIcon, BookOpen, Volume2, Film } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FakeItem {
  id: string
  title: string
  description: string
  price: number
  rating: number
  reviews: number
  image: string
  category: string
  creator: {
    name: string
    avatar: string
  }
}

interface FilterState {
  category: string
  priceMin: number | null
  priceMax: number | null
  rating: number | null
  search: string
}

const categories = [
  { id: "all", label: "All Assets", icon: Palette },
  { id: "art", label: "Art", icon: ImageIcon },
  { id: "writing", label: "Writing", icon: BookOpen },
  { id: "audio", label: "Audio", icon: Volume2 },
  { id: "video", label: "Video", icon: Film },
  { id: "courses", label: "Courses", icon: BookOpen },
]

const stats = [
  { label: "Total Volume", value: "1.2M DOT", color: "text-primary" },
  { label: "Active Creators", value: "14.8k", color: "text-primary" },
]

const ecosystemStats = [
  {
    title: "Artist Royalty Payouts",
    value: "$2.4M",
    change: "-12%",
    description: "Calculated from Q3 2025 sales performance across all categories",
    icon: DollarSign,
  },
  {
    title: "Daily Transaction Speed",
    value: "0.4s",
    description: "Proprietary blockchain ledger ensures zero-latency asset transfers",
    badge: "Instant",
    icon: TrendingUp,
  },
  {
    title: "Asset Authenticity",
    value: "100%",
    description: "Every asset is signed with a unique cryptographic identity fingerprint",
    badge: "Verified",
    icon: Shield,
  },
]

export default function MarketplacePage() {
  const searchParams = useSearchParams()
  const allItems: FakeItem[] = []

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  )
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const filteredItems = useMemo(() => {
    let result = allItems

    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory)
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.creator.name.toLowerCase().includes(searchLower)
      )
    }

    return result
  }, [selectedCategory, search])

  return (
    <AuthenticatedLayout>
      <div className="w-full h-full flex flex-col gap-8">
        {/* Hero Section */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-3">Marketplace</h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Premium assets for the modern digital artisan.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 px-4 py-2 rounded-lg bg-background/50 border border-border/50"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-mono">
                    {stat.label}
                  </p>
                  <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const IconComponent = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 flex items-center gap-2",
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-card border border-border/50 text-foreground hover:border-primary/50"
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items, creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:border-primary/50 outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Items Grid - Fill remaining space */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="space-y-4">
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-card border border-border/50 group-hover:border-primary/50 transition-all">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Palette className="h-8 w-8 text-primary/40" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                    <p className="text-xs text-muted-foreground truncate mb-2">by {item.creator.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">⭐ {item.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-lg text-muted-foreground">No items found</p>
              <button
                onClick={() => {
                  setSelectedCategory("all")
                  setSearch("")
                }}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Ecosystem Stats Section */}
        <div className="space-y-6 border-t border-border/50 pt-8">
          <div>
            <h2 className="font-serif text-3xl font-bold">Ecosystem Performance</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ecosystemStats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={i}
                  className="rounded-xl bg-card border border-border/50 p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold flex items-baseline gap-2">
                        {stat.value}
                        {stat.change && (
                          <span className="text-sm text-primary">{stat.change}</span>
                        )}
                      </p>
                    </div>
                    {stat.badge && (
                      <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                        {stat.badge}
                      </span>
                    )}
                    <Icon className="h-6 w-6 text-primary opacity-50" />
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground border-t border-border/50 pt-6">
          <p>© 2025 DREAMDOT DIGITAL ATELIER. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
