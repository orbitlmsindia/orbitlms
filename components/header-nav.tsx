"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import { useRouter } from "next/navigation"

interface HeaderNavProps {
  userName: string
  userRole: string
  onLogout: () => void
}

export function HeaderNav({ userName, userRole, onLogout }: HeaderNavProps) {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-card/40 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] transition-all">
      <div className="flex items-center justify-between px-6 lg:px-10 h-20 gap-6">
        {/* Left - Branding */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push("/")}>
          <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors italic">EduHub</span>
        </div>

        {/* Center - Premium Search */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center bg-muted/30 border border-border/50 rounded-2xl px-4 py-2.5 hover:bg-muted/50 focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="text-lg mr-3">🔍</span>
              <Input
                type="search"
                placeholder="Search anything..."
                className="w-full bg-transparent border-none focus-visible:ring-0 text-sm font-medium"
              />
              <span className="hidden md:block bg-muted/80 text-[10px] font-bold px-2 py-1 rounded-md text-muted-foreground ml-2 border border-border/50">⌘K</span>
            </div>
          </div>
        </div>

        {/* Right - Profile & Quick Actions */}
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/5 rounded-xl">
            <span className="text-xl">🔔</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background animate-pulse"></span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 h-12 px-2 hover:bg-transparent group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-[0_4px_12px_rgba(var(--primary-rgb),0.3)] group-hover:scale-105 transition-all">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-black text-foreground leading-tight">{userName}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary leading-tight">{userRole}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-[1.5rem] border-border/40 shadow-2xl backdrop-blur-2xl bg-card/90">
              <div className="px-4 py-3 mb-2">
                <p className="text-sm font-black text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground font-medium">{userRole === 'Student' ? 'alex@example.com' : 'sarah@example.com'}</p>
              </div>
              <DropdownMenuSeparator className="bg-border/40" />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/admin/settings")}
                className="rounded-xl py-3 cursor-pointer mt-1 focus:bg-primary/10 focus:text-primary transition-colors"
              >
                <span className="mr-3">👤</span> Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast.success("Learning Journey Insights")
                  router.push("/dashboard/admin/reports")
                }}
                className="rounded-xl py-3 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors"
              >
                <span className="mr-3">📊</span> Learning Activity
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.success("Opening Preferences")}
                className="rounded-xl py-3 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors"
              >
                <span className="mr-3">⚙️</span> Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/40" />
              <DropdownMenuItem onClick={onLogout} className="rounded-xl py-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center mt-1">
                <span className="mr-3 text-lg">🚪</span>
                <span className="font-bold">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
