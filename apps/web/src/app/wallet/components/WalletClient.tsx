"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Wallet, History, Plus, Star, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface BalanceResponse {
  balance: { credits: number }
  stats: { totalSpent: number; totalEarned: number }
}

interface Transaction {
  id: string
  type: "income" | "expense" | "topup"
  itemTitle: string
  amountDisplay: string
  status: string
  timestamp: string
}

const QUICK_AMOUNTS = [100, 500, 1000]

export function WalletClient() {
  const [balance, setBalance] = useState<BalanceResponse | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [amount, setAmount] = useState("100")
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [balRes, txRes] = await Promise.all([
        fetch("/api/balance"),
        fetch("/api/transactions?limit=25"),
      ])
      if (balRes.ok) setBalance(await balRes.json())
      if (txRes.ok) {
        const data = await txRes.json()
        setTransactions(data.transactions ?? [])
      }
    } catch (error) {
      console.error("[UI] Failed to load wallet:", error)
      toast.error("Could not load your wallet")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleTopUp = async () => {
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter a valid amount")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/balance/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: value,
          review:
            rating > 0 || reviewText.trim()
              ? { rating: rating || undefined, text: reviewText.trim() || undefined }
              : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Top-up failed")
      toast.success(`Added ${value} credits`)
      setModalOpen(false)
      setRating(0)
      setReviewText("")
      setAmount("100")
      load()
    } catch (error) {
      console.error("[UI] Top-up error:", error)
      toast.error(error instanceof Error ? error.message : "Top-up failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="mb-4 inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-[0.3em] uppercase">
          Vault
        </span>
        <h1 className="text-4xl font-serif tracking-tight">Wallet</h1>
        <p className="text-muted-foreground mt-2">
          Manage your credit balance and transactions on DreamDot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-serif">Balance</CardTitle>
              </div>
              <Button size="sm" onClick={() => setModalOpen(true)} className="rounded-xl">
                <Plus className="h-4 w-4 mr-1" /> Add Credits
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : (
              <>
                <div className="text-4xl font-bold text-primary">
                  {(balance?.balance.credits ?? 0).toLocaleString()}
                  <span className="text-base font-normal text-muted-foreground ml-2">credits</span>
                </div>
                <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Spent</span>
                    <span>{(balance?.stats.totalSpent ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Earned</span>
                    <span>{(balance?.stats.totalEarned ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <History className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg font-serif">Transaction History</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : transactions.length === 0 ? (
              <p className="text-muted-foreground">No transactions yet.</p>
            ) : (
              <ul className="divide-y divide-border/50">
                {transactions.map((tx) => (
                  <li key={tx.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <p className="font-medium">{tx.itemTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString()} · {tx.status}
                      </p>
                    </div>
                    <span
                      className={
                        tx.amountDisplay.startsWith("+")
                          ? "text-primary font-semibold"
                          : "text-muted-foreground font-semibold"
                      }
                    >
                      {tx.amountDisplay}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Credits</DialogTitle>
            <DialogDescription>
              Payments are a demo — top up for free. If this were a paid product, leave a review
              about buying credits.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              {QUICK_AMOUNTS.map((a) => (
                <Button
                  key={a}
                  type="button"
                  variant={Number(amount) === a ? "default" : "outline"}
                  className="flex-1 rounded-xl"
                  onClick={() => setAmount(String(a))}
                >
                  {a}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Custom amount"
              className="rounded-xl"
            />

            <div className="space-y-2 pt-2 border-t border-border/50">
              <p className="text-sm font-medium">Leave a review (optional)</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n === rating ? 0 : n)}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={
                        n <= rating
                          ? "h-6 w-6 fill-primary text-primary"
                          : "h-6 w-6 text-muted-foreground"
                      }
                    />
                  </button>
                ))}
              </div>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What would you say about paying for credits here?"
                className="rounded-xl"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleTopUp} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Add {Number(amount) > 0 ? Number(amount).toLocaleString() : ""} credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
