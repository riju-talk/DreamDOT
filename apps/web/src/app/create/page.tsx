"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Switch } from "@/components/ui/switch"
import { Upload, ImageIcon, FileText, X, Loader2, Sparkles, Plus } from "lucide-react"
import { AuthenticatedLayout } from "../../../components/authenticated-layout"
import { createItem } from "@/app/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function CreatePage() {
  const router = useRouter()
  const [writeContent, setWriteContent] = useState<string>("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  // Form states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
    }
  }, [thumbnailPreview])

  const handlePublish = async () => {
    if (!title || !description) {
      toast.error("Please fill in title and description")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("price", price)
      if (writeContent) formData.append("content", writeContent)
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile)

      const result = await createItem(formData)

      if (result.success) {
        toast.success("Dream published successfully!")
        router.push("/marketplace")
      } else {
        toast.error(result.error || "Failed to publish")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthenticatedLayout>
      <main className="space-y-16 pb-40">
        {/* Header Section */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[var(--shadow-glow)]" />
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.4em]">Node: Synthesis Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter">
            Craft <span className="text-muted-foreground/30 not-italic">Artifact.</span>
          </h1>
          <p className="text-lg text-muted-foreground/40 font-light max-w-xl">
            Transform your ephemeral visions into persistent digital artifacts. 
            Select your modality of creation below.
          </p>
        </header>

        <Tabs defaultValue="upload" className="w-full space-y-12" onValueChange={setActiveTab}>
          <TabsList className="inline-flex h-14 items-center justify-center rounded-[20px] bg-foreground/[0.03] p-1.5 backdrop-blur-3xl border border-border/50">
            {[
              { value: "upload", label: "Materialize", icon: Upload },
              { value: "write", label: "Inscribe", icon: FileText },
              { value: "bundle", label: "Coalesce", icon: Sparkles }
            ].map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-[14px] px-8 py-2.5 text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-500",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[var(--shadow-glow)]",
                  "text-muted-foreground/40 hover:text-muted-foreground/60"
                )}
              >
                <tab.icon className="mr-2 h-3.5 w-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TabsContent value="upload" className="mt-0 focus-visible:outline-none">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Interaction Area */}
                        <div className="lg:col-span-2 space-y-10">
                          <div className="space-y-8">
                            <div className="grid gap-4">
                              <Label className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 ml-1">Artifact Designation</Label>
                              <Input
                                placeholder="Whispers of the Eternal Grid..."
                                className="h-20 text-2xl font-serif bg-foreground/[0.01] border-foreground/5 rounded-[24px] px-8 focus:border-primary/50 focus:ring-0 transition-all placeholder:text-foreground/10"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                              />
                            </div>

                            <div className="grid gap-4">
                              <Label className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 ml-1">Contextual Description</Label>
                              <Textarea
                                placeholder="Detail the essence of this synthesis..."
                                className="min-h-[160px] text-lg font-light bg-foreground/[0.01] border-foreground/5 rounded-[32px] p-8 resize-none focus:border-primary/50 focus:ring-0 transition-all placeholder:text-foreground/10"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                            </div>

                            <div className="grid gap-4">
                              <Label className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 ml-1">Material Feed</Label>
                              <div className="group relative border-2 border-dashed border-foreground/5 rounded-[48px] p-24 text-center bg-foreground/[0.01] hover:bg-foreground/[0.02] hover:border-primary/20 transition-all duration-1000 cursor-pointer overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative z-10 space-y-6">
                                  <div className="w-20 h-20 rounded-[32px] bg-foreground/[0.03] border border-white/5 mx-auto flex items-center justify-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                                    <Upload className="h-8 w-8 text-primary/60" />
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="text-xl font-serif text-foreground/80">Inject Material.</h3>
                                    <p className="text-xs font-mono text-foreground/20 uppercase tracking-[0.2em]">
                                      MP4, MOV, WAV, FLAC, PNG, JPG (MAX 500MB)
                                    </p>
                                  </div>
                                  <Button variant="outline" className="h-12 px-8 rounded-full border-foreground/10 text-[10px] font-mono uppercase tracking-widest transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                                    Select Source
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Metadata / Configuration */}
                        <aside className="space-y-10">
                          <div className="bg-foreground/[0.02] border border-foreground/[0.03] rounded-[48px] p-10 space-y-10">
                            <div className="space-y-8">
                              <div className="grid gap-4">
                                <Label className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 ml-1">Resonance Cover</Label>
                                <div className="relative aspect-square rounded-[36px] overflow-hidden border border-foreground/5 bg-foreground/[0.01] active:scale-[0.98] transition-all cursor-pointer group">
                                  {thumbnailPreview ? (
                                    <>
                                      <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <X className="h-10 w-10 text-white cursor-pointer" onClick={(e) => {
                                          e.stopPropagation()
                                          setThumbnailFile(null)
                                          setThumbnailPreview(null)
                                        }} />
                                      </div>
                                    </>
                                  ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                      <ImageIcon className="h-12 w-12 text-foreground/10 mb-4 group-hover:text-primary/40 transition-colors" />
                                      <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/20">Set Iconography</span>
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                          setThumbnailFile(file)
                                          setThumbnailPreview(URL.createObjectURL(file))
                                        }
                                      }}/>
                                    </label>
                                  )}
                                </div>
                              </div>

                              <div className="grid gap-4">
                                <Label className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 ml-1">Ecosystem Sphere</Label>
                                <Select value={category} onValueChange={setCategory}>
                                  <SelectTrigger className="h-14 bg-foreground/[0.01] border-foreground/5 rounded-2xl px-6 font-serif text-lg focus:ring-0">
                                    <SelectValue placeholder="Select Modality" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background/80 backdrop-blur-3xl border-foreground/5 rounded-2xl">
                                    <SelectItem value="art">Fine Art</SelectItem>
                                    <SelectItem value="photography">Light Capture</SelectItem>
                                    <SelectItem value="music">Sonic Waves</SelectItem>
                                    <SelectItem value="video">Temporal Motion</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid gap-4">
                                <Label className="text-[10px] font-mono uppercase tracking-widest text-foreground/30 ml-1">Monetization Node</Label>
                                <div className="relative">
                                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20 font-serif text-xl">$</span>
                                  <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="h-14 pl-12 bg-foreground/[0.01] border-foreground/5 rounded-2xl font-serif text-xl focus:ring-0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-4 rounded-3xl bg-foreground/[0.02] border border-foreground/5">
                                <Label className="text-xs text-foreground/40 font-light">Encrypted (Private)</Label>
                                <Switch className="data-[state=checked]:bg-primary" />
                              </div>
                            </div>
                          </div>
                        </aside>
                      </div>
                    </TabsContent>

                    <TabsContent value="write" className="mt-0 focus-visible:outline-none">
                      <div className="max-w-4xl mx-auto space-y-12">
                        <div className="space-y-8">
                          <Input
                            placeholder="A New Philosophy of Digital Dreams..."
                            className="h-24 text-4xl md:text-6xl font-serif italic text-center bg-transparent border-none rounded-none focus:ring-0 transition-all placeholder:text-foreground/5 p-0"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                          <div className="h-[1px] w-40 bg-primary/20 mx-auto" />
                          <RichTextEditor
                            value={writeContent}
                            onChange={setWriteContent}
                            placeholder="Inscribe the vision..."
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="bundle" className="mt-0 focus-visible:outline-none">
                       <div className="min-h-[400px] flex flex-col items-center justify-center space-y-8 bg-foreground/[0.01] border border-foreground/[0.03] rounded-[64px] p-24 text-center">
                         <div className="w-24 h-24 rounded-[40px] bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
                           <Sparkles className="h-10 w-10 text-primary" />
                         </div>
                         <div className="space-y-4 max-w-md">
                           <h3 className="text-3xl font-serif italic">Coalescence Logic.</h3>
                           <p className="text-foreground/40 font-light leading-relaxed">
                             Neural networks are currently calibrating for the multi-modality bundling engine.
                             Expected activation: Phase 4.
                           </p>
                         </div>
                         <Button variant="outline" className="h-12 px-10 rounded-full border-foreground/10 text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity">Return to Hub</Button>
                       </div>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>

        {/* Sticky Actions Bar */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none z-50 overflow-hidden">
           <div className="absolute inset-x-0 bottom-0 p-8 flex justify-center pointer-events-auto">
             <div className="flex items-center gap-4 bg-foreground/[0.02] backdrop-blur-3xl border border-border/50 rounded-full p-2 pr-2 shadow-[var(--shadow-glow)]">
               <Button variant="ghost" className="h-14 px-8 rounded-full text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40 hover:text-foreground hover:bg-muted transition-all">
                 Snapshot
               </Button>
               <Button 
                 onClick={handlePublish}
                 disabled={isSubmitting}
                 className="h-14 px-12 rounded-full bg-primary text-primary-foreground font-serif text-xl italic tracking-tighter shadow-[var(--shadow-glow)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
               >
                 {isSubmitting ? <Loader2 className="animate-spin" /> : <><Plus className="w-5 h-5" /> Manifest Dream</>}
               </Button>
             </div>
           </div>
        </div>
      </main>
    </AuthenticatedLayout>
  )
}
