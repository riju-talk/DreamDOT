"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { ModeToggle } from "./mode-toggle"
import { UserNav } from "./user-nav"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, User, X, ShoppingBag, Sparkles } from "lucide-react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { quickSearch } from "@/app/actions/search"
import Link from "next/link"

interface SearchResult {
  type: "user" | "marketplace"
  id: string
  title: string
  subtitle?: string
  avatar?: string
  searchScore?: number
}

function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([])
      return
    }
    performSearch(debouncedQuery)
  }, [debouncedQuery])

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const performSearch = async (query: string) => {
    setIsLoading(true)
    try {
      const results = await quickSearch(query, 8) // ✅ unified search for profiles + marketplace
      const mapped: SearchResult[] = results.map((r) => ({
        type: r.type === "profile" ? "user" : "marketplace",
        id: r.id,
        title: r.title,
        subtitle: r.type === "profile" ? `@${r.metadata?.username}` : (r.metadata?.category as string | undefined),
        avatar: r.image,
        searchScore: r.score,
      }))
      setSearchResults(mapped)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchFocus = () => setIsSearchOpen(true)

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearchOpen(false)
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case "user": return <User className="h-4 w-4" />
      case "marketplace": return <ShoppingBag className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case "user": return `/profile/${result.id}`
      case "marketplace": return `/items/${result.id}`
      default: return "#"
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search profiles or marketplace..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleSearchFocus}
        className="pl-8 pr-8 rounded-full"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Search Results Dropdown */}
      {isSearchOpen && (debouncedQuery.trim() || searchResults.length > 0) && (
        <Card className="absolute top-12 left-0 right-0 z-50 max-h-96 overflow-hidden shadow-lg">
          <CardContent className="p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-1">
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-b">
                  Search Results
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      href={getResultLink(result)}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors w-full"
                    >
                      {result.avatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={result.avatar} />
                          <AvatarFallback>{result.title.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {getResultIcon(result.type)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                        )}
                      </div>
                      {result.searchScore && (
                        <Badge variant="secondary" className="text-xs">
                          {Math.round((1 - result.searchScore) * 100)}%
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ) : debouncedQuery.trim() ? (
              <div className="text-center py-4 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No results found for "{debouncedQuery}"</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
export function TopNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header 
      className="flex h-16 sm:h-20 items-center gap-4 sm:gap-6 bg-background/40 backdrop-blur-3xl px-4 sm:px-8 md:px-12 border-b border-border/50"
      role="banner"
    >
      {/* Logo - Only show on non-authenticated or landing */}
      {!session && (
        <Link href="/" className="flex items-center gap-3 mr-4 group">
          <div className="relative overflow-hidden rounded-xl p-2 bg-primary shadow-glow transition-transform duration-500 group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif italic text-xl text-foreground tracking-tighter hidden sm:inline-block group-hover:text-primary transition-colors">
            DreamDOT
          </span>
        </Link>
      )}
      
      {/* Navigation Links */}
      <div className="hidden md:flex md:flex-1">
        <nav className="flex items-center space-x-10">
          {[
            { name: "Home Feed", href: "/feed" },
            { name: "Discover", href: "/discover" },
            { name: "Marketplace", href: "/marketplace" }
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-500 hover:text-primary relative group",
                pathname === link.href ? "text-primary" : "text-foreground/40"
              )}
            >
              {link.name}
              {pathname === link.href && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[1px] bg-primary/50" 
                />
              )}
              <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary/30 group-hover:w-full transition-all duration-500" />
            </Link>
          ))}
        </nav>
      </div>

      {/* Right side actions - ml-auto ensures it pushes to the right */}
      <div className="ml-auto flex items-center justify-end space-x-3 sm:space-x-6">
        <div className="hidden md:flex">
          <GlobalSearch />
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
