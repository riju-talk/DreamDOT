'use client'

import { useCreatorStudioStore } from '@/lib/store/useCreatorStudioStore'
import { WriterPart } from './components/WriterPart'
import { MediaPart } from './components/MediaPart'
import { BundlePart } from './components/BundlePart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function CreatePage() {
  const router = useRouter()
  const { step, setStep, draft, isValid, validateDraft, publishDraft } = useCreatorStudioStore()
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState('')
  const [publishSuccess, setPublishSuccess] = useState(false)

  const tabs = [
    { id: 'writer', label: 'Writer', icon: '📝' },
    { id: 'media', label: 'Media', icon: '🖼️' },
    { id: 'bundle', label: 'Bundle', icon: '📦' },
  ]

  const stepNumber = tabs.findIndex((t) => t.id === step) + 1

  const handleNext = () => {
    if (validateDraft()) {
      const nextStep = tabs[stepNumber]?.id
      if (nextStep) setStep(nextStep as any)
    }
  }

  const handlePrevious = () => {
    const prevStep = tabs[stepNumber - 2]?.id
    if (prevStep) setStep(prevStep as any)
  }

  const handlePublish = async () => {
    if (!validateDraft()) {
      setPublishError('Please fill in all required fields')
      return
    }

    setPublishing(true)
    setPublishError('')

    const result = await publishDraft()
    setPublishing(false)

    if (result.success) {
      setPublishSuccess(true)
      setTimeout(() => {
        router.push(`/items/${result.itemId}`)
      }, 2000)
    } else {
      setPublishError(result.error || 'Failed to publish')
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-[#121412]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2">Creator Studio</h1>
            <p className="text-[#6B8E6E]">Step {stepNumber} of {tabs.length}: {tabs.find((t) => t.id === step)?.label}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-[#2a2826]">
            {tabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setStep(tab.id as any)}
                className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
                  step === tab.id ? 'border-[#99FF33] text-[#99FF33]' : 'border-transparent text-[#6B8E6E] hover:text-[#FFFFFF]'
                }`}
              >
                <span>{tab.icon} {tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Panel */}
            <div className="lg:col-span-2">
              {step === 'writer' && <WriterPart />}
              {step === 'media' && <MediaPart />}
              {step === 'bundle' && <BundlePart />}
            </div>

            {/* Preview Panel */}
            <div>
              <Card className="bg-[#1a1918] border-[#2a2826] sticky top-20">
                <CardContent className="pt-6">
                  <h3 className="text-[#FFFFFF] font-semibold mb-4">Preview</h3>

                  {/* Draft Info */}
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-[#6B8E6E] text-xs">Title</p>
                      <p className="text-[#FFFFFF] font-semibold">{draft.title || '(Not set)'}</p>
                    </div>

                    <div>
                      <p className="text-[#6B8E6E] text-xs">Category</p>
                      <p className="text-[#FFFFFF]">{draft.category || '(Not set)'}</p>
                    </div>

                    <div>
                      <p className="text-[#6B8E6E] text-xs">Pricing Model</p>
                      <p className="text-[#FFFFFF]">{draft.pricingModel}</p>
                    </div>

                    {draft.pricingModel === 'paid' && (
                      <div>
                        <p className="text-[#6B8E6E] text-xs">Price</p>
                        <p className="text-[#99FF33] font-semibold">${(draft.priceCredits * 0.01).toFixed(2)}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-[#6B8E6E] text-xs">Media Files</p>
                      <p className="text-[#FFFFFF]">{draft.mediaFiles.length} file(s)</p>
                    </div>

                    {draft.pricingModel === 'bundle' && (
                      <div>
                        <p className="text-[#6B8E6E] text-xs">Bundle Items</p>
                        <p className="text-[#FFFFFF]">{draft.bundleItemIds.length} item(s)</p>
                      </div>
                    )}
                  </div>

                  {/* Validation Status */}
                  <div className="mt-6 p-3 rounded border border-[#2a2826]">
                    <div className="flex items-center gap-2 mb-2">
                      {isValid ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-[#99FF33]" />
                          <span className="text-[#99FF33] text-sm font-semibold">Ready to publish</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-red-500 text-sm font-semibold">Incomplete</span>
                        </>
                      )}
                    </div>
                    <ul className="space-y-1 text-xs text-[#6B8E6E]">
                      <li>✓ Title: {draft.title ? '✓' : '✗'}</li>
                      <li>✓ Script: {draft.script.length >= 10 ? '✓' : '✗'}</li>
                      <li>✓ Category: {draft.category ? '✓' : '✗'}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8 justify-end">
            <Button
              onClick={handlePrevious}
              disabled={stepNumber === 1}
              variant="outline"
              className="border-[#2a2826] text-[#FFFFFF] hover:bg-[#2a2826]"
            >
              Previous
            </Button>

            {stepNumber < tabs.length ? (
              <Button onClick={handleNext} className="bg-[#99FF33] text-[#121412] hover:bg-[#85e022]">
                Next
              </Button>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={!isValid || publishing}
                className="bg-[#99FF33] text-[#121412] hover:bg-[#85e022] disabled:opacity-50"
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish'
                )}
              </Button>
            )}
          </div>

          {/* Publish Status */}
          {publishError && <div className="mt-4 p-4 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">{publishError}</div>}

          {publishSuccess && (
            <div className="mt-4 p-4 bg-green-900/20 border border-green-700/50 rounded text-green-400 text-sm">✓ Published successfully! Redirecting...</div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
