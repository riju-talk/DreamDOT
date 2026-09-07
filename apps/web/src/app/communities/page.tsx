"use client"

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Users,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react"
import { motion } from "framer-motion"

interface Community {
  id: string
  name: string
  description: string
  category: string
  memberCount: number
  image: string
  isTrending?: boolean
  isJoined?: boolean
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(new Set())

  const categories = [
    { id: "all", label: "All Circles", icon: "🎨" },
    { id: "visual-arts", label: "Visual Arts", icon: "🖼️" },
    { id: "creative-writing", label: "Creative Writing", icon: "✍️" },
    { id: "sound-design", label: "Sound Design", icon: "🎵" },
    { id: "code-logic", label: "Code & Logic", icon: "💻" },
  ]

  useEffect(() => {
    // Load communities from API
    const loadCommunities = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/communities")
        if (response.ok) {
          const data = await response.json()
          setCommunities(data.communities || [])
        }
      } catch (error) {
        console.error("[Communities] Error loading communities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCommunities()
  }, [])

  useEffect(() => {
    // Filter communities based on selected category and search query
    let filtered = communities

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((c) => c.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      )
    }

    setFilteredCommunities(filtered)
  }, [selectedCategory, searchQuery, communities])

  const handleJoinCommunity = (communityId: string) => {
    setJoinedCommunities((prev) => new Set([...prev, communityId]))
    // TODO: Call API to join community
  }

  const trendingCommunities = filteredCommunities.slice(0, 2)
  const discoverCommunities = filteredCommunities.slice(2, 8)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#5a8c5a]/10 to-[#4a7c4a]/10 border-b border-border/50 px-8 py-16 text-center space-y-8"
        >
          <div>
            <h1 className="text-5xl font-black italic font-serif text-foreground mb-4">
              Creative Circles
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Find your tribe in the digital atelier. Connect, collaborate, and create with minds that
              resonate with yours.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search communities by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-base outline-none focus:ring-2 focus:ring-[#5a8c5a] focus:border-transparent transition-all"
              />
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 mb-12 justify-center"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#5a8c5a] text-white shadow-lg shadow-[#5a8c5a]/30"
                    : "bg-card border border-border hover:border-[#5a8c5a] text-foreground"
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#5a8c5a]" />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-16"
            >
              {/* Trending Section */}
              {trendingCommunities.length > 0 && (
                <motion.section variants={itemVariants} className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#5a8c5a]" />
                    <h2 className="text-3xl font-bold text-foreground">Trending Now</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trendingCommunities.map((community) => (
                      <motion.div
                        key={community.id}
                        whileHover={{ y: -8 }}
                        className="group cursor-pointer"
                      >
                        <Card className="overflow-hidden h-full bg-card border-border hover:border-[#5a8c5a]/50 transition-all duration-300">
                          {/* Image */}
                          <div className="relative w-full h-64 overflow-hidden bg-black/20">
                            {community.image ? (
                              <img
                                src={community.image}
                                alt={community.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#5a8c5a]/20 to-[#4a7c4a]/20 flex items-center justify-center">
                                <Users className="h-12 w-12 text-[#5a8c5a]/30" />
                              </div>
                            )}
                            <Badge className="absolute top-4 left-4 bg-[#5a8c5a] text-white">
                              Trending
                            </Badge>
                          </div>

                          {/* Content */}
                          <CardContent className="p-6 space-y-4">
                            <div>
                              <h3 className="text-2xl font-bold text-foreground mb-2">
                                {community.name}
                              </h3>
                              <p className="text-muted-foreground line-clamp-2">
                                {community.description}
                              </p>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{community.memberCount.toLocaleString()} members</span>
                            </div>

                            {/* Action */}
                            <Button
                              onClick={() => handleJoinCommunity(community.id)}
                              disabled={joinedCommunities.has(community.id)}
                              className={`w-full font-semibold ${
                                joinedCommunities.has(community.id)
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-[#5a8c5a] text-white hover:bg-[#4a7c4a]"
                              }`}
                            >
                              {joinedCommunities.has(community.id) ? "Joined" : "Join Circle"}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Discover More Section */}
              {discoverCommunities.length > 0 && (
                <motion.section variants={itemVariants} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-foreground">Discover More</h2>
                    <Button
                      variant="ghost"
                      className="text-[#5a8c5a] hover:text-[#5a8c5a] hover:bg-[#5a8c5a]/10 gap-2"
                    >
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {discoverCommunities.map((community) => (
                      <motion.div
                        key={community.id}
                        whileHover={{ y: -8 }}
                        className="group cursor-pointer"
                      >
                        <Card className="overflow-hidden h-full bg-card border-border hover:border-[#5a8c5a]/50 transition-all duration-300">
                          {/* Image */}
                          <div className="relative w-full h-48 overflow-hidden bg-black/20">
                            {community.image ? (
                              <img
                                src={community.image}
                                alt={community.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#5a8c5a]/20 to-[#4a7c4a]/20 flex items-center justify-center">
                                <Users className="h-8 w-8 text-[#5a8c5a]/30" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <CardContent className="p-4 space-y-3">
                            <div>
                              <h3 className="text-lg font-bold text-foreground mb-1">
                                {community.name}
                              </h3>
                              <Badge variant="secondary" className="text-xs mb-2">
                                {community.category}
                              </Badge>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {community.description}
                              </p>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{community.memberCount.toLocaleString()}</span>
                            </div>

                            {/* Action */}
                            <Button
                              onClick={() => handleJoinCommunity(community.id)}
                              disabled={joinedCommunities.has(community.id)}
                              size="sm"
                              variant={joinedCommunities.has(community.id) ? "secondary" : "default"}
                              className={`w-full ${
                                !joinedCommunities.has(community.id)
                                  ? "bg-[#5a8c5a] text-white hover:bg-[#4a7c4a]"
                                  : ""
                              }`}
                            >
                              {joinedCommunities.has(community.id) ? "Joined" : "Join"}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Empty State */}
              {filteredCommunities.length === 0 && !isLoading && (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-20 space-y-4"
                >
                  <Users className="h-16 w-16 mx-auto text-muted-foreground/30" />
                  <p className="text-lg text-muted-foreground">
                    {searchQuery ? "No communities match your search" : "No communities found in this category"}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
