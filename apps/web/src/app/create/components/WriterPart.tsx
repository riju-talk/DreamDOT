'use client'

import { useCreatorStudioStore } from '@/lib/store/useCreatorStudioStore'
import { RichTextEditor } from '@/components/rich-text-editor'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  PenTool, 
  DollarSign,
} from 'lucide-react'
import { motion } from 'framer-motion'

const PRICING_MODELS = [
  { value: 'free', label: 'Free', desc: 'Anyone can access' },
  { value: 'paid', label: 'Paid', desc: 'One-time purchase' },
  { value: 'subscription', label: 'Subscription', desc: 'Recurring monthly' },
  { value: 'bundle', label: 'Bundle', desc: 'Group of items' },
]

export function WriterPart() {
  const { draft, errors, updateDraft } = useCreatorStudioStore()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Rich Text Editor */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card border-border/50 overflow-hidden">
          <CardHeader className="pb-4 border-b border-border/30">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PenTool className="h-5 w-5 text-primary" />
              Content
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              <RichTextEditor
                value={draft.script}
                onChange={(html) => updateDraft({ script: html })}
                placeholder="Write your content here... Use the toolbar to format your text."
              />
              <div className="px-6 pb-4 flex justify-between items-center text-xs">
                {errors.script ? (
                  <span className="text-destructive font-medium">{errors.script}</span>
                ) : (
                  <span className="text-muted-foreground">Minimum 10 characters required</span>
                )}
                <span className="text-muted-foreground font-mono">{draft.script.length} characters</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pricing Model */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-primary" />
              Pricing Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
      </motion.div>

      {/* Price (if paid) */}
      {draft.pricingModel === 'paid' && (
        <motion.div variants={itemVariants}>
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
        </motion.div>
      )}
    </motion.div>
  )
}
