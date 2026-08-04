"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BadgeDollarSign, CalendarClock, Repeat } from "lucide-react"
import { toast } from "sonner"

export function MonetizationSettingsTab() {
  const [monthlyCredits, setMonthlyCredits] = useState("")
  const [annualCredits, setAnnualCredits] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadDefaults = async () => {
      try {
        const response = await fetch("/api/settings/monetization")
        if (response.ok) {
          const data = await response.json()
          setMonthlyCredits(String(data.monthlyPriceCredits ?? ""))
          setAnnualCredits(String(data.annualPriceCredits ?? ""))
        }
      } catch (error) {
        console.error("Failed to load monetization settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDefaults()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/settings/monetization", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyPriceCredits: parseInt(monthlyCredits) || 0,
          annualPriceCredits: parseInt(annualCredits) || 0,
        }),
      })

      if (response.ok) {
        toast.success("Monetization defaults updated")
      } else {
        toast.error("Failed to update monetization settings")
      }
    } catch (error) {
      toast.error("Failed to update monetization settings")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading monetization settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <h3 className="font-serif text-lg font-black italic text-slate-900 dark:text-slate-50">
            Subscription Pricing Defaults
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            These prices are used as defaults when creating a new subscription item. Set them however you like —
            you can always override them per item when publishing.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="monthlyCredits" className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Repeat className="size-4 text-[#5a8c5a] dark:text-primary" />
              Default Monthly Price (Credits)
            </Label>
            <Input
              id="monthlyCredits"
              type="number"
              min={1}
              value={monthlyCredits}
              onChange={(e) => setMonthlyCredits(e.target.value)}
              placeholder="e.g., 500"
              className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Approximately ${((parseInt(monthlyCredits) || 0) * 0.01).toFixed(2)} USD / month
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualCredits" className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarClock className="size-4 text-[#5a8c5a] dark:text-primary" />
              Default Annually Price (Credits)
            </Label>
            <Input
              id="annualCredits"
              type="number"
              min={1}
              value={annualCredits}
              onChange={(e) => setAnnualCredits(e.target.value)}
              placeholder="e.g., 5000"
              className="h-11 rounded-lg border-[#5a8c5a]/30 dark:border-primary/30 bg-white/85 dark:bg-muted/20 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-[#5a8c5a] dark:focus-visible:ring-primary"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Approximately ${((parseInt(annualCredits) || 0) * 0.01).toFixed(2)} USD / year
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-11 rounded-full bg-[#5a8c5a] dark:bg-primary text-sm font-black uppercase tracking-[0.12em] text-white dark:text-primary-foreground shadow-sm dark:shadow-glow hover:bg-[#4a7c4a] dark:hover:bg-primary/90 disabled:opacity-60 mt-2"
          >
            {isSaving ? "Saving..." : "Save Defaults"}
          </Button>
        </div>
      </Card>

      <Card className="border-[#5a8c5a]/15 dark:border-primary/15 bg-white/80 dark:bg-muted/20 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#5a8c5a]/10 dark:bg-primary/10">
            <BadgeDollarSign className="size-5 text-[#5a8c5a] dark:text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-50">How it works</p>
<p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            When you select "Subscription" as the pricing model on a new item, you only choose between monthly
            and annually billing — the price comes from these defaults. You can't change it per item.
          </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
