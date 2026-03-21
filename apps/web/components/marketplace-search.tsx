"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Star, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { searchMarketplace, highlightSearchMatch } from "@/lib/search-client"

interface MarketplaceSearchProps {
  itemsByCategory: { items: any[] }[]
  categories: string[]
  activeCategory?: string
  query?: string
}

import { motion, AnimatePresence } from "framer-motion"

export function MarketplaceSearch({ itemsByCategory, categories, activeCategory = "mixed", query = "" }: MarketplaceSearchProps) {
  const active = (activeCategory || categories[0] || "mixed").toLowerCase()
  const activeIdx = Math.max(0, categories.findIndex((c) => c.toLowerCase() === active))
  const items = itemsByCategory[activeIdx]?.items ?? []
  const filtered = query.trim() ? searchMarketplace(items, query) : items

  const renderHighlightedText = (text: string) => {
    if (!query.trim()) return text
    return (
      <span
        dangerouslySetInnerHTML={{ __html: highlightSearchMatch(text, query) }}
      />
    )
  }

  const makeCatHref = (cat: string) => {
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query)
    params.set("cat", cat.toLowerCase())
    return `/marketplace?${params.toString()}`
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4 p-2 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-3xl w-fit">
        {categories.map((cat) => {
          const isActive = cat.toLowerCase() === active
          return (
            <Link
              key={cat}
              href={makeCatHref(cat)}
              className={`px-8 py-3 rounded-[20px] text-sm font-bold tracking-widest uppercase transition-all duration-500 relative group/tab ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(153,255,51,0.2)]' 
                  : 'text-white/40 hover:text-white/90 hover:bg-white/5'
              }`}
            >
              {cat}
              {!isActive && (
                <div className="absolute inset-0 border border-white/0 group-hover/tab:border-white/10 rounded-[20px] transition-all duration-500" />
              )}
            </Link>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-b border-white/[0.05] pb-6">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <h3 className="text-xl font-serif text-white/90 tracking-wide">{categories[activeIdx]} Collective</h3>
        </div>
        {query.trim() && (
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 font-bold bg-white/[0.03] px-4 py-2 rounded-full border border-white/[0.05]">
            Interpreting: <span className="text-primary">{query}</span> • {filtered.length} Manifestations Found
          </div>
        )}
      </div>

      {/* Items Grid */}
      <AnimatePresence mode="popLayout" initial={false}>
        {filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-24 bg-white/[0.02] border border-white/5 rounded-[40px] shadow-inner"
          >
            <div className="mx-auto w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-primary/40" />
            </div>
            <h3 className="text-2xl font-serif text-white/80 mb-2 italic">Nothing manifested yet</h3>
            <p className="text-white/30 font-light max-w-sm mx-auto">
              Our search through the collective consciousness returned no artifacts matching your frequency.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filtered.map((product: any, idx: number) => (
              <motion.div
                key={String(product._id)}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              >
                <Card className="dream-card bg-white/[0.02] border border-white/[0.05] overflow-hidden group/card hover:bg-white/[0.04] transition-all duration-700">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={product.fileUrl || "/placeholder.svg"}
                      alt={product.title || ""}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover/card:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                    {product.fileType && (
                      <Badge className="absolute top-4 right-4 bg-white/20 backdrop-blur-xl text-white text-[10px] font-mono font-bold uppercase tracking-widest border border-white/10 px-4 py-1.5 rounded-full">
                        {product.fileType}
                      </Badge>
                    )}
                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-700">
                       <Button className="w-full bg-white text-black hover:bg-white/90 rounded-full h-12 font-bold uppercase tracking-widest text-[11px] shadow-2xl">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Acquire Artifact
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <Link
                        href={`/product/${String(product._id)}`}
                        className="text-2xl font-serif text-white/90 hover:text-primary transition-colors duration-300 block leading-tight"
                      >
                        {renderHighlightedText(product.title || "Untitled Artifact")}
                      </Link>
                      <p className="text-sm text-white/30 font-light line-clamp-2 leading-relaxed">
                        {renderHighlightedText(product.description || "")}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold font-mono">Resonance Value</p>
                        <div className="text-2xl font-mono text-primary font-bold tracking-tighter">${(product.price ?? 0).toString()}</div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-1 justify-end">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span className="text-sm font-mono text-white/80">{product.rating ?? 0}</span>
                        </div>
                        <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{product.sales ?? 0} Relics</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
