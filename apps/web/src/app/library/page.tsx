"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthenticatedLayout } from "../../../components/authenticated-layout"
import { Download, Eye, Lock, CheckCircle, Clock } from "lucide-react"
import { getFakeItems } from "@/lib/fake-data"
import Image from "next/image"
import { useState } from "react"

interface LibraryItem {
  id: string
  title: string
  image: string
  category: string
  purchaseDate: Date
  price: number
  status: "purchased" | "minted" | "pending"
  blockchainTokenId?: string
}

export default function LibraryPage() {
  // Mock purchased items (in real app, fetch from API)
  const purchasedItems: LibraryItem[] = [
    {
      id: "1",
      title: "Advanced Web Design Course",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
      category: "course",
      purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      price: 99,
      status: "purchased",
    },
    {
      id: "2",
      title: "Digital Art Collection",
      image: "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=500&h=300&fit=crop",
      category: "art",
      purchaseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      price: 49,
      status: "minted",
      blockchainTokenId: "0x123...abc",
    },
    {
      id: "3",
      title: "Music Production Templates",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=300&fit=crop",
      category: "audio",
      purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      price: 29,
      status: "purchased",
    },
    {
      id: "4",
      title: "Copywriting Masterclass",
      image: "https://images.unsplash.com/photo-1516321318423-f06f70674e90?w=500&h=300&fit=crop",
      category: "writing",
      purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      price: 79,
      status: "pending",
    },
  ]

  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null)
  const [viewingItemId, setViewingItemId] = useState<string | null>(null)

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "purchased":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "minted":
        return <Lock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "purchased":
        return "Owned"
      case "minted":
        return "NFT Minted"
      case "pending":
        return "Processing"
      default:
        return status
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-2">My Library</h1>
            <p className="text-muted-foreground">
              All your purchased and owned digital content. Protected by DRM & blockchain.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{purchasedItems.length}</p>
                  <p className="text-sm text-muted-foreground">Items Owned</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">
                    {purchasedItems.filter((i) => i.status === "purchased").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Purchased</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-500">
                    {purchasedItems.filter((i) => i.status === "minted").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Minted as NFT</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    ${purchasedItems.reduce((sum, i) => sum + i.price, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Items Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {purchasedItems.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <Card className="border-border/50 hover:border-border transition-all overflow-hidden group h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative w-full h-48 bg-foreground/5 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                    {/* Status Badge */}
                    <Badge
                      className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white border-0"
                      variant="default"
                    >
                      {getStatusIcon(item.status)}
                      {getStatusLabel(item.status)}
                    </Badge>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => setViewingItemId(item.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-2">
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </p>
                  </CardHeader>

                  {/* Footer */}
                  <CardFooter className="flex flex-col gap-3 pt-4 border-t border-border/30">
                    <div className="flex items-center justify-between w-full text-sm">
                      <span className="text-muted-foreground">
                        Purchased {item.purchaseDate.toLocaleDateString()}
                      </span>
                      <span className="font-bold">${item.price}</span>
                    </div>

                    {/* Blockchain Info */}
                    {item.status === "minted" && (
                      <div className="w-full p-2 bg-blue-500/10 rounded text-xs text-blue-500">
                        <Lock className="h-3 w-3 inline mr-1" />
                        Token: {item.blockchainTokenId}
                      </div>
                    )}

                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setViewingItemId(item.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Open in Vault
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {purchasedItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No items yet</h3>
              <p className="text-muted-foreground mb-6">
                Purchase digital content from creators to see them here
              </p>
              <Button>Browse Marketplace</Button>
            </motion.div>
          )}
        </div>

        {/* Vault Viewer Modal (Placeholder) */}
        {viewingItemId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setViewingItemId(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-surface rounded-lg p-8 max-w-2xl w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setViewingItemId(null)}
              >
                ✕
              </Button>

              <h2 className="text-2xl font-bold mb-4">
                {purchasedItems.find((i) => i.id === viewingItemId)?.title}
              </h2>

              {/* Watermark Grid */}
              <div className="relative w-full h-96 bg-muted rounded border border-border/50 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-white text-xs transform -rotate-45 whitespace-nowrap"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                    >
                      User ID: 12345 | {new Date().toLocaleTimeString()}
                    </div>
                  ))}
                </div>

                <Image
                  src={purchasedItems.find((i) => i.id === viewingItemId)?.image || ""}
                  alt="Content"
                  fill
                  className="object-cover"
                  unoptimized
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/40 px-6 py-3 rounded text-white text-center">
                    <p className="text-sm">DRM Protected Content</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Right-click disabled • Watermarked
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                This content is protected by DRM. Screenshots and unauthorized sharing are tracked and
                can result in account termination.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
