"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Compass, Plus, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems: NavItem[] = useMemo(
    () => [
      { href: "/feed", icon: <Home className="h-6 w-6" />, label: "Home" },
      { href: "/discover", icon: <Compass className="h-6 w-6" />, label: "Discover" },
      { href: "/create", icon: <Plus className="h-6 w-6" />, label: "Create" },
      { href: "/messages", icon: <MessageCircle className="h-6 w-6" />, label: "Messages" },
      { href: "/profile/me", icon: <User className="h-6 w-6" />, label: "Account" },
    ],
    []
  )

  const isActive = (href: string) => {
    // Extract base path for comparison
    const basePath = pathname.split("/")[1]
    const basehref = href.split("/")[1]
    return basePath === basehref
  }

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 border-t border-border/50",
        "bg-surface-low/95 backdrop-blur-xl",
        "flex items-center justify-around h-20",
        "lg:hidden",
        "safe-bottom z-40"
      )}
    >
      {navItems.map((item) => (
        <button
          key={item.href}
          onClick={() => router.push(item.href)}
          className={cn(
            "flex flex-col items-center justify-center gap-1",
            "w-full h-full",
            "transition-colors duration-200",
            "hover:text-primary",
            isActive(item.href)
              ? "text-primary border-t-2 border-primary -mt-0.5"
              : "text-on-surface-variant"
          )}
          aria-label={item.label}
        >
          {item.icon}
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
