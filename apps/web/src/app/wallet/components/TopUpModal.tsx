"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, Zap, Loader2, X } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export interface CreditPackage {
  id: string
  credits: number
  price: number
  savings?: number
  popular?: boolean
}

interface TopUpModalProps {
  isOpen: boolean
  onClose: () => void
  packages: CreditPackage[]
  onConfirm?: (packageId: string) => Promise<void>
}

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "pkg-100",
    credits: 100,
    price: 9.99,
  },
  {
    id: "pkg-500",
    credits: 500,
    price: 39.99,
    savings: 20,
    popular: true,
  },
  {
    id: "pkg-1000",
    credits: 1000,
    price: 69.99,
    savings: 30,
  },
  {
    id: "pkg-5000",
    credits: 5000,
    price: 299.99,
    savings: 40,
  },
]

export function TopUpModal({
  isOpen,
  onClose,
  packages = CREDIT_PACKAGES,
  onConfirm,
}: TopUpModalProps) {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(packages[1]?.id || "")
  const [isLoading, setIsLoading] = useState(false)
  const [confirmationStep, setConfirmationStep] = useState(false)
  const { toast } = useToast()

  const selectedPackage = packages.find((p) => p.id === selectedPackageId)
  const pricePerCredit = selectedPackage ? (selectedPackage.price / selectedPackage.credits).toFixed(4) : "0"

  const handleConfirm = async () => {
    if (!selectedPackage) return

    setIsLoading(true)
    try {
      if (onConfirm) {
        await onConfirm(selectedPackageId)
      } else {
        // Simulate API call to create Stripe checkout session
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packageId: selectedPackageId,
            credits: selectedPackage.credits,
            price: selectedPackage.price,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create checkout session")
        }

        const data = await response.json()

        // Redirect to Stripe checkout
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        } else if (data.sessionId) {
          // Alternative: use Stripe.js to redirect
          toast({
            title: "Redirecting to payment...",
            description: "Please wait while we prepare your payment.",
          })
          // In production, this would use Stripe.js
          window.location.href = `/checkout/${data.sessionId}`
        }
      }

      setConfirmationStep(true)
      toast({
        title: "Payment processing",
        description: `Processing your purchase of ${selectedPackage.credits} credits...`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setConfirmationStep(false)
    setSelectedPackageId(packages[1]?.id || "")
    onClose()
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-[#1a1918] border-[#2a2826]">
        <AnimatePresence mode="wait">
          {!confirmationStep ? (
            <motion.div
              key="topup"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogHeader>
                <DialogTitle className="text-[#FFFFFF] font-serif text-xl">
                  Add Credits
                </DialogTitle>
                <DialogDescription className="text-[#6B8E6E]">
                  Choose a credit package and proceed to checkout
                </DialogDescription>
              </DialogHeader>

              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6 py-6"
              >
                {/* Package Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-[#FFFFFF]">
                    Select Package
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {packages.map((pkg) => (
                      <motion.button
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                          selectedPackageId === pkg.id
                            ? "border-[#99FF33] bg-[#99FF33]/10"
                            : "border-[#2a2826] bg-[#0f0e0d] hover:border-[#99FF33]/50"
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-2 -right-2">
                            <span className="bg-[#99FF33] text-[#121412] text-xs font-bold px-2 py-1 rounded-full">
                              Popular
                            </span>
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-[#FFFFFF] flex items-center gap-1">
                              <Zap className="h-4 w-4 text-[#99FF33]" />
                              {pkg.credits}
                            </p>
                            <p className="text-xs text-[#6B8E6E]">credits</p>
                          </div>
                          {selectedPackageId === pkg.id && (
                            <Check className="h-5 w-5 text-[#99FF33]" />
                          )}
                        </div>

                        <p className="font-bold text-[#99FF33] text-lg">
                          ${pkg.price.toFixed(2)}
                        </p>

                        {pkg.savings && (
                          <p className="text-xs text-[#99FF33] font-semibold mt-2">
                            Save {pkg.savings}%
                          </p>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                {selectedPackage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0f0e0d] rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B8E6E]">Credits</span>
                      <span className="text-[#FFFFFF] font-semibold">
                        {selectedPackage.credits}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B8E6E]">Price per credit</span>
                      <span className="text-[#FFFFFF] font-semibold">
                        ${pricePerCredit}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#2a2826] flex justify-between">
                      <span className="text-[#FFFFFF] font-semibold">Total</span>
                      <span className="text-[#99FF33] font-bold text-lg">
                        ${selectedPackage.price.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Info Message */}
                <div className="bg-[#99FF33]/10 border border-[#99FF33]/20 rounded-lg p-3">
                  <p className="text-xs text-[#6B8E6E]">
                    You will be redirected to secure Stripe payment portal. Your credits will be
                    instantly added to your account after successful payment.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 border-[#2a2826] text-[#FFFFFF] hover:bg-[#2a2826]"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleConfirm}
                    disabled={isLoading || !selectedPackage}
                    className="flex-1 bg-[#99FF33] text-[#121412] hover:bg-[#85e022] font-semibold disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Checkout
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* Confirmation Step */
            <motion.div
              key="confirmation"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-16 h-16 bg-[#99FF33] rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check className="h-8 w-8 text-[#121412]" />
              </motion.div>

              <h3 className="text-xl font-semibold text-[#FFFFFF] mb-2">
                Payment initiated!
              </h3>

              <p className="text-[#6B8E6E] mb-6">
                {selectedPackage
                  ? `You're being redirected to checkout to purchase ${selectedPackage.credits} credits for $${selectedPackage.price.toFixed(2)}.`
                  : "Processing your request..."}
              </p>

              <Button
                onClick={handleClose}
                className="w-full bg-[#99FF33] text-[#121412] hover:bg-[#85e022] font-semibold"
              >
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
