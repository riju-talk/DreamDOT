"use client"

import { AuthenticatedLayout } from "../../../components/authenticated-layout"
import { ItemCard } from "./components/ItemCard"
import { FilterSidebar } from "./components/FilterSidebar"
import { ItemDetailModal } from "./components/ItemDetailModal"
import { getFakeItems, getFakeFeaturedItems, FakeItem } from "@/lib/fake-data"
import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

interface FilterState {
  category: string
  priceMin: number | null
  priceMax: number | null
  rating: number | null
  search: string
}

export default function MarketplacePage() {
  const searchParams = useSearchParams()
  const allItems = getFakeItems()
  const featuredItems = getFakeFeaturedItems()

  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get("category") || "all",
    priceMin: searchParams.get("priceMin") ? parseFloat(searchParams.get("priceMin")!) : null,
    priceMax: searchParams.get("priceMax") ? parseFloat(searchParams.get("priceMax")!) : null,
    rating: searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : null,
    search: searchParams.get("search") || "",
  })

  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [selectedItem, setSelectedItem] = useState<FakeItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleLike = (itemId: string) => {
    const newLiked = new Set(liked)
    if (newLiked.has(itemId)) {
      newLiked.delete(itemId)
    } else {
      newLiked.add(itemId)
    }
    setLiked(newLiked)
  }

  // Filter and search items
  const filteredItems = useMemo(() => {
    let result = allItems

    // Category filter
    if (filters.category !== "all") {
      result = result.filter((item) => item.category === filters.category)
    }

    // Price range filter
    if (filters.priceMin !== null) {
      result = result.filter((item) => item.price >= filters.priceMin!)
    }
    if (filters.priceMax !== null) {
      result = result.filter((item) => item.price <= filters.priceMax!)
    }

    // Rating filter
    if (filters.rating !== null) {
      result = result.filter((item) => item.rating >= filters.rating!)
    }

    // Search filter
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.creator.name.toLowerCase().includes(searchLower)
      )
    }

    return result
  }, [allItems, filters])

  // Get related items (same category)
  const getRelatedItems = (item: FakeItem): FakeItem[] => {
    return allItems
      .filter((i) => i.category === item.category && i.id !== item.id)
      .slice(0, 6)
  }

  const handleItemClick = (item: FakeItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleRelatedItemClick = (item: FakeItem) => {
    setSelectedItem(item)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Discover amazing digital products from talented creators</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search items, creators..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                }))
              }
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-card border border-border/50 focus:border-primary/50 outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Featured Section */}
        {featuredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold mb-2">✨ Featured Items</h2>
                <p className="text-muted-foreground">Handpicked selections from our top creators</p>
              </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {featuredItems.slice(0, 4).map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <ItemCard
                      item={item}
                      onCardClick={handleItemClick}
                      onLikeToggle={toggleLike}
                      isLiked={liked.has(item.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <FilterSidebar
                  currentFilters={filters}
                  onFilterChange={setFilters}
                />
              </div>
            </div>

            {/* Main Grid */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold mb-1">All Items</h2>
                <p className="text-muted-foreground">Showing {filteredItems.length} items</p>
              </div>

              {filteredItems.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {filteredItems.map((item) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <ItemCard
                        item={item}
                        onCardClick={handleItemClick}
                        onLikeToggle={toggleLike}
                        isLiked={liked.has(item.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-2">No items found matching your filters</p>
                  <button
                    onClick={() =>
                      setFilters({
                        category: "all",
                        priceMin: null,
                        priceMax: null,
                        rating: null,
                        search: "",
                      })
                    }
                    className="text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedItem(null)
        }}
        relatedItems={selectedItem ? getRelatedItems(selectedItem) : []}
        onRelatedItemClick={handleRelatedItemClick}
        onLikeToggle={toggleLike}
        isLiked={selectedItem ? liked.has(selectedItem.id) : false}
      />
    </AuthenticatedLayout>
  )
}
