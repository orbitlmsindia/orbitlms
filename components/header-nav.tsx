"use client"

import { useState, useEffect } from "react"
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
  userImage?: string
  onLogout: () => void
}

import { useSession } from "next-auth/react"

export function HeaderNav({ userName, userRole, userImage, onLogout }: HeaderNavProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    if (!session?.user) return
    try {
      const res = await fetch(`/api/notifications?userId=${(session.user as any).id}`)
      const data = await res.json()
      if (data.success) {
        setNotifications(data.data)
        setUnreadCount(data.data.filter((n: any) => !n.isRead).length)
      }
    } catch (error) {
      console.error("Failed to fetch notifications")
    }
  }

  const markAllAsRead = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!session?.user) return
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id)
    if (unreadIds.length === 0) return

    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: unreadIds })
      })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      toast.error("Failed to update notifications")
    }
  }

  // Poll for notifications every minute or on mount
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [session])

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-card/40 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] transition-all">
      <div className="flex items-center justify-between px-6 lg:px-10 h-20 gap-6">
        {/* Left - Branding */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push("/")}>
          <img src="/logo.png" alt="Orbit" className="h-10 w-auto object-contain" />
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/5 rounded-xl outline-none">
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background animate-pulse"></span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-[1.5rem] border-border/40 shadow-2xl backdrop-blur-2xl bg-card/90 overflow-hidden">
              <div className="p-4 border-b border-border/40 flex justify-between items-center bg-muted/20">
                <h3 className="font-black text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-xs">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif: any) => (
                    <DropdownMenuItem key={notif._id} className={`flex flex-col items-start gap-1 p-3 rounded-xl cursor-pointer ${!notif.isRead ? 'bg-primary/5' : ''}`}>
                      <div className="flex justify-between w-full">
                        <span className={`text-sm font-bold ${!notif.isRead ? 'text-primary' : 'text-foreground'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{new Date(notif.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notif.message}
                      </p>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 h-12 px-2 hover:bg-transparent group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-[0_4px_12px_rgba(var(--primary-rgb),0.3)] group-hover:scale-105 transition-all overflow-hidden">
                  {userImage || session?.user?.image ? (
                    <img src={userImage || session?.user?.image || ""} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    userName.charAt(0).toUpperCase()
                  )}
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
                <p className="text-xs text-muted-foreground font-medium">{session?.user?.email || (userRole === 'Student' ? 'alex@example.com' : 'sarah@example.com')}</p>
              </div>
              <DropdownMenuSeparator className="bg-border/40" />
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/${userRole.toLowerCase()}/settings`)}
                className="rounded-xl py-3 cursor-pointer mt-1 focus:bg-primary/10 focus:text-primary transition-colors"
              >
                <span className="mr-3">👤</span> Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push("/dashboard/student/activity")
                }}
                className="rounded-xl py-3 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors"
              >
                <span className="mr-3">📊</span> Learning Activity
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
