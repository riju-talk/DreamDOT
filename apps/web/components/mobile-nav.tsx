"use client"

import Link from "next/link"
import { Home, Compass, PlusSquare, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/feed", label: "Home", icon: Home },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/create", label: "Create", icon: PlusSquare, isCenterItem: true },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/profile", label: "Account", icon: User },
  ]

  const getIsActive = (href: string) => {
    if (href === "/feed") return pathname === "/feed" || pathname === "/"
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <>
      {/* Fixed bottom navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 flex h-[70px] items-center justify-around border-t border-border/50 bg-background/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/80 md:hidden"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {navItems.map(({ href, label, icon: Icon, isCenterItem }) => {
          const isActive = getIsActive(href)
          
          if (isCenterItem) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center -mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full transition-transform active:scale-90 p-2"
                aria-label={`${label} - Create new item`}
                title={label}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:shadow-[0_0_50px_-5px_rgba(153,255,51,0.3)]">
                  <Icon className="h-5 w-5" />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 transition-colors p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              title={label}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
              {href === "/messages" && (
                <Badge className="absolute top-1 right-2 h-4 min-w-4 px-1 text-[9px] bg-primary text-primary-foreground rounded-full">
                  3
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Spacer to prevent content obstruction on mobile */}
      <div className="h-[70px] md:hidden" aria-hidden="true" />
    </>
  )
}
