"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Lock } from "lucide-react"
import { useState } from "react"
import { LibraryItemCard, LibraryItem } from "./components/LibraryItemCard"
import { DRMViewer } from "./components/DRMViewer"

export default function LibraryPage() {
  // Mock purchased items (in real app, fetch from /api/library)
  const purchasedItems: LibraryItem[] = [
    {
      id: "1",
      title: "Advanced Web Design Course",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
      category: "course",
      purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      price: 99,
      status: "purchased",
      creatorName: "Alex Jordan",
    },
    {
      id: "2",
      title: "Digital Art Collection",
      image: "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=500&h=300&fit=crop",
      category: "art",
      purchaseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      price: 49,
      status: "purchased",
      creatorName: "Sam Chen",
    },
    {
      id: "3",
      title: "Music Production Templates",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=300&fit=crop",
      category: "audio",
      purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      price: 29,
      status: "purchased",
      creatorName: "Maya Rodriguez",
    },
    {
      id: "4",
      title: "Copywriting Masterclass",
      image: "https://images.unsplash.com/photo-1516321318423-f06f70674e90?w=500&h=300&fit=crop",
      category: "writing",
      purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      price: 79,
      status: "processing",
      creatorName: "Jordan Lee",
    },
    {
      id: "5",
      title: "Photography Fundamentals",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=300&fit=crop",
      category: "photography",
      purchaseDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      price: 59,
      status: "purchased",
      creatorName: "Casey Williams",
    },
    {
      id: "6",
      title: "Video Editing Pro Suite",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=300&fit=crop",
      category: "video",
      purchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      price: 149,
      status: "purchased",
      creatorName: "Taylor Smith",
    },
    {
      id: "7",
      title: "3D Modeling Essentials",
      image: "https://images.unsplash.com/photo-1555974702-d2d16b64cff8?w=500&h=300&fit=crop",
      category: "3d",
      purchaseDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
      price: 119,
      status: "purchased",
      creatorName: "Morgan Davis",
    },
    {
      id: "8",
      title: "UI/UX Design Masterclass",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
      category: "design",
      purchaseDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      price: 89,
      status: "purchased",
      creatorName: "Riley Park",
    },
  ]

  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null)
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Filter items based on selected filters
  const filteredItems = purchasedItems.filter((item) => {
    // Date filter
    if (dateFilter !== "all") {
      const daysDifference = Math.floor(
        (Date.now() - item.purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (dateFilter === "week" && daysDifference > 7) return false
      if (dateFilter === "month" && daysDifference > 30) return false
      if (dateFilter === "quarter" && daysDifference > 90) return false
    }

    // Type filter
    if (typeFilter !== "all" && item.category !== typeFilter) return false

    return true
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const uniqueCategories = Array.from(new Set(purchasedItems.map((item) => item.category)))

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-[#121412]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <motion.div initial="hidden" animate="visible" variants={headerVariants} className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#FFFFFF] mb-2">My Library</h1>
            <p className="text-[#6B8E6E]">
              All your purchased digital content, protected by DRM and blockchain.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8"
          >
            <Card className="bg-[#1a1918] border-[#2a2826]">
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
                    {purchasedItems.length}
                  </p>
                  <p className="text-xs sm:text-sm text-[#6B8E6E]">Items Owned</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#1a1918] border-[#2a2826]">
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-[#99FF33]">
                    {purchasedItems.filter((i) => i.status === "purchased").length}
                  </p>
                  <p className="text-xs sm:text-sm text-[#6B8E6E]">Purchased</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#1a1918] border-[#2a2826]">
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-[#99FF33]">
                    {purchasedItems.filter((i) => i.status === "processing").length}
                  </p>
                  <p className="text-xs sm:text-sm text-[#6B8E6E]">Processing</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#1a1918] border-[#2a2826]">
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-[#99FF33]">
                    ${purchasedItems.reduce((sum, i) => sum + i.price, 0)}
                  </p>
                  <p className="text-xs sm:text-sm text-[#6B8E6E]">Total Spent</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8"
          >
            <div className="flex-1">
              <label className="text-xs sm:text-sm text-[#6B8E6E] block mb-2">Filter by Date</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-[#1a1918] border border-[#2a2826] text-[#FFFFFF] text-sm rounded px-3 py-2 focus:border-[#99FF33] focus:outline-none transition-colors"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last 3 Months</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-xs sm:text-sm text-[#6B8E6E] block mb-2">Filter by Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-[#1a1918] border border-[#2a2826] text-[#FFFFFF] text-sm rounded px-3 py-2 focus:border-[#99FF33] focus:outline-none transition-colors"
              >
                <option value="all">All Types</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {(dateFilter !== "all" || typeFilter !== "all") && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDateFilter("all")
                    setTypeFilter("all")
                  }}
                  className="w-full sm:w-auto border-[#2a2826] text-[#99FF33] hover:bg-[#2a2826]"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </motion.div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {filteredItems.map((item) => (
                <LibraryItemCard key={item.id} item={item} onView={setSelectedItem} />
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-16"
            >
              <Lock className="h-12 sm:h-16 w-12 sm:w-16 text-[#2a2826] mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-[#FFFFFF] mb-2">No items found</h3>
              <p className="text-[#6B8E6E] mb-6">
                {typeFilter !== "all" || dateFilter !== "all"
                  ? "No items match your filters. Try adjusting them."
                  : "Purchase digital content from creators to see them here"}
              </p>
              {(typeFilter !== "all" || dateFilter !== "all") && (
                <Button
                  onClick={() => {
                    setDateFilter("all")
                    setTypeFilter("all")
                  }}
                  className="bg-[#99FF33] text-[#121412] hover:bg-[#85e022] font-semibold"
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </div>

        {/* DRM Viewer Modal */}
        <DRMViewer
          item={selectedItem!}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </div>
    </AuthenticatedLayout>
  )
}
