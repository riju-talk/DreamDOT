'use client'

import { useCreatorStudioStore } from '@/lib/store/useCreatorStudioStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X, GripVertical, FileText, Image as ImageIcon, Film } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PricingPart } from './PricingPart'

export function MediaPart() {
  const { draft, updateDraft } = useCreatorStudioStore()
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
  const MAX_SIZE = 50 * 1024 * 1024 // 50MB

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      processFiles(files)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />
    if (file.type.startsWith('video/')) return <Film className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const processFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        console.log(`Invalid type: ${file.name}`)
        return false
      }
      if (file.size > MAX_SIZE) {
        console.log(`File too large: ${file.name}`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      setUploading(true)
      updateDraft({ mediaFiles: [...draft.mediaFiles, ...validFiles] })
      setUploading(false)

      // Auto-generate thumbnail from first image
      const firstImage = validFiles.find((f) => f.type.startsWith('image/'))
      if (firstImage && !draft.thumbnailUrl) {
        const reader = new FileReader()
        reader.onload = (e) => {
          updateDraft({ thumbnailUrl: e.target?.result as string })
        }
        reader.readAsDataURL(firstImage)
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = draft.mediaFiles.filter((_, i) => i !== index)
    updateDraft({ mediaFiles: newFiles })
  }

  const handleMoveFile = (from: number, to: number) => {
    const newFiles = [...draft.mediaFiles]
    const [removed] = newFiles.splice(from, 1)
    newFiles.splice(to, 0, removed)
    updateDraft({ mediaFiles: newFiles })
  }

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
            isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-border bg-muted/30 hover:border-primary/30'
          }`}
        >
          <div className="space-y-4">
            <motion.div
              animate={{ y: isDragging ? -5 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Upload className={`h-16 w-16 mx-auto transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            </motion.div>
            <div>
              <p className="text-foreground font-bold text-lg mb-2">Drop files or click to upload</p>
              <p className="text-sm text-muted-foreground">Images or video • Max 50MB each</p>
            </div>
            <label>
              <input type="file" multiple onChange={handleFileInput} className="hidden" />
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Choose Files
              </Button>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-center text-primary font-medium"
          >
            Uploading files...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Grid */}
      <AnimatePresence>
        {draft.mediaFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-4 border-b border-border/30">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Upload className="h-5 w-5 text-primary" />
                  Media Files ({draft.mediaFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {draft.mediaFiles.map((file, index) => (
                      <motion.div
                        key={`${file.name}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-border/50 transition-all group"
                      >
                        {/* Move Button */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => index > 0 && handleMoveFile(index, index - 1)}
                            disabled={index === 0}
                            className={`p-1 rounded transition-colors ${
                              index > 0 
                                ? 'text-muted-foreground hover:text-primary hover:bg-primary/10' 
                                : 'text-muted-foreground/30 cursor-not-allowed'
                            }`}
                            title="Move up"
                          >
                            <GripVertical className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => index < draft.mediaFiles.length - 1 && handleMoveFile(index, index + 1)}
                            disabled={index === draft.mediaFiles.length - 1}
                            className={`p-1 rounded transition-colors ${
                              index < draft.mediaFiles.length - 1
                                ? 'text-muted-foreground hover:text-primary hover:bg-primary/10' 
                                : 'text-muted-foreground/30 cursor-not-allowed'
                            }`}
                            title="Move down"
                          >
                            <GripVertical className="h-4 w-4 rotate-180" />
                          </button>
                        </div>

                        {/* File Icon */}
                        <div className="p-2 rounded-lg bg-primary/10">
                          <div className="text-primary">
                            {getFileIcon(file)}
                          </div>
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground truncate text-sm font-semibold">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>

                        {/* Thumbnail Badge */}
                        {index === 0 && (
                          <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold whitespace-nowrap">
                            ★ Thumbnail
                          </div>
                        )}

                        {/* Delete Button */}
                        <motion.button
                          onClick={() => handleRemoveFile(index)}
                          className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Tips */}
      <Card className="bg-muted/20 border-border/30">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary">💡</span> Upload Tips
            </p>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>• At least one image or video is required — the first file is used as the thumbnail</li>
              <li>• Reorder files by clicking the move buttons</li>
              <li>• Supported formats: JPG, PNG, GIF, WebP, MP4, WebM</li>
              <li>• Maximum file size: 50MB each</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Model */}
      <PricingPart />
    </div>
  )
}
