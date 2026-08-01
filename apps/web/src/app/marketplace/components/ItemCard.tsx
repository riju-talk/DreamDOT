"use client"

import { FakeItem } from "@/lib/fake-data"
import Image from "next/image"
import { Heart, Star } from "lucide-react"

interface ItemCardProps {
  item: FakeItem
  onCardClick: (item: FakeItem) => void
  onLikeToggle?: (itemId: string) => void
  isLiked?: boolean
}

export function ItemCard({ item, onCardClick, onLikeToggle, isLiked = false }: ItemCardProps) {
  return (
    <div
      className="group h-full flex flex-col rounded-lg overflow-hidden border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-float)]"
    >
      {/* Image Container */}
      <div
        className="relative w-full aspect-square bg-muted/30 overflow-hidden cursor-pointer"
        onClick={() => onCardClick(item)}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Like Button */}
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card hover:border-primary/50 transition-all duration-200 z-10"
          onClick={(e) => {
            e.stopPropagation()
            onLikeToggle?.(item.id)
          }}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isLiked ? "fill-accent text-accent" : "text-muted-foreground hover:text-accent"
            }`}
          />
        </button>

        {/* Featured Badge */}
        {item.featured && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-primary/80 text-primary-foreground text-xs font-semibold backdrop-blur-sm">
            ✨ Featured
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col p-3 bg-card/50 border-t border-border/30">
        {/* Title */}
        <h3
          className="font-serif text-sm font-semibold line-clamp-2 mb-2 cursor-pointer hover:text-primary transition-colors"
          onClick={() => onCardClick(item)}
        >
          {item.title}
        </h3>

        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={item.creator.avatar}
              alt={item.creator.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <p className="text-xs text-muted-foreground truncate">{item.creator.name}</p>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center gap-3 text-xs mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{item.rating}</span>
            <span className="text-muted-foreground">({item.reviews})</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-lg font-bold text-primary">${item.price}</div>
      </div>
    </div>
  )
}
