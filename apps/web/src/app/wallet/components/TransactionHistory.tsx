"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, ShoppingCart, Plus } from "lucide-react"
import { useState, useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface Transaction {
  id: string
  date: Date
  type: "income" | "expense" | "purchase" | "top-up"
  description: string
  amount: number
  status: "completed" | "pending" | "failed"
}

interface TransactionHistoryProps {
  transactions: Transaction[]
  onRowClick?: (transaction: Transaction) => void
}

const ITEMS_PER_PAGE = 10

export function TransactionHistory({
  transactions,
  onRowClick,
}: TransactionHistoryProps) {
  const [filterType, setFilterType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredAndSorted = useMemo(() => {
    let filtered = transactions

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType)
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "amount-desc":
          return b.amount - a.amount
        case "amount-asc":
          return a.amount - b.amount
        default:
          return 0
      }
    })

    return sorted
  }, [transactions, filterType, sortBy])

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredAndSorted.slice(start, end)
  }, [filteredAndSorted, currentPage])

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE)

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "income":
        return <ArrowUpRight className="h-5 w-5 text-[#99FF33]" />
      case "expense":
        return <ArrowDownLeft className="h-5 w-5 text-[#FF6B6B]" />
      case "purchase":
        return <ShoppingCart className="h-5 w-5 text-[#6B8E6E]" />
      case "top-up":
        return <Plus className="h-5 w-5 text-[#99FF33]" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-[#99FF33]"
      case "expense":
        return "text-[#FF6B6B]"
      case "purchase":
        return "text-[#6B8E6E]"
      case "top-up":
        return "text-[#99FF33]"
      default:
        return "text-[#FFFFFF]"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[#99FF33]/10 text-[#99FF33]"
      case "pending":
        return "bg-[#FFB84D]/10 text-[#FFB84D]"
      case "failed":
        return "bg-[#FF6B6B]/10 text-[#FF6B6B]"
      default:
        return "bg-[#2a2826] text-[#FFFFFF]"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  if (transactions.length === 0) {
    return (
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <Card className="bg-[#1a1918] border-[#2a2826]">
          <CardHeader>
            <CardTitle className="text-[#FFFFFF] font-serif text-xl">
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <p className="text-[#6B8E6E] mb-4">No transactions yet</p>
            <p className="text-xs text-[#6B8E6E]">
              Your transaction history will appear here once you start earning or spending credits.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Card className="bg-[#1a1918] border-[#2a2826]">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-[#FFFFFF] font-serif text-xl">
              Transaction History
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40 bg-[#2a2826] border-[#2a2826] text-[#FFFFFF]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2826] border-[#2a2826]">
                  <SelectItem value="all" className="text-[#FFFFFF]">All Types</SelectItem>
                  <SelectItem value="income" className="text-[#FFFFFF]">Income</SelectItem>
                  <SelectItem value="expense" className="text-[#FFFFFF]">Expense</SelectItem>
                  <SelectItem value="purchase" className="text-[#FFFFFF]">Purchase</SelectItem>
                  <SelectItem value="top-up" className="text-[#FFFFFF]">Top-up</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-40 bg-[#2a2826] border-[#2a2826] text-[#FFFFFF]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2826] border-[#2a2826]">
                  <SelectItem value="date-desc" className="text-[#FFFFFF]">Newest First</SelectItem>
                  <SelectItem value="date-asc" className="text-[#FFFFFF]">Oldest First</SelectItem>
                  <SelectItem value="amount-desc" className="text-[#FFFFFF]">Highest Amount</SelectItem>
                  <SelectItem value="amount-asc" className="text-[#FFFFFF]">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Transaction List */}
          <motion.div variants={containerVariants} className="space-y-2">
            {paginatedTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                variants={itemVariants}
                onClick={() => onRowClick?.(transaction)}
                className={`p-4 bg-[#0f0e0d] rounded-lg border border-[#2a2826] hover:border-[#99FF33] transition-all cursor-pointer ${
                  onRowClick ? "hover:shadow-lg" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="p-2.5 bg-[#2a2826] rounded-lg">
                    {getTransactionIcon(transaction.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[#FFFFFF] font-semibold truncate">
                        {transaction.description}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B8E6E]">
                      {transaction.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className={`text-right font-semibold ${getTypeColor(transaction.type)}`}>
                    <p>
                      {transaction.type === "income" || transaction.type === "top-up" ? "+" : "-"}
                      {transaction.amount.toFixed(0)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 pt-6 border-t border-[#2a2826]">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#6B8E6E]">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSorted.length)} of{" "}
                  {filteredAndSorted.length}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-[#2a2826] text-[#99FF33] hover:bg-[#2a2826] disabled:opacity-50"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i + 1}
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                        className={
                          currentPage === i + 1
                            ? "bg-[#99FF33] text-[#121412] border-[#99FF33]"
                            : "border-[#2a2826] text-[#6B8E6E] hover:bg-[#2a2826]"
                        }
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="border-[#2a2826] text-[#99FF33] hover:bg-[#2a2826] disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
