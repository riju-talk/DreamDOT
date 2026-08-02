"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Check, CreditCard, Loader2, Wallet, Zap, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface Transaction {
  id: string
  type: "earnings" | "purchase" | "refund"
  amount: number
  credits: number
  status: "completed" | "pending"
  createdAt: Date
}

interface User {
  credits: number
}

const DUMMY_USER: User = {
  credits: 2500,
}

const DUMMY_TRANSACTIONS: Transaction[] = []

const CREDIT_PACKAGES = [
  {
    id: "starter",
    credits: 100,
    price: 10,
    label: "Starter",
    description: "Perfect for getting started",
    popular: false,
    features: ["100 credits", "1-month access", "Email support"],
  },
  {
    id: "pro",
    credits: 500,
    price: 45,
    label: "Pro",
    description: "Best value for creators",
    popular: true,
    features: ["500 credits", "3-month access", "Priority support", "20% bonus credits"],
  },
  {
    id: "elite",
    credits: 1000,
    price: 85,
    label: "Elite",
    description: "For serious power users",
    popular: false,
    features: ["1000 credits", "Annual access", "VIP support", "50% bonus credits"],
  },
  {
    id: "enterprise",
    credits: 5000,
    price: 350,
    label: "Enterprise",
    description: "For established creators",
    popular: false,
    features: ["5000 credits", "Lifetime access", "Dedicated manager", "100% bonus credits"],
  },
]

export default function PaymentPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const user = DUMMY_USER
  const transactions = DUMMY_TRANSACTIONS

  const handlePurchase = async (pkg: typeof CREDIT_PACKAGES[0]) => {
    setLoading(pkg.id)
    setSelectedPackage(pkg.id)
    setTimeout(() => {
      setLoading(null)
    }, 2000)
  }

  const totalEarnings = transactions
    .filter((t) => t.type === "earnings")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalSpent = transactions
    .filter((t) => t.type === "purchase")
    .reduce((sum, t) => sum + t.amount, 0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <AuthenticatedLayout>
      <div className="w-full h-full flex flex-col gap-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Payment Center</h1>
              <p className="text-muted-foreground">Manage your credits and view transaction history</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="border border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Available Credits</span>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{user.credits.toLocaleString()}</div>
                <p className="text-xs mt-2 text-muted-foreground">Credits available for use</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total Earnings</span>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">${totalEarnings.toFixed(2)}</div>
                <p className="text-xs mt-2 text-muted-foreground">From your digital products</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total Invested</span>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">${totalSpent.toFixed(2)}</div>
                <p className="text-xs mt-2 text-muted-foreground">Spent on credit packages</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Credit Packages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold mb-2">Buy Credits</h2>
            <p className="text-muted-foreground">Choose the perfect plan for your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREDIT_PACKAGES.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card
                  className={cn(
                    "relative border-2 h-full flex flex-col transition-all",
                    pkg.popular ? "border-primary/60 bg-primary/10" : "border-border/50"
                  )}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">{pkg.label}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-6">
                    <div>
                      <div className="text-4xl font-bold mb-1 text-primary">
                        {pkg.credits.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">credits</p>
                    </div>

                    <div className="text-3xl font-bold">${pkg.price}</div>

                    <ul className="space-y-3">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => handlePurchase(pkg)}
                      disabled={loading !== null}
                      className="w-full font-semibold"
                      variant={pkg.popular ? "default" : "outline"}
                    >
                      {loading === pkg.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {selectedPackage === pkg.id && <Check className="mr-2 h-4 w-4" />}
                          {selectedPackage === pkg.id ? "Purchased" : "Buy Now"}
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold mb-2">Transaction History</h2>
            <p className="text-muted-foreground">Your recent payments and earnings</p>
          </div>

          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {transactions.map((txn) => (
                    <motion.div
                      key={txn.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/50 transition-colors border-b border-border/50"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {txn.type === "earnings" ? (
                            <ArrowDownLeft className="h-4 w-4 text-primary" />
                          ) : txn.type === "purchase" ? (
                            <ArrowUpRight className="h-4 w-4 text-primary" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-destructive" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold capitalize">
                            {txn.type === "earnings" ? "Earnings" : txn.type === "purchase" ? "Credit Purchase" : "Refund"}
                          </div>
                          <div className="text-xs text-muted-foreground">{txn.createdAt.toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">
                            {txn.type === "earnings" ? "+" : "-"}${txn.amount.toFixed(2)}
                          </div>
                          {txn.credits > 0 && <div className="text-xs text-muted-foreground">+{txn.credits} credits</div>}
                        </div>
                        <Badge variant={txn.status === "completed" ? "default" : "secondary"}>
                          {txn.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ/Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 py-12"
        >
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>1. Purchase credits based on your needs</p>
              <p>2. Use credits to upload and sell your digital products</p>
              <p>3. Earn money when creators purchase your products</p>
              <p>4. Withdraw earnings directly to your account</p>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>✓ SSL encrypted transactions</p>
              <p>✓ PCI DSS compliant</p>
              <p>✓ Instant payment processing</p>
              <p>✓ 24/7 fraud monitoring</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  )
}
