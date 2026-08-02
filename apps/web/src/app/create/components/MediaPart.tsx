'use client'

import { useCreatorStudioStore } from '@/lib/store/useCreatorStudioStore'
import { Button } from '@/components/ui/button'
import { Upload, X, GripVertical } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export function MediaPart() {
  const { draft, updateDraft } = useCreatorStudioStore()
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav', 'application/pdf']
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
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragging ? 'border-[#99FF33] bg-[#99FF33]/5' : 'border-[#2a2826] bg-[#1a1918]'
        }`}
      >
        <Upload className="h-12 w-12 text-[#6B8E6E] mx-auto mb-4" />
        <p className="text-[#FFFFFF] font-semibold mb-2">Drag files here or click to upload</p>
        <p className="text-xs text-[#6B8E6E] mb-4">Supports images, video, audio, PDF (max 50MB each)</p>
        <label>
          <input type="file" multiple onChange={handleFileInput} className="hidden" />
          <Button className="bg-[#99FF33] text-[#121412] hover:bg-[#85e022]">Choose Files</Button>
        </label>
      </div>

      {/* Loading State */}
      {uploading && <p className="text-center text-[#6B8E6E]">Uploading...</p>}

      {/* Media Grid */}
      {draft.mediaFiles.length > 0 && (
        <div>
          <h3 className="text-[#FFFFFF] font-semibold mb-3">Media Files ({draft.mediaFiles.length})</h3>
          <div className="space-y-2">
            {draft.mediaFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-[#1a1918] border border-[#2a2826] rounded">
                <button
                  onClick={() => (index > 0 ? handleMoveFile(index, index - 1) : null)}
                  className="text-[#6B8E6E] hover:text-[#99FF33]"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-[#FFFFFF] truncate text-sm">{file.name}</p>
                  <p className="text-xs text-[#6B8E6E]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {index === 0 && <span className="text-xs bg-[#99FF33]/20 text-[#99FF33] px-2 py-1 rounded">Thumbnail</span>}
                <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-400">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
