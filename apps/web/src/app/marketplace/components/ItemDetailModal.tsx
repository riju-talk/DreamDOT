"use client"

import { FakeItem } from "@/lib/fake-data"
import Image from "next/image"
import { Heart, Star, X, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"

interface ItemDetailModalProps {
  item: FakeItem | null
  isOpen: boolean
  onClose: () => void
  relatedItems?: FakeItem[]
  onRelatedItemClick?: (item: FakeItem) => void
  onLikeToggle?: (itemId: string) => void
  isLiked?: boolean
}

export function ItemDetailModal({
  item,
  isOpen,
  onClose,
  relatedItems = [],
  onRelatedItemClick,
  onLikeToggle,
  isLiked = false,
}: ItemDetailModalProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const [isLikedLocal, setIsLikedLocal] = useState(isLiked)

  useEffect(() => {
    setIsLikedLocal(isLiked)
  }, [isLiked])

  if (!isOpen || !item) return null

  // Simulate multiple images (in real implementation, would come from API)
  const images = [item.image, item.image, item.image]

  const handlePrevImage = () => {
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleLike = () => {
    setIsLikedLocal(!isLikedLocal)
    onLikeToggle?.(item.id)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-xl overflow-hidden shadow-lg flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background border border-border/30 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted/30 rounded-lg overflow-hidden">
                <Image
                  src={images[imageIndex]}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 border border-border/50 hover:bg-card transition-colors z-10"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 border border-border/50 hover:bg-card transition-colors z-10"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                      {imageIndex + 1} / {images.length}
                    </div>
                  </>
                )}

                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className="absolute top-3 right-3 p-3 rounded-full bg-card/80 border border-border/50 hover:bg-card hover:border-primary/50 transition-all"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      isLikedLocal ? "fill-accent text-accent" : "text-muted-foreground hover:text-accent"
                    }`}
                  />
                </button>

                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary/80 text-primary-foreground text-xs font-semibold">
                    ✨ Featured
                  </div>
                )}
              </div>

              {/* Thumbnail Grid */}
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === imageIndex ? "border-primary" : "border-border/30 hover:border-border/50"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="flex flex-col space-y-6">
              {/* Title and Creator */}
              <div>
                <h1 className="font-serif text-2xl font-bold mb-3">{item.title}</h1>

                {/* Creator Card */}
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={item.creator.avatar}
                      alt={item.creator.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.creator.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.creator.followers.toLocaleString()} followers
                    </p>
                  </div>
                  <button className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity">
                    Follow
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-serif font-semibold text-sm mb-2">Description</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{item.description}</p>
              </div>

              {/* Rating and Stats */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{item.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.reviews} reviews</p>
                </div>
                <div>
                  <p className="font-bold text-lg">{item.sales}</p>
                  <p className="text-xs text-muted-foreground">Sold</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-primary">${item.price}</p>
                  <p className="text-xs text-muted-foreground">Price</p>
                </div>
              </div>

              {/* Purchase Button */}
              <button className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Purchase Now
              </button>

              {/* Category Badge */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Category</p>
                <span className="inline-block px-3 py-1 rounded-full bg-muted text-foreground text-xs font-medium capitalize">
                  {item.category}
                </span>
              </div>
            </div>
          </div>

          {/* Related Items Section */}
          {relatedItems.length > 0 && (
            <div className="border-t border-border/30 p-6 bg-muted/10">
              <h3 className="font-serif font-bold text-lg mb-4">Similar Items</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedItems.slice(0, 4).map((relatedItem) => (
                  <button
                    key={relatedItem.id}
                    onClick={() => {
                      onRelatedItemClick?.(relatedItem)
                      setImageIndex(0)
                    }}
                    className="group text-left"
                  >
                    <div className="relative aspect-square bg-muted/30 rounded-lg overflow-hidden mb-2">
                      <Image
                        src={relatedItem.image}
                        alt={relatedItem.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                    <p className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedItem.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">${relatedItem.price}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
