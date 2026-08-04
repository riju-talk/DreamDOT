'use client'

import { useCreatorStudioStore } from '@/lib/store/useCreatorStudioStore'
import { RichTextEditor } from '@/components/rich-text-editor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PenTool } from 'lucide-react'
import { motion } from 'framer-motion'
import { PricingPart } from './PricingPart'
import { getVisibleTextLength } from '@/lib/utils'

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
                <span className="text-muted-foreground font-mono">{getVisibleTextLength(draft.script)} characters</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pricing Model */}
      <motion.div variants={itemVariants}>
        <PricingPart />
      </motion.div>
    </motion.div>
  )
}