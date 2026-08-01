"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download } from "lucide-react"
import Image from "next/image"

export interface LibraryItem {
  id: string
  title: string
  image: string
  category: string
  purchaseDate: Date
  price: number
  creatorName: string
  status: "purchased" | "processing"
}

interface LibraryItemCardProps {
  item: LibraryItem
  onView: (item: LibraryItem) => void
}

export function LibraryItemCard({ item, onView }: LibraryItemCardProps) {
  const formattedDate = new Date(item.purchaseDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-[#2a2826] hover:border-[#99FF33] transition-all overflow-hidden group h-full flex flex-col bg-[#1a1918]">
        {/* Image Container */}
        <div className="relative w-full h-48 bg-[#121412] overflow-hidden">
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
            className="absolute top-3 right-3 bg-[#99FF33] text-[#121412] border-0 font-semibold"
            variant="default"
          >
            {item.status === "processing" ? "Processing" : "Owned"}
          </Badge>

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              onClick={() => onView(item)}
              className="bg-[#99FF33] text-[#121412] hover:bg-[#85e022] text-semibold"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardHeader className="pb-3">
          <CardTitle className="text-base line-clamp-2 text-[#FFFFFF]">{item.title}</CardTitle>
          <p className="text-xs text-[#6B8E6E] mt-2">
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </p>
        </CardHeader>

        {/* Footer */}
        <CardFooter className="flex flex-col gap-3 pt-4 border-t border-[#2a2826] mt-auto">
          <div className="flex flex-col w-full text-sm gap-1">
            <span className="text-[#6B8E6E]">Purchased {formattedDate}</span>
            <span className="text-[#99FF33] font-semibold">${item.price}</span>
          </div>

          {/* Creator Info */}
          <div className="w-full p-2 bg-[#2a2826] rounded text-xs text-[#FFFFFF] truncate">
            By {item.creatorName}
          </div>

          <Button
            className="w-full bg-[#99FF33] text-[#121412] hover:bg-[#85e022] font-semibold"
            onClick={() => onView(item)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Open in Vault
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
