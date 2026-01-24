"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import { LogOut } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: number
}

interface SidebarNavProps {
  items: NavItem[]
  onLogout: () => void
}

export function SidebarNav({ items, onLogout }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-sidebar/50 backdrop-blur-lg">
      <nav className="flex-1 space-y-3 px-4 py-8">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-black tracking-tight transition-all duration-300 overflow-hidden",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_10px_20px_rgba(var(--primary-rgb),0.3)] scale-[1.02]"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:px-6",
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary-foreground rounded-full"></div>
              )}
              <span className={cn(
                "text-2xl transition-transform duration-300 group-hover:scale-120 flex items-center justify-center",
                isActive ? "text-primary-foreground" : "group-hover:text-primary"
              )}>
                {item.icon}
              </span>
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <span className={cn(
                  "flex items-center justify-center min-w-[20px] h-5 text-[10px] font-black rounded-full px-1.5",
                  isActive ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-8 border-t border-border/40">
        <button
          onClick={onLogout}
          className="group w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-black text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform flex items-center justify-center"><LogOut className="w-6 h-6" /></span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
