'use client'

import { useEffect, useState } from 'react'
import { useCreatorStudioStore } from '@/lib/store/useCreatorStudioStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Repeat, CalendarClock } from 'lucide-react'
import { motion } from 'framer-motion'

const PRICING_MODELS = [
  { value: 'free', label: 'Free', desc: 'Anyone can access' },
  { value: 'paid', label: 'Paid', desc: 'One-time purchase' },
  { value: 'subscription', label: 'Subscription', desc: 'Recurring monthly or annually' },
]

const BILLING_CYCLES = [
  { value: 'monthly', label: 'Monthly', desc: 'Billed every month' },
  { value: 'annually', label: 'Annually', desc: 'Billed once per year' },
]

export function PricingPart() {
  const { draft, updateDraft, errors } = useCreatorStudioStore()
  const [defaults, setDefaults] = useState({ monthly: 0, annually: 0 })

  useEffect(() => {
    const loadDefaults = async () => {
      try {
        const response = await fetch('/api/settings/monetization')
        if (!response.ok) return
        const data = await response.json()
        setDefaults({
          monthly: data.monthlyPriceCredits || 0,
          annually: data.annualPriceCredits || 0,
        })
      } catch (error) {
        console.error('Failed to load monetization defaults:', error)
      }
    }

    loadDefaults()
  }, [])

  return (
    <div className="space-y-6">
      {/* Pricing Model */}
      <Card className="bg-card border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-primary" />
            Pricing Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRICING_MODELS.map((model) => (
              <motion.label
                key={model.value}
                className={`flex items-start gap-3 cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  draft.pricingModel === model.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-muted/30 hover:border-primary/30'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="radio"
                  value={model.value}
                  checked={draft.pricingModel === model.value}
                  onChange={(e) => updateDraft({ pricingModel: e.target.value as any })}
                  className="mt-1 accent-primary"
                />
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{model.label}</p>
                  <p className="text-xs text-muted-foreground">{model.desc}</p>
                </div>
              </motion.label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price (if paid) */}
      {draft.pricingModel === 'paid' && (
        <Card className="bg-primary/5 border border-primary/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <DollarSign className="h-5 w-5" />
              Set Your Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-semibold">Price in Credits *</Label>
                <Input
                  type="number"
                  value={draft.priceCredits || ''}
                  onChange={(e) => updateDraft({ priceCredits: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 100"
                  min={1}
                  className="text-base py-6"
                />
              </div>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground">Approximately:</p>
                <p className="text-2xl font-bold text-primary">${(draft.priceCredits * 0.01).toFixed(2)} USD</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription billing cycle (prices come from Settings → Monetization) */}
      {draft.pricingModel === 'subscription' && (
        <Card className="bg-primary/5 border border-primary/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <DollarSign className="h-5 w-5" />
              Billing Cycle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Subscription prices are set in <span className="font-semibold text-foreground">Settings → Monetization</span>.
              Choose how subscribers get billed:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BILLING_CYCLES.map((cycle) => (
                <motion.label
                  key={cycle.value}
                  className={`flex items-start gap-3 cursor-pointer p-4 rounded-lg border-2 transition-all ${
                    draft.subscriptionBillingCycle === cycle.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-muted/30 hover:border-primary/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="radio"
                    value={cycle.value}
                    checked={(draft.subscriptionBillingCycle || 'monthly') === cycle.value}
                    onChange={(e) => updateDraft({ subscriptionBillingCycle: e.target.value as any })}
                    className="mt-1 accent-primary"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm flex items-center gap-2">
                      {cycle.value === 'monthly' ? (
                        <Repeat className="h-4 w-4 text-primary" />
                      ) : (
                        <CalendarClock className="h-4 w-4 text-primary" />
                      )}
                      {cycle.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{cycle.desc}</p>
                    <p className="text-primary font-bold text-sm mt-1">
                      {cycle.value === 'monthly'
                        ? `$${(defaults.monthly * 0.01).toFixed(2)} / month`
                        : `$${(defaults.annually * 0.01).toFixed(2)} / year`}
                    </p>
                  </div>
                </motion.label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
