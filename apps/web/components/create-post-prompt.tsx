"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { ImageIcon, X, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import {
  uploadMediaFile,
  validateMediaFile,
  formatFileSize,
  revokeObjectURL,
} from "@/lib/utils/media-upload"

export function CreatePostPrompt() {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [media, setMedia] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)

  const { data: session } = useSession()
  const sessionUser = session?.user
  const accessToken = session?.accessToken

  function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)
  }

  async function handleMediaChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setMediaError(null)

    if (!file) {
      setMedia(null)
      setMediaPreview(null)
      return
    }

    const validation = await validateMediaFile(file)
    if (!validation.isValid) {
      setMediaError(validation.error || "Invalid file")
      toast.error(`File Validation Error: ${validation.error}`)
      return
    }

    setMedia(file)
    const url = URL.createObjectURL(file)
    setMediaPreview(url)
  }

  const resetForm = () => {
    setContent("")
    setMedia(null)
    if (mediaPreview) revokeObjectURL(mediaPreview)
    setMediaPreview(null)
    setMediaError(null)
    setOpen(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!session?.user) {
      toast.error("Authentication Required: Please sign in to create a post")
      return
    }

    if (!content.trim() && !media) {
      toast.error("Content Required: Please add some content or media")
      return
    }

    setIsLoading(true)

    try {
      let mediaUrl: string | undefined
      let mediaType = "text"

      if (media) {
        const uploadResult = await uploadMediaFile(media, "posts")
        if (!uploadResult.success) throw new Error(uploadResult.error || "Failed to upload media")
        mediaUrl = uploadResult.url
        mediaType = uploadResult.type || "image"
      }

      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          mediaUrl,
          mediaType,
          visibility: true,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        toast.error(data.message || "Failed to create post")
        return
      }

      toast.success("Post Created Successfully!")
      resetForm()
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create post")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="dream-card bg-white/[0.02] backdrop-blur-3xl border-white/[0.05] p-6 mb-10 group cursor-pointer transition-all duration-500 hover:bg-white/[0.04]">
        <div className="flex items-center space-x-6">
          <Avatar className="h-14 w-14 border border-white/10 ring-offset-background transition-transform duration-500 group-hover:scale-105">
            <AvatarImage src={sessionUser?.image || ""} alt="Your avatar" />
            <AvatarFallback className="bg-primary/20 text-primary font-serif">YU</AvatarFallback>
          </Avatar>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-[24px] px-8 py-4 text-white/40 hover:text-white/60 transition-all duration-500 group-hover:border-white/10 font-serif text-lg italic tracking-wide">
                Manifest a new dream...
              </div>
            </DialogTrigger>

            <DialogContent className="w-[95vw] max-w-3xl p-0 bg-[#0A0A0A]/90 backdrop-blur-3xl border-white/[0.05] rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
              <DialogHeader className="p-8 border-b border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-3xl font-serif text-white/90">New <span className="text-primary/60">Manifestation</span></DialogTitle>
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold mt-2">Inscribe your vision into the collective</p>
                  </div>
                  <DialogClose asChild>
                    <Button variant="ghost" size="icon" className="text-white/20 hover:text-white/90 hover:bg-white/5 rounded-full">
                      <X className="h-6 w-6" />
                    </Button>
                  </DialogClose>
                </div>
              </DialogHeader>

              {/* Scrollable body */}
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-16 w-16 border border-white/10">
                      <AvatarImage src={sessionUser?.image || ""} alt="Your avatar" />
                      <AvatarFallback className="bg-primary/20 text-primary font-serif">YU</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                       <textarea
                        value={content}
                        onChange={handleContentChange}
                        placeholder="What frequency are you vibrating at today?"
                        className="w-full bg-transparent border-none p-0 resize-none focus:outline-none focus:ring-0 text-2xl font-serif text-white/90 placeholder:text-white/10 min-h-[200px] leading-relaxed"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {mediaError && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl"
                    >
                      <p className="text-sm text-destructive font-bold uppercase tracking-widest text-center">{mediaError}</p>
                    </motion.div>
                  )}

                  {mediaPreview && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative rounded-[32px] overflow-hidden border border-white/10 bg-white/5 group/preview"
                    >
                      {media?.type?.startsWith("video") ? (
                        <video src={mediaPreview} controls className="w-full max-h-[500px] object-contain shadow-2xl" />
                      ) : (
                        <img src={mediaPreview} alt="preview" className="w-full max-h-[500px] object-contain shadow-2xl" />
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-4 right-4 rounded-full opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300"
                        onClick={(e) => {
                          e.preventDefault()
                          revokeObjectURL(mediaPreview)
                          setMedia(null)
                          setMediaPreview(null)
                          setMediaError(null)
                        }}
                        disabled={isLoading}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <DialogFooter className="p-8 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between gap-4">
                  <label className="flex items-center gap-3 cursor-pointer text-white/40 hover:text-primary transition-all duration-500 group/upload px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-primary/20">
                    <ImageIcon className="h-5 w-5 group-hover/upload:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Attach Media</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaChange}
                      className="hidden"
                    />
                  </label>

                  <Button
                    type="submit"
                    disabled={isLoading || (!content.trim() && !media) || !!mediaError}
                    className="px-12 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-50 shadow-[0_0_30px_rgba(153,255,51,0.2)] text-[11px] uppercase tracking-[0.2em]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>{media ? "Uploading Asset" : "Manifesting"}</span>
                      </div>
                    ) : (
                      "Manifest Dream"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </>
  )
}
