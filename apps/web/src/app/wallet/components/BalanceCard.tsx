"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

interface BalanceCardProps {
  balance: number
  available: number
  pending: number
  usdRate: number
  totalEarned: number
  totalSpent: number
  lifetimeValue: number
  onAddCredits: () => void
}

export function BalanceCard({
  balance,
  available,
  pending,
  usdRate,
  totalEarned,
  totalSpent,
  lifetimeValue,
  onAddCredits,
}: BalanceCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={cardVariants}>
      {/* Main Balance Card */}
      <Card className="bg-gradient-to-br from-[#99FF33] to-[#85e022] border-0 shadow-2xl mb-8">
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[#121412] text-sm font-semibold mb-2 opacity-80">Current Balance</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-5xl font-bold text-[#121412]">{balance.toFixed(0)}</h2>
                <span className="text-[#121412] text-xl font-semibold">Credits</span>
              </div>
            </div>
            <div className="p-3 bg-[#121412]/10 rounded-xl">
              <Wallet className="h-8 w-8 text-[#121412]" />
            </div>
          </div>

          <div className="text-sm text-[#121412] mb-6 opacity-80">
            ≈ ${(balance * usdRate).toFixed(2)} USD
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-[#121412]/20">
            <div>
              <p className="text-xs text-[#121412] opacity-70 mb-1">Available</p>
              <p className="text-2xl font-bold text-[#121412]">{available.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-[#121412] opacity-70 mb-1">Pending</p>
              <p className="text-2xl font-bold text-[#121412]">{pending.toFixed(0)}</p>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={onAddCredits}
            className="w-full bg-[#121412] text-[#99FF33] hover:bg-[#1a1918] font-semibold py-6 text-base"
          >
            Add Credits
          </Button>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-[#1a1918] border-[#2a2826] hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[#6B8E6E] text-sm mb-1">Total Earned</p>
                  <p className="text-3xl font-bold text-[#99FF33]">
                    {totalEarned.toFixed(0)}
                  </p>
                </div>
                <div className="p-2 bg-[#99FF33]/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-[#99FF33]" />
                </div>
              </div>
              <p className="text-xs text-[#6B8E6E]">
                ≈ ${(totalEarned * usdRate).toFixed(2)} USD
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-[#1a1918] border-[#2a2826] hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[#6B8E6E] text-sm mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-[#FF6B6B]">
                    {totalSpent.toFixed(0)}
                  </p>
                </div>
                <div className="p-2 bg-[#FF6B6B]/10 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-[#FF6B6B]" />
                </div>
              </div>
              <p className="text-xs text-[#6B8E6E]">
                ≈ ${(totalSpent * usdRate).toFixed(2)} USD
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-[#1a1918] border-[#2a2826] hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[#6B8E6E] text-sm mb-1">Lifetime Value</p>
                  <p className="text-3xl font-bold text-[#FFFFFF]">
                    ${lifetimeValue.toFixed(2)}
                  </p>
                </div>
                <div className="p-2 bg-[#FFFFFF]/10 rounded-lg">
                  <Wallet className="h-5 w-5 text-[#FFFFFF]" />
                </div>
              </div>
              <p className="text-xs text-[#6B8E6E]">
                Total account value
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
