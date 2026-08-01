"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"

interface FilterState {
  category: string
  priceMin: number | null
  priceMax: number | null
  rating: number | null
  search: string
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void
  currentFilters: FilterState
}

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "writing", label: "Writing" },
  { id: "audio", label: "Audio" },
  { id: "visual", label: "Visual" },
  { id: "template", label: "Templates" },
  { id: "code", label: "Code" },
]

const PRICE_RANGES = [
  { id: "all", label: "All Prices", min: null, max: null },
  { id: "0-25", label: "Under $25", min: 0, max: 25 },
  { id: "25-50", label: "$25 - $50", min: 25, max: 50 },
  { id: "50-100", label: "$50 - $100", min: 50, max: 100 },
  { id: "100+", label: "$100+", min: 100, max: null },
]

const RATINGS = [
  { id: "all", label: "All Ratings", value: null },
  { id: "4.5", label: "4.5+ ⭐", value: 4.5 },
  { id: "4", label: "4.0+ ⭐", value: 4 },
]

export function FilterSidebar({ onFilterChange, currentFilters }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      ...currentFilters,
      category: categoryId,
    })
  }

  const handlePriceChange = (min: number | null, max: number | null) => {
    onFilterChange({
      ...currentFilters,
      priceMin: min,
      priceMax: max,
    })
  }

  const handleRatingChange = (rating: number | null) => {
    onFilterChange({
      ...currentFilters,
      rating,
    })
  }

  const handleClearFilters = () => {
    onFilterChange({
      category: "all",
      priceMin: null,
      priceMax: null,
      rating: null,
      search: "",
    })
  }

  const hasActiveFilters =
    currentFilters.category !== "all" ||
    currentFilters.priceMin !== null ||
    currentFilters.priceMax !== null ||
    currentFilters.rating !== null

  return (
    <div className="w-full bg-card/50 border border-border/30 rounded-lg p-4 space-y-4">
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 text-sm font-medium text-primary transition-colors"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </button>
      )}

      {/* Category Section */}
      <div className="border-b border-border/30 pb-4">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between py-2 hover:text-primary transition-colors"
        >
          <h3 className="font-serif font-semibold text-sm">Category</h3>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.category ? "rotate-180" : ""}`}
          />
        </button>

        {expandedSections.category && (
          <div className="space-y-2 mt-3">
            {CATEGORIES.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={currentFilters.category === cat.id}
                  onChange={() => handleCategoryChange(cat.id)}
                  className="w-4 h-4 rounded border border-border/50 bg-card accent-primary cursor-pointer"
                />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="border-b border-border/30 pb-4">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between py-2 hover:text-primary transition-colors"
        >
          <h3 className="font-serif font-semibold text-sm">Price Range</h3>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.price ? "rotate-180" : ""}`}
          />
        </button>

        {expandedSections.price && (
          <div className="space-y-2 mt-3">
            {PRICE_RANGES.map((range) => (
              <label
                key={range.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="price"
                  value={range.id}
                  checked={currentFilters.priceMin === range.min && currentFilters.priceMax === range.max}
                  onChange={() => handlePriceChange(range.min, range.max)}
                  className="w-4 h-4 rounded border border-border/50 bg-card accent-primary cursor-pointer"
                />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Section */}
      <div>
        <button
          onClick={() => toggleSection("rating")}
          className="w-full flex items-center justify-between py-2 hover:text-primary transition-colors"
        >
          <h3 className="font-serif font-semibold text-sm">Rating</h3>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.rating ? "rotate-180" : ""}`}
          />
        </button>

        {expandedSections.rating && (
          <div className="space-y-2 mt-3">
            {RATINGS.map((rating) => (
              <label
                key={rating.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="rating"
                  value={rating.id}
                  checked={currentFilters.rating === rating.value}
                  onChange={() => handleRatingChange(rating.value)}
                  className="w-4 h-4 rounded border border-border/50 bg-card accent-primary cursor-pointer"
                />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {rating.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
