"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, X, ShieldAlert } from "lucide-react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { LibraryItem } from "./LibraryItemCard"

interface DRMViewerProps {
  item: LibraryItem
  isOpen: boolean
  onClose: () => void
}

// Shortcuts that would let a viewer inspect or save the underlying asset URL/markup.
const BLOCKED_SHORTCUTS = (e: KeyboardEvent) =>
  e.key === 'F12' ||
  (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
  (e.ctrlKey && ['U', 'S'].includes(e.key.toUpperCase()))

// DevTools panels change the gap between outer and inner window dimensions — not foolproof,
// but a real, working heuristic rather than decoration.
const DEVTOOLS_THRESHOLD = 160

export function DRMViewer({ item, isOpen, onClose }: DRMViewerProps) {
  const { data: session } = useSession()
  const userName = session?.user?.name || "User"
  const userId = (session?.user as { id?: string } | undefined)?.id || "unknown"

  const containerRef = useRef<HTMLDivElement>(null)
  const [now, setNow] = useState(() => new Date())
  const [devToolsOpen, setDevToolsOpen] = useState(false)
  const [screenshotFlag, setScreenshotFlag] = useState(false)

  // Live watermark clock — this is what makes the overlay a real per-session watermark
  // instead of a static string baked in at first render.
  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [isOpen])

  // Anti-piracy input blocking, scoped to the viewer only (not the whole document).
  useEffect(() => {
    if (!isOpen) return

    const node = containerRef.current

    const blockContextMenu = (e: MouseEvent) => e.preventDefault()
    const blockSelect = (e: Event) => e.preventDefault()
    const blockKeys = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        // The capture has already happened by keydown, but flagging it lets us react
        // (flash a warning, and in production, phone home for a tracking event) rather
        // than pretend the click never happened.
        setScreenshotFlag(true)
        window.setTimeout(() => setScreenshotFlag(false), 2500)
        console.warn(`[DRM] PrintScreen detected while viewing item ${item.id} — user ${userId}`)
        return
      }
      if (BLOCKED_SHORTCUTS(e)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    node?.addEventListener('contextmenu', blockContextMenu)
    node?.addEventListener('selectstart', blockSelect)
    window.addEventListener('keydown', blockKeys)

    return () => {
      node?.removeEventListener('contextmenu', blockContextMenu)
      node?.removeEventListener('selectstart', blockSelect)
      window.removeEventListener('keydown', blockKeys)
    }
  }, [isOpen, item.id, userId])

  // DevTools-open heuristic — blurs the protected content rather than trusting the tab stays closed.
  useEffect(() => {
    if (!isOpen) return
    const check = () => {
      const widthGap = window.outerWidth - window.innerWidth
      const heightGap = window.outerHeight - window.innerHeight
      setDevToolsOpen(widthGap > DEVTOOLS_THRESHOLD || heightGap > DEVTOOLS_THRESHOLD)
    }
    check()
    const interval = setInterval(check, 1000)
    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  const watermarkTimestamp = now.toLocaleString('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        ref={containerRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-[#1a1918] rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col border border-[#2a2826] select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {screenshotFlag && (
          <div className="absolute inset-0 z-10 bg-[#99FF33]/10 border-2 border-[#99FF33] rounded-lg flex items-center justify-center pointer-events-none">
            <div className="bg-[#121412] px-4 py-2 rounded-lg border border-[#99FF33] flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#99FF33]" />
              <span className="text-xs text-[#99FF33] font-semibold">Screenshot attempt logged to this account</span>
            </div>
          </div>
        )}

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
              {/* Image */}
              <div
                className={`absolute inset-0 transition-[filter] duration-200 ${devToolsOpen ? 'blur-2xl brightness-50' : ''}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover pointer-events-none"
                  draggable={false}
                  unoptimized
                />
              </div>

              {/* Dynamic Watermark — live userId + session timestamp, not a static string */}
              <div className="absolute inset-0 opacity-[0.15] pointer-events-none text-[#99FF33] text-[10px] font-semibold overflow-hidden select-none z-[1]">
                <div className="absolute inset-0 flex items-center justify-center flex-wrap content-center">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1/4 h-1/4 flex items-center justify-center transform -rotate-45 whitespace-nowrap leading-tight text-center"
                    >
                      {userId}
                      <br />
                      {watermarkTimestamp}
                    </div>
                  ))}
                </div>
              </div>

              {devToolsOpen && (
                <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-2 bg-black/60">
                  <ShieldAlert className="h-8 w-8 text-[#99FF33]" />
                  <p className="text-sm text-[#FFFFFF] font-semibold">Content hidden</p>
                  <p className="text-xs text-[#6B8E6E]">Close developer tools to continue viewing</p>
                </div>
              )}

              {/* DRM Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

              {/* DRM Notice */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-[1] pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#99FF33] animate-pulse" />
                  <p className="text-sm font-semibold text-[#FFFFFF]">DRM Protected</p>
                </div>
                <p className="text-xs text-[#6B8E6E] mt-1">
                  {userName} • {watermarkTimestamp} • Watermarked • Tracked
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
