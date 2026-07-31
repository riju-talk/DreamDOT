"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Check, CreditCard, Loader2, Wallet, Zap, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { getFakeTransactions, getCurrentUser } from "@/lib/fake-data"

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
  const user = getCurrentUser()
  const transactions = getFakeTransactions()

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
      <div className="min-h-screen" style={{ backgroundColor: "#0a0f1f" }}>
        {/* Header */}
        <div className="border-b" style={{ backgroundColor: "rgba(10, 15, 31, 0.5)", borderColor: "rgba(0, 255, 0, 0.2)" }} className="backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(0, 255, 0, 0.2)", border: "1px solid rgba(0, 255, 0, 0.3)" }}>
                  <Wallet className="h-6 w-6" style={{ color: "#00ff00" }} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Payment Center</h1>
                  <p style={{ color: "#a3a3a3" }}>Manage your credits and view transaction history</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="border-2" style={{ borderColor: "rgba(0, 255, 0, 0.3)", backgroundColor: "rgba(0, 255, 0, 0.05)" }}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "#a3a3a3" }}>Available Credits</span>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(0, 255, 0, 0.2)" }}>
                      <Zap className="h-4 w-4" style={{ color: "#00ff00" }} />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold" style={{ color: "#00ff00" }}>{user.credits.toLocaleString()}</div>
                  <p className="text-xs mt-2" style={{ color: "#606060" }}>Credits available for use</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-2" style={{ borderColor: "rgba(0, 255, 0, 0.3)", backgroundColor: "rgba(0, 255, 0, 0.05)" }}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "#a3a3a3" }}>Total Earnings</span>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(0, 255, 0, 0.2)" }}>
                      <TrendingUp className="h-4 w-4" style={{ color: "#00ff00" }} />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold" style={{ color: "#00ff00" }}>${totalEarnings.toFixed(2)}</div>
                  <p className="text-xs mt-2" style={{ color: "#606060" }}>From your digital products</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-2" style={{ borderColor: "rgba(0, 255, 0, 0.3)", backgroundColor: "rgba(0, 255, 0, 0.05)" }}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "#a3a3a3" }}>Total Invested</span>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(0, 255, 0, 0.2)" }}>
                      <CreditCard className="h-4 w-4" style={{ color: "#00ff00" }} />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold" style={{ color: "#00ff00" }}>${totalSpent.toFixed(2)}</div>
                  <p className="text-xs mt-2" style={{ color: "#606060" }}>Spent on credit packages</p>
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
              <h2 className="text-2xl font-bold mb-2 text-white">Buy Credits</h2>
              <p style={{ color: "#a3a3a3" }}>Choose the perfect plan for your needs</p>
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
                    className="relative border-2 h-full flex flex-col transition-all"
                    style={{
                      borderColor: pkg.popular ? "rgba(0, 255, 0, 0.6)" : "rgba(0, 255, 0, 0.3)",
                      backgroundColor: pkg.popular ? "rgba(0, 255, 0, 0.15)" : "rgba(0, 255, 0, 0.05)",
                    }}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge style={{ backgroundColor: "#00ff00", color: "#0a0f1f" }}>
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-white">{pkg.label}</CardTitle>
                      <CardDescription style={{ color: "#a3a3a3" }}>{pkg.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-6">
                      <div>
                        <div className="text-4xl font-bold mb-1" style={{ color: "#00ff00" }}>
                          {pkg.credits.toLocaleString()}
                        </div>
                        <p className="text-sm" style={{ color: "#a3a3a3" }}>credits</p>
                      </div>

                      <div className="text-3xl font-bold text-white">${pkg.price}</div>

                      <ul className="space-y-3">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#00ff00" }} />
                            <span className="text-sm" style={{ color: "#d4d4d8" }}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter>
                      <Button
                        onClick={() => handlePurchase(pkg)}
                        disabled={loading !== null}
                        className="w-full font-semibold"
                        style={{
                          backgroundColor: pkg.popular ? "#00ff00" : "rgba(0, 255, 0, 0.2)",
                          color: pkg.popular ? "#0a0f1f" : "#00ff00",
                        }}
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
              <h2 className="text-2xl font-bold mb-2 text-white">Transaction History</h2>
              <p style={{ color: "#a3a3a3" }}>Your recent payments and earnings</p>
            </div>

            <Card className="border-2" style={{ borderColor: "rgba(0, 255, 0, 0.3)", backgroundColor: "rgba(0, 255, 0, 0.05)" }}>
              <CardHeader>
                <CardTitle className="text-white">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {transactions.map((txn) => (
                    <motion.div
                      key={txn.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors border-b"
                      style={{ borderColor: "rgba(0, 255, 0, 0.2)" }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor:
                              txn.type === "earnings"
                                ? "rgba(0, 255, 0, 0.2)"
                                : txn.type === "purchase"
                                  ? "rgba(0, 255, 0, 0.2)"
                                  : "rgba(255, 0, 0, 0.2)",
                          }}
                        >
                          {txn.type === "earnings" ? (
                            <ArrowDownLeft className="h-4 w-4" style={{ color: "#00ff00" }} />
                          ) : txn.type === "purchase" ? (
                            <ArrowUpRight className="h-4 w-4" style={{ color: "#00ff00" }} />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" style={{ color: "#ff0000" }} />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold text-white capitalize">
                            {txn.type === "earnings" ? "Earnings" : txn.type === "purchase" ? "Credit Purchase" : "Refund"}
                          </div>
                          <div className="text-xs" style={{ color: "#606060" }}>{txn.createdAt.toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-white">
                            {txn.type === "earnings" ? "+" : "-"}${txn.amount.toFixed(2)}
                          </div>
                          {txn.credits > 0 && <div className="text-xs" style={{ color: "#606060" }}>+{txn.credits} credits</div>}
                        </div>
                        <Badge
                          style={{
                            backgroundColor: txn.status === "completed" ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 200, 0, 0.2)",
                            color: txn.status === "completed" ? "#00ff00" : "#ffc800",
                          }}
                        >
                          {txn.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
            <Card className="border-2" style={{ borderColor: "rgba(0, 255, 0, 0.3)", backgroundColor: "rgba(0, 255, 0, 0.05)" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5" style={{ color: "#00ff00" }} />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm" style={{ color: "#d4d4d8" }}>
                <p>1. Purchase credits based on your needs</p>
                <p>2. Use credits to upload and sell your digital products</p>
                <p>3. Earn money when creators purchase your products</p>
                <p>4. Withdraw earnings directly to your account</p>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: "rgba(0, 255, 0, 0.3)", backgroundColor: "rgba(0, 255, 0, 0.05)" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="h-5 w-5" style={{ color: "#00ff00" }} />
                  Payment Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm" style={{ color: "#d4d4d8" }}>
                <p>✓ SSL encrypted transactions</p>
                <p>✓ PCI DSS compliant</p>
                <p>✓ Instant payment processing</p>
                <p>✓ 24/7 fraud monitoring</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
