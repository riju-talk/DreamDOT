"use client"

import { useEffect, useState } from "react"
import { formatRelativeTimeHumanized } from "@/lib/utils"

export function RelativeTime({ date, className }: { date: string | Date; className?: string }) {
  const [label, setLabel] = useState(() => formatRelativeTimeHumanized(date))

  useEffect(() => {
    const interval = setInterval(() => {
      setLabel(formatRelativeTimeHumanized(date))
    }, 1000)
    return () => clearInterval(interval)
  }, [date])

  return (
    <span className={className} title={new Date(date).toLocaleString()}>
      {label}
    </span>
  )
}