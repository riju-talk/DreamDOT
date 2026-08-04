'use client'

import { useCreatorStudioStore } from '@/lib/store/useCreatorStudioStore'
import { WriterPart } from './components/WriterPart'
import { MediaPart } from './components/MediaPart'
import { BundlePart } from './components/BundlePart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  PenTool,
  Image as ImageIcon,
  Package,
  Sparkles,
  Zap,
  Target,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getVisibleTextLength } from '@/lib/utils'

export default function CreatePage() {
  const router = useRouter()
  const { step, setStep, draft, isValid, validateDraft, publishDraft } = useCreatorStudioStore()
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState('')
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  const assetTypes = [
    { id: 'writer', label: 'Writer', icon: PenTool, desc: 'Create your content', subtitle: 'Write engaging stories, articles, and descriptions' },
    { id: 'media', label: 'Media', icon: ImageIcon, desc: 'Upload assets', subtitle: 'Add images, videos, audio, and 3D files' },
    { id: 'bundle', label: 'Bundle', icon: Package, desc: 'Group items', subtitle: 'Package assets for better monetization' },
  ]

  const currentAsset = assetTypes.find((t) => t.id === step)

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
      if (!result.itemId) {
        console.error('❌ BUG: Success but no itemId returned:', result)
        setPublishError('Published successfully but no item ID returned. Redirecting to profile...')
        setTimeout(() => {
          router.push('/profile')
        }, 2000)
        return
      }
      
      console.log('✅ Publishing successful! Redirecting to:', `/items/${result.itemId}`)
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
      <div className="w-full h-full flex flex-col gap-8 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              {currentAsset && <currentAsset.icon className="h-6 w-6 text-primary" />}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Creator Studio</h1>
              <p className="text-muted-foreground">{currentAsset?.desc}</p>
            </div>
          </div>
        </motion.div>

        {/* Title & Description - Mandatory Fields */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Essential Details</h2>
            <Badge className="ml-auto bg-primary/20 text-primary border-primary/30">Required</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                placeholder="Give your asset a compelling title..."
                value={draft.title || ''}
                onChange={(e) => {
                  // Update store
                  const store = useCreatorStudioStore.getState()
                  store.updateDraft({ title: e.target.value })
                }}
                maxLength={100}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border/50 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <p className="text-xs text-muted-foreground">{(draft.title || '').length}/100 characters</p>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                value={draft.category || ''}
                onChange={(e) => {
                  // Update store
                  const store = useCreatorStudioStore.getState()
                  store.updateDraft({ category: e.target.value })
                }}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border/50 text-foreground focus:border-primary focus:outline-none transition-colors"
              >
                <option value="">Select a category...</option>
                <option value="art">Digital Art</option>
                <option value="design">Design</option>
                <option value="photography">Photography</option>
                <option value="animation">Animation</option>
                <option value="music">Music</option>
                <option value="3d">3D Assets</option>
                <option value="code">Code</option>
                <option value="writing">Writing</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              placeholder="Describe your asset in detail. What makes it unique? Who is it for? Include relevant details about the content..."
              value={draft.description || ''}
              onChange={(e) => {
                // Update store
                const store = useCreatorStudioStore.getState()
                store.updateDraft({ description: e.target.value })
              }}
              maxLength={500}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border/50 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
            />
            <p className="text-xs text-muted-foreground">{(draft.description || '').length}/500 characters</p>
          </div>
        </motion.div>

        {/* Asset Type Selection Grid */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-4">
            {assetTypes.map((assetType) => {
              const AssetIcon = assetType.icon
              const isActive = step === assetType.id
              
              return (
                <motion.button
                  key={assetType.id}
                  onClick={() => setStep(assetType.id as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`h-full transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                        : 'border-border hover:border-primary/30 hover:bg-card/50'
                    }`}
                  >
                    <CardContent className="p-6 text-center space-y-3">
                      <div className={`p-3 rounded-lg w-fit mx-auto ${
                        isActive 
                          ? 'bg-primary/20' 
                          : 'bg-muted'
                      }`}>
                        <AssetIcon className={`h-6 w-6 ${
                          isActive 
                            ? 'text-primary' 
                            : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          isActive 
                            ? 'text-primary' 
                            : 'text-foreground'
                        }`}>
                          {assetType.label}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {assetType.subtitle}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
          {/* Editor Panel */}
          <motion.div 
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            {step === 'writer' && <WriterPart />}
            {step === 'media' && <MediaPart />}
            {step === 'bundle' && <BundlePart />}
          </motion.div>

          {/* Preview Panel - Sticky */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="sticky top-24 bg-card border-border/50 shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Preview & Status
                </h3>

                {/* Draft Info Grid */}
                <div className="space-y-4 mb-6">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</p>
                    <p className="text-foreground font-semibold mt-1">{draft.title || '—'}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</p>
                    <p className="text-foreground font-semibold mt-1">{draft.category || '—'}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pricing</p>
                    <p className="text-foreground font-semibold mt-1 capitalize">{draft.pricingModel}</p>
                  </div>

                  {draft.pricingModel === 'paid' && (
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide">Price</p>
                      <p className="text-primary font-bold text-lg mt-1">${(draft.priceCredits * 0.01).toFixed(2)}</p>
                    </div>
                  )}

                  {draft.pricingModel === 'subscription' && (
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide">Subscription</p>
                      <p className="text-primary font-bold text-lg mt-1 capitalize">
                        {draft.subscriptionBillingCycle === 'monthly' ? 'Monthly' : 'Annually'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Price set in Settings</p>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Media Files</p>
                    <p className="text-foreground font-semibold mt-1">{draft.mediaFiles.length}</p>
                  </div>

                  {step === 'bundle' && (
                    <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bundle Items</p>
                      <p className="text-foreground font-semibold mt-1">{draft.bundleItemIds.length}</p>
                    </div>
                  )}
                </div>

                {/* Validation Status */}
                <div className={`p-4 rounded-lg border-2 ${
                  isValid 
                    ? 'bg-primary/5 border-primary/30' 
                    : 'bg-destructive/5 border-destructive/30'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {isValid ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-primary font-bold">Ready to publish</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                        <span className="text-destructive font-bold">Incomplete</span>
                      </>
                    )}
                  </div>
                  
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className={`text-lg ${draft.title ? 'text-primary' : 'text-muted-foreground'}`}>
                        {draft.title ? '✓' : '○'}
                      </span>
                      <span className={draft.title ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                        Title
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`text-lg ${getVisibleTextLength(draft.script || draft.description || '') >= 10 ? 'text-primary' : 'text-muted-foreground'}`}>
                        {getVisibleTextLength(draft.script || draft.description || '') >= 10 ? '✓' : '○'}
                      </span>
                      <span className={getVisibleTextLength(draft.script || draft.description || '') >= 10 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                        Content
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`text-lg ${draft.category ? 'text-primary' : 'text-muted-foreground'}`}>
                        {draft.category ? '✓' : '○'}
                      </span>
                      <span className={draft.category ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                        Category
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actions Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-4 justify-end pt-4 border-t border-border/30"
        >
          <Button
            onClick={handlePublish}
            disabled={!isValid || publishing}
            className="gap-2"
          >
            {publishing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Publish
              </>
            )}
          </Button>
        </motion.div>

        {/* Status Messages */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: publishError || publishSuccess ? 1 : 0, y: publishError || publishSuccess ? 0 : 10 }}
          transition={{ duration: 0.3 }}
        >
          {publishError && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <span className="text-destructive text-sm font-medium">{publishError}</span>
            </div>
          )}

          {publishSuccess && (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-primary text-sm font-medium">✓ Published successfully! Redirecting...</span>
            </div>
          )}
        </motion.div>
      </div>
    </AuthenticatedLayout>
  )
}
