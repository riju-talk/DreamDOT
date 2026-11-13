"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Send,
  Paperclip,
  Smile,
  X,
  File,
  ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import { useTypingIndicator } from "@/lib/useSocketHook"
import { useChatStore } from "@/lib/store/useChatStore"
import { emitSendMessage, emitSendChannelMessage } from "@/lib/socket"

const MAX_CHARACTER_LIMIT = 4000
const TYPING_INDICATOR_INTERVAL = 3000 // 3 seconds
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Common emojis for picker
const COMMON_EMOJIS = [
  "😀", "😂", "😍", "🤔", "😎", "🎉", "❤️", "👍",
  "🔥", "💯", "✨", "🚀", "😱", "🤗", "😴", "😤"
]

interface FilePreview {
  file: File
  preview: string
  type: "image" | "video" | "file"
}

export function MessageInput({
  conversationId,
  type = 'dm',
}: {
  conversationId: string
  type?: 'dm' | 'channel'
}) {
  console.log('[MessageInput] Initializing with conversationId:', conversationId, 'type:', type)
  
  const { data: session } = useSession()
  const { addMessage } = useChatStore()
  const [message, setMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([])
  const [characterCount, setCharacterCount] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragDropRef = useRef<HTMLDivElement>(null)
  const typingIndicatorRef = useRef<NodeJS.Timeout | null>(null)
  const [isDraggingOverZone, setIsDraggingOverZone] = useState(false)
  const setTyping = useTypingIndicator(conversationId)
  
  const sessionUser = (session as any)?.user
  const sessionUserId = sessionUser?.id
  const sessionUserName = sessionUser?.name || 'Unknown User'

  // Auto-resize textarea
  const autoResizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = 150 // Maximum height in pixels
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + "px"
    }
  }, [])

  // Handle message input change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value
    
    console.log('[MessageInput] Text changed, length:', newMessage.length)
    
    // Enforce character limit
    if (newMessage.length <= MAX_CHARACTER_LIMIT) {
      setMessage(newMessage)
      setCharacterCount(newMessage.length)
      setError(null)
    } else {
      console.warn('[MessageInput] Character limit exceeded')
      setError(`Maximum ${MAX_CHARACTER_LIMIT} characters allowed`)
    }

    autoResizeTextarea()

    // Send typing indicator every 3 seconds
    if (typingIndicatorRef.current) {
      clearTimeout(typingIndicatorRef.current)
    }

    if (newMessage.trim()) {
      console.log('[MessageInput] Emitting typing indicator: true')
      setTyping(true)
      typingIndicatorRef.current = setTimeout(() => {
        console.log('[MessageInput] Clearing typing indicator')
        setTyping(false)
      }, TYPING_INDICATOR_INTERVAL)
    } else {
      setTyping(false)
    }
  }

  // Handle file selection from file input
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    console.log('[MessageInput] Files selected:', files.length)
    
    setIsUploading(true)
    setError(null)

    try {
      const newPreviews: FilePreview[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log('[MessageInput] Processing file:', file.name, 'size:', file.size, 'type:', file.type)

        // Validate file size (max 10MB)
        if (file.size > MAX_FILE_SIZE) {
          console.warn('[MessageInput] File too large:', file.name)
          setError(`File "${file.name}" is too large. Maximum 10MB allowed.`)
          continue
        }

        // Validate file type
        const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf', 'application/msword', 'text/plain']
        const isAllowed = allowedTypes.some(type => file.type.startsWith(type))
        if (!isAllowed) {
          console.warn('[MessageInput] File type not allowed:', file.type)
          setError(`File type not allowed: ${file.type}`)
          continue
        }

        // Determine file type
        let fileType: "image" | "video" | "file"
        if (file.type.startsWith("image/")) {
          fileType = "image"
        } else if (file.type.startsWith("video/")) {
          fileType = "video"
        } else {
          fileType = "file"
        }

        // Create preview
        const preview = URL.createObjectURL(file)
        newPreviews.push({
          file,
          preview,
          type: fileType,
        })
        console.log('[MessageInput] File preview created for:', file.name)
      }

      setFilePreviews((prev) => [...prev, ...newPreviews])
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upload file"
      console.error('[MessageInput] File upload error:', errorMsg)
      setError(errorMsg)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Handle drag and drop
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('[MessageInput] Drag enter detected')
    setIsDraggingOverZone(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set to false if leaving the zone entirely
    if (e.currentTarget === dragDropRef.current) {
      console.log('[MessageInput] Drag leave detected')
      setIsDraggingOverZone(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('[MessageInput] Drop detected, files:', e.dataTransfer.files.length)
    setIsDraggingOverZone(false)

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    // Create a synthetic change event for file handling
    const dataTransfer = new DataTransfer()
    for (let i = 0; i < files.length; i++) {
      dataTransfer.items.add(files[i])
    }

    const event = new Event('change', { bubbles: true }) as any
    event.target = { files: dataTransfer.files }
    
    handleFileSelect(event as React.ChangeEvent<HTMLInputElement>)
  }

  // Remove file preview
  const removeFilePreview = (index: number) => {
    console.log('[MessageInput] Removing file preview at index:', index)
    setFilePreviews((prev) => {
      const newPreviews = [...prev]
      const preview = newPreviews[index]
      URL.revokeObjectURL(preview.preview)
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  // Validate and send message
  const handleSendMessage = async () => {
    console.log('[MessageInput] Send message called, message length:', message.length, 'files:', filePreviews.length)
    
    // Validate message not empty
    if (!message.trim() && filePreviews.length === 0) {
      const errorMsg = "Cannot send empty message"
      console.warn('[MessageInput]', errorMsg)
      setError(errorMsg)
      return
    }

    if (!conversationId) {
      const errorMsg = "No conversation selected"
      console.error('[MessageInput]', errorMsg)
      setError(errorMsg)
      return
    }

    if (!sessionUserId) {
      const errorMsg = "User not authenticated"
      console.error('[MessageInput]', errorMsg)
      setError(errorMsg)
      return
    }

    try {
      setIsUploading(true)
      setError(null)
      console.log('[MessageInput] Starting message send process')

      // Upload files if any
      const attachments: any[] = []
      for (const filePreview of filePreviews) {
        try {
          console.log('[MessageInput] Uploading file:', filePreview.file.name)
          const formData = new FormData()
          formData.append("file", filePreview.file)

          const uploadRes = await fetch("/api/cloudinary/upload", {
            method: "POST",
            body: formData,
          })

          if (!uploadRes.ok) {
            throw new Error(`Upload failed: ${uploadRes.statusText}`)
          }

          const uploadData = await uploadRes.json()

          if (uploadData.url) {
            attachments.push({
              url: uploadData.url,
              type: filePreview.file.type,
              name: filePreview.file.name,
              size: filePreview.file.size,
            })
            console.log('[MessageInput] File uploaded successfully:', filePreview.file.name)
          }
        } catch (err) {
          const errorMsg = `Failed to upload file: ${filePreview.file.name}`
          console.error('[MessageInput] File upload error:', errorMsg, err)
          setError(errorMsg)
          return
        }
      }

      // Create optimistic message
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        conversationId,
        userId: sessionUserId,
        userName: sessionUserName,
        text: message.trim(),
        attachment: attachments.length > 0 ? attachments[0] : undefined,
        createdAt: new Date(),
        readBy: [sessionUserId],
        isOptimistic: true
      }

      console.log('[MessageInput] Creating optimistic message:', optimisticMessage.id)
      
      // Add optimistic message to store immediately
      addMessage(conversationId, optimisticMessage)

      // Emit socket message
      console.log('[MessageInput] Emitting message via socket')
      if (type === 'channel') {
        emitSendChannelMessage(conversationId, message.trim(), attachments)
      } else {
        emitSendMessage(conversationId, message.trim(), attachments)
      }

      // Clear inputs
      setMessage("")
      setCharacterCount(0)
      setFilePreviews([])
      setShowEmojiPicker(false)
      
      // Clear typing indicator
      setTyping(false)
      if (typingIndicatorRef.current) {
        clearTimeout(typingIndicatorRef.current)
      }

      autoResizeTextarea()
      console.log('[MessageInput] Message sent and inputs cleared')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send message"
      console.error('[MessageInput] Send error:', errorMsg)
      setError(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('[MessageInput] Cleaning up on unmount')
      if (typingIndicatorRef.current) {
        clearTimeout(typingIndicatorRef.current)
      }
      filePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.preview)
      })
    }
  }, [filePreviews])

  // Initial resize
  useEffect(() => {
    autoResizeTextarea()
  }, [autoResizeTextarea])

  const isSendDisabled = !message.trim() && filePreviews.length === 0

  return (
    <div className="flex flex-col gap-3 p-4 border-t border-border bg-background" ref={dragDropRef} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
      {/* Drag and drop overlay */}
      {isDraggingOverZone && (
        <div className="absolute inset-0 pointer-events-none bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium text-primary">Drop files to upload</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="px-3 py-2 text-sm text-destructive bg-destructive/10 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* File previews */}
      {filePreviews.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filePreviews.map((filePreview, index) => (
            <div key={index} className="relative flex-shrink-0">
              {filePreview.type === "image" && (
                <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={filePreview.preview}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeFilePreview(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    aria-label="Remove file"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {filePreview.type === "video" && (
                <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <video
                    src={filePreview.preview}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeFilePreview(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    aria-label="Remove file"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {filePreview.type === "file" && (
                <Card className="h-20 w-32 flex items-center justify-center relative border border-border bg-muted">
                  <button
                    onClick={() => removeFilePreview(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    aria-label="Remove file"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <CardContent className="p-2 text-center">
                    <File className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                      {filePreview.file.name}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          multiple
          disabled={isUploading}
        />

        {/* File upload menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 flex-shrink-0"
              disabled={isUploading}
              title="Upload file or image"
              type="button"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Image / Video
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <File className="h-4 w-4 mr-2" />
              File
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Message textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            className="w-full px-3 py-2 rounded-lg bg-muted text-foreground placeholder-muted-foreground border border-border resize-none overflow-hidden min-h-[40px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-colors"
            maxLength={MAX_CHARACTER_LIMIT}
            disabled={isUploading}
          />
          {/* Character count */}
          {message.length > 0 && (
            <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
              {characterCount}/{MAX_CHARACTER_LIMIT}
            </div>
          )}
        </div>

        {/* Emoji picker button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            disabled={isUploading}
            title="Emoji picker"
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-4 w-4" />
          </Button>

          {/* Emoji picker popup */}
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 z-50 bg-background border border-border rounded-lg p-2 shadow-lg">
              <div className="grid grid-cols-4 gap-2">
                {COMMON_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      console.log('[MessageInput] Emoji selected:', emoji)
                      setMessage(prev => prev + emoji)
                      setCharacterCount(prev => prev + emoji.length)
                      setShowEmojiPicker(false)
                      if (textareaRef.current) {
                        textareaRef.current.focus()
                      }
                    }}
                    className="text-xl hover:bg-muted rounded p-1 transition-colors"
                    type="button"
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Send button */}
        <Button
          onClick={handleSendMessage}
          disabled={isSendDisabled || isUploading}
          className="h-9 w-9 rounded-full bg-[#99FF33] text-[#121412] hover:bg-[#99FF33]/90 flex-shrink-0"
          size="icon"
          title="Send message"
          type="button"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Character limit warning */}
      {characterCount > MAX_CHARACTER_LIMIT * 0.8 && characterCount <= MAX_CHARACTER_LIMIT && (
        <div className="px-3 py-1 text-xs text-muted-foreground">
          {MAX_CHARACTER_LIMIT - characterCount} characters remaining
        </div>
      )}
    </div>
  )
}
