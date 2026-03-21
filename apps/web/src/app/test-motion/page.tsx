"use client"
import { motion } from "framer-motion"

export default function TestMotionPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800"
      >
        Motion Test
      </motion.div>
    </div>
  )
}
