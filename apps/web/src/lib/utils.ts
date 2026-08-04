import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripHtml(html: string): string {
  if (!html) return ''
  if (typeof document !== 'undefined') {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || ''
  }
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export function getVisibleTextLength(html: string): number {
  return stripHtml(html).trim().length
}

export function isHtmlContent(value: string): boolean {
  if (!value) return false
  const trimmed = value.trim()
  if (trimmed.startsWith('<') || /<\/[a-z][\s\S]*>|<[a-z][^>]*\/>/i.test(trimmed)) {
    return true
  }
  return /<[a-z][^>]*>/i.test(trimmed)
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo`
  return `${Math.floor(diffInSeconds / 31536000)}y`
}

export function formatRelativeTimeHumanized(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - past.getTime()) / 1000))

  if (diffInSeconds < 5) return "just now"

  const intervals = [
    { seconds: 31536000, label: "year" },
    { seconds: 2592000, label: "month" },
    { seconds: 604800, label: "week" },
    { seconds: 86400, label: "day" },
    { seconds: 3600, label: "hour" },
    { seconds: 60, label: "minute" },
  ]

  for (const { seconds, label } of intervals) {
    const value = Math.floor(diffInSeconds / seconds)
    if (value >= 1) {
      return `${value} ${label}${value === 1 ? "" : "s"} ago`
    }
  }

  return `${diffInSeconds} sec${diffInSeconds === 1 ? "" : "s"} ago`
}
