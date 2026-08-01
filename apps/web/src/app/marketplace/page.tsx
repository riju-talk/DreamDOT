"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthenticatedLayout } from "../../../components/authenticated-layout"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { getFakeItems, getFakeFeaturedItems } from "@/lib/fake-data"
import Image from "next/image"
import { useState } from "react"

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "writing", label: "Writing" },
  { id: "audio", label: "Audio" },
  { id: "visual", label: "Visual" },
  { id: "template", label: "Templates" },
  { id: "code", label: "Code" },
]

export default function MarketplacePage() {
  const allItems = getFakeItems()
  const featuredItems = getFakeFeaturedItems()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [liked, setLiked] = useState<Set<string>>(new Set())

  const filteredItems =
    selectedCategory === "all"
      ? allItems
      : allItems.filter((item) => item.category === selectedCategory)

  const toggleLike = (itemId: string) => {
    const newLiked = new Set(liked)
    if (newLiked.has(itemId)) {
      newLiked.delete(itemId)
    } else {
      newLiked.add(itemId)
    }
    setLiked(newLiked)
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Featured Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">✨ Featured Items</h2>
              <p className="text-muted-foreground">Handpicked selections from our top creators</p>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {featuredItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card className="border-border/50 hover:border-blue-500/50 transition-all overflow-hidden group h-full flex flex-col">
                    <div className="relative w-full h-48 bg-foreground/5 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                      />
                      <Badge className="absolute top-3 right-3 bg-blue-500/80 text-white border-0">
                        Featured
                      </Badge>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                        </div>
                        <button
                          onClick={() => toggleLike(item.id)}
                          className="flex-shrink-0"
                        >
                          <Heart
                            className={`h-5 w-5 transition-colors ${
                              liked.has(item.id)
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground hover:text-red-500"
                            }`}
                          />
                        </button>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 pb-3">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{item.rating}</span>
                          <span className="text-muted-foreground">({item.reviews})</span>
                        </div>
                        <div className="text-muted-foreground">
                          {item.sales} sold
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex gap-3 pt-4 border-t border-border/30">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="text-2xl font-bold text-blue-400">${item.price}</p>
                      </div>
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 text-white font-semibold">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex gap-2 flex-wrap mb-6">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  className={`rounded-full ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                      : "border-border/50 hover:border-border"
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* All Items Grid */}
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {selectedCategory === "all" ? "All Products" : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
              </h2>
              <p className="text-muted-foreground">Showing {filteredItems.length} items</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card className="border-border/50 hover:border-border transition-all overflow-hidden group h-full flex flex-col">
                    <div className="relative w-full h-32 bg-foreground/5 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                      />
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm line-clamp-2">{item.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 pb-2">
                      <p className="text-xs text-muted-foreground mb-3">{item.creator.name}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{item.rating}</span>
                        <span className="text-muted-foreground">({item.reviews})</span>
                      </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between pt-3 border-t border-border/30">
                      <span className="font-bold text-blue-400">${item.price}</span>
                      <button
                        onClick={() => toggleLike(item.id)}
                        className="flex-shrink-0"
                      >
                        <Heart
                          className={`h-4 w-4 transition-colors ${
                            liked.has(item.id)
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground hover:text-red-500"
                          }`}
                        />
                      </button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
