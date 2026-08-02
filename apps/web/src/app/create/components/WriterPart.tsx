'use client'

import { useCreatorStudioStore } from '@/lib/store/useCreatorStudioStore'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const CATEGORIES = [
  { value: 'writing', label: '📝 Writing' },
  { value: 'art', label: '🎨 Art' },
  { value: 'audio', label: '🎵 Audio' },
  { value: 'video', label: '🎬 Video' },
  { value: 'template', label: '📋 Template' },
  { value: 'code', label: '💻 Code' },
  { value: 'research', label: '🔬 Research' },
]

const PRICING_MODELS = [
  { value: 'free', label: 'Free', desc: 'Anyone can access' },
  { value: 'paid', label: 'Paid', desc: 'One-time purchase' },
  { value: 'subscription', label: 'Subscription', desc: 'Recurring monthly' },
  { value: 'bundle', label: 'Bundle', desc: 'Group of items' },
]

export function WriterPart() {
  const { draft, errors, updateDraft } = useCreatorStudioStore()

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <Label className="text-[#FFFFFF]">Title *</Label>
        <Input
          value={draft.title}
          onChange={(e) => updateDraft({ title: e.target.value })}
          placeholder="Enter title"
          maxLength={140}
          className="bg-[#1a1918] border-[#2a2826] text-[#FFFFFF] mt-2"
        />
        <div className="flex justify-between text-xs mt-1">
          {errors.title ? <span className="text-red-500">{errors.title}</span> : <span />}
          <span className="text-[#6B8E6E]">{draft.title.length}/140</span>
        </div>
      </div>

      {/* Category */}
      <div>
        <Label className="text-[#FFFFFF]">Category *</Label>
        <Select value={draft.category} onValueChange={(val) => updateDraft({ category: val })}>
          <SelectTrigger className="bg-[#1a1918] border-[#2a2826] text-[#FFFFFF] mt-2">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1918] border-[#2a2826]">
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <span className="text-xs text-red-500 mt-1 block">{errors.category}</span>}
      </div>

      {/* Script */}
      <div>
        <Label className="text-[#FFFFFF]">Script / Content *</Label>
        <Textarea
          value={draft.script}
          onChange={(e) => updateDraft({ script: e.target.value })}
          placeholder="Write your script or content here (min 10 characters)..."
          className="bg-[#1a1918] border-[#2a2826] text-[#FFFFFF] min-h-48 mt-2"
        />
        <div className="flex justify-between text-xs mt-1">
          {errors.script ? <span className="text-red-500">{errors.script}</span> : <span />}
          <span className="text-[#6B8E6E]">{draft.script.length} characters</span>
        </div>
      </div>

      {/* Pricing Model */}
      <div>
        <Label className="text-[#FFFFFF]">Pricing Model *</Label>
        <div className="space-y-3 mt-3">
          {PRICING_MODELS.map((model) => (
            <label key={model.value} className="flex items-start gap-3 cursor-pointer p-3 rounded border border-[#2a2826] hover:border-[#99FF33] transition-colors">
              <input
                type="radio"
                value={model.value}
                checked={draft.pricingModel === model.value}
                onChange={(e) => updateDraft({ pricingModel: e.target.value as any })}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-semibold text-[#FFFFFF]">{model.label}</p>
                <p className="text-xs text-[#6B8E6E]">{model.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price (if paid) */}
      {draft.pricingModel === 'paid' && (
        <div>
          <Label className="text-[#FFFFFF]">Price (in credits) *</Label>
          <Input
            type="number"
            value={draft.priceCredits || ''}
            onChange={(e) => updateDraft({ priceCredits: parseInt(e.target.value) || 0 })}
            placeholder="100"
            min={1}
            className="bg-[#1a1918] border-[#2a2826] text-[#FFFFFF] mt-2"
          />
          <p className="text-xs text-[#6B8E6E] mt-1">≈ ${(draft.priceCredits * 0.01).toFixed(2)} USD</p>
        </div>
      )}

      {/* Description */}
      <div>
        <Label className="text-[#FFFFFF]">Description (optional)</Label>
        <Textarea
          value={draft.description || ''}
          onChange={(e) => updateDraft({ description: e.target.value })}
          placeholder="Add a description..."
          maxLength={500}
          className="bg-[#1a1918] border-[#2a2826] text-[#FFFFFF] mt-2"
        />
        <p className="text-xs text-[#6B8E6E] mt-1">{(draft.description || '').length}/500</p>
      </div>
    </div>
  )
}
