"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { LibraryItem } from "./LibraryItemCard"

interface DRMViewerProps {
  item: LibraryItem
  isOpen: boolean
  onClose: () => void
}

export function DRMViewer({ item, isOpen, onClose }: DRMViewerProps) {
  const { data: session } = useSession()
  const userName = session?.user?.name || "User"

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-[#1a1918] rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col border border-[#2a2826]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2826]">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">{item.title}</h2>
            <p className="text-sm text-[#6B8E6E] mt-1">
              By {item.creatorName} • Purchased{" "}
              {new Date(item.purchaseDate).toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#6B8E6E] hover:text-[#FFFFFF] hover:bg-[#2a2826]"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* DRM Protected Preview */}
            <div className="relative w-full h-96 bg-[#121412] rounded-lg border border-[#2a2826] flex items-center justify-center overflow-hidden group">
              {/* Watermark Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none text-[#99FF33] text-xs font-semibold overflow-hidden select-none">
                <div className="absolute inset-0 flex items-center justify-center flex-wrap content-center">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1/4 h-1/4 flex items-center justify-center transform -rotate-45 whitespace-nowrap"
                    >
                      © {new Date().getFullYear()} {userName}
                    </div>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* DRM Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* DRM Notice */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#99FF33] animate-pulse" />
                  <p className="text-sm font-semibold text-[#FFFFFF]">DRM Protected</p>
                </div>
                <p className="text-xs text-[#6B8E6E] mt-1">
                  © {new Date().getFullYear()} {userName} • Watermarked • Tracked
                </p>
              </div>
            </div>

            {/* Ownership Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#2a2826] rounded-lg p-4 border border-[#3a3836]">
                <p className="text-xs text-[#6B8E6E] mb-1">Purchase Date</p>
                <p className="text-lg font-semibold text-[#FFFFFF]">
                  {new Date(item.purchaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-[#2a2826] rounded-lg p-4 border border-[#3a3836]">
                <p className="text-xs text-[#6B8E6E] mb-1">Price Paid</p>
                <p className="text-lg font-semibold text-[#99FF33]">${item.price}</p>
              </div>
            </div>

            {/* Usage Rights & Restrictions */}
            <div className="bg-[#121412] rounded-lg p-4 border border-[#2a2826]">
              <h3 className="text-sm font-semibold text-[#FFFFFF] mb-3">
                Usage Rights & Restrictions
              </h3>
              <ul className="space-y-2 text-sm text-[#6B8E6E]">
                <li className="flex items-start gap-2">
                  <span className="text-[#99FF33] font-bold mt-0.5">✓</span>
                  <span>Personal use and enjoyment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#99FF33] font-bold mt-0.5">✓</span>
                  <span>Limited sharing with family members</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6B8E6E] font-bold mt-0.5">✕</span>
                  <span>No public distribution or resale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6B8E6E] font-bold mt-0.5">✕</span>
                  <span>No commercial use or modification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6B8E6E] font-bold mt-0.5">✕</span>
                  <span>No unauthorized copying or screenshotting</span>
                </li>
              </ul>
              <p className="text-xs text-[#6B8E6E] mt-4">
                Unauthorized sharing is tracked and can result in account suspension or legal action.
              </p>
            </div>

            {/* Download Notice */}
            <div className="bg-[#2a2826] rounded-lg p-4 border border-[#3a3836]">
              <p className="text-sm text-[#FFFFFF] mb-2 font-semibold">
                Download Protection
              </p>
              <p className="text-xs text-[#6B8E6E]">
                This content is protected by DRM encryption. Downloads include embedded tracking and
                cannot be transferred to other accounts. All usage is monitored for compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-6 border-t border-[#2a2826] bg-[#121412]">
          <Button
            className="flex-1 bg-[#99FF33] text-[#121412] hover:bg-[#85e022] font-semibold"
            onClick={() => {
              // Download action would be handled here
              alert("Download initiated. File will begin downloading shortly.")
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Content
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-[#2a2826] text-[#FFFFFF] hover:bg-[#2a2826]"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
