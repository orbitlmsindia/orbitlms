"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/admin", icon: "🏠" },
  { title: "Users", href: "/dashboard/admin/users", icon: "👥" },
  { title: "Courses", href: "/dashboard/admin/courses", icon: "📚" },
  { title: "Reports", href: "/dashboard/admin/reports", icon: "📊" },
  { title: "Analytics", href: "/dashboard/admin/analytics", icon: "📈" },
]

interface User {
  id: string
  name: string
  email: string
  role: "student" | "teacher" | "manager" | "admin"
  status: "active" | "inactive"
  joinedDate: string
}

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  totalStudents: number
  totalTeachers: number
  systemHealth: number
}

// Mock data and stats replaced by API integration

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student" })

  const fetchData = async () => {
    try {
      const statsRes = await fetch('/api/stats', { cache: 'no-store' })
      const statsData = await statsRes.json()
      if (statsData.success) setStats(statsData.data)

      const usersRes = await fetch('/api/users', { cache: 'no-store' })
      const usersData = await usersRes.json()
      if (usersData.success) {
        setUsers(usersData.data.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          joinedDate: new Date(u.joinedDate).toLocaleDateString()
        })))
      }
    } catch (error) {
      toast.error("Dashboard failed to synchronize with vault")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Name and Email are required")
      return
    }

    try {
      const payload = {
        ...newUser,
        password: "password123", // Default password
        // Type assertion for instituteId if not strictly typed in session
        instituteId: (session?.user as any)?.instituteId || "65b2a3c4e8f1a2b3c4d5e6f7" // Fallback or handle error
      }

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      if (data.success) {
        toast.success("User added successfully")
        setIsUserDialogOpen(false)
        setNewUser({ name: "", email: "", role: "student" })
        fetchData()
      } else {
        toast.error(data.error || "Failed to add user")
      }
    } catch (e) {
      toast.error("Failed to create user")
    }
  }

  const handleDisableUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'inactive' })
      })
      const data = await res.json()

      if (data.success) {
        toast.success("User access revoked")
        fetchData()
      } else {
        toast.error("Failed to disable user")
      }
    } catch (e) {
      toast.error("Action failed")
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar">
        <div className="flex items-center justify-center py-6 border-b border-sidebar-border">
          <img src="/logo.png" alt="Orbit" className="w-24 h-24 object-contain" />
        </div>
        <SidebarNav
          items={sidebarItems}
          onLogout={() => {
            router.push("/login")
          }}
        />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderNav
          userName={session?.user?.name || "Admin"}
          userRole="Administrator"
          onLogout={() => {
            router.push("/login")
          }}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">System Dashboard</h1>
                <p className="text-muted-foreground">Monitor and manage your Orbit instance</p>
              </div>
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Add User</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account with specific role</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <Input
                        placeholder="John Doe"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Role</label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser}>
                      Add User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{isLoading ? "---" : stats?.totalUsers}</div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">{isLoading ? "---" : stats?.activeUsers}</div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{isLoading ? "---" : stats?.totalCourses}</div>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">{isLoading ? "---" : stats?.totalStudents}</div>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{isLoading ? "---" : stats?.totalTeachers}</div>
                    <p className="text-sm text-muted-foreground">Teachers</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">{isLoading ? "---" : stats?.systemHealth}%</div>
                    <p className="text-sm text-muted-foreground">Health</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="users" className="space-y-4">
              <TabsList>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="activity">System Activity</TabsTrigger>
                <TabsTrigger value="settings">Configuration</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all system users and their permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {isLoading ? (
                        <div className="p-10 text-center animate-pulse italic text-muted-foreground font-medium">
                          Retrieving authorized profiles from the system...
                        </div>
                      ) : users.slice(0, 5).map((user) => (
                        <div
                          key={user.id}
                          className="p-4 rounded-lg border border-border hover:border-primary/50 transition flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary font-medium capitalize">
                                {user.role}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${user.status === "active"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  }`}
                              >
                                {user.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-2">Joined {user.joinedDate}</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toast.info(`Editing user: ${user.name}`)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDisableUser(user.id)}
                              >
                                Disable
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Activity</CardTitle>
                    <CardDescription>Real-time system events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                      <p>No recent system activity recorded.</p>
                      <p className="text-xs mt-2">(Activity logging is currently not enabled)</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>Manage system-wide settings and policies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">General Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <label className="text-sm font-medium text-foreground">Maintenance Mode</label>
                          <input type="checkbox" className="w-5 h-5" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <label className="text-sm font-medium text-foreground">Allow Registration</label>
                          <input type="checkbox" defaultChecked className="w-5 h-5" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <label className="text-sm font-medium text-foreground">Email Verification Required</label>
                          <input type="checkbox" defaultChecked className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Security Settings</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border border-border">
                          <label className="text-sm font-medium text-foreground block mb-2">Password Policy</label>
                          <Input placeholder="Minimum password length: 8" />
                        </div>
                        <div className="p-3 rounded-lg border border-border">
                          <label className="text-sm font-medium text-foreground block mb-2">
                            Session Timeout (mins)
                          </label>
                          <Input placeholder="30" />
                        </div>
                      </div>
                    </div>

                    <Button>Save Settings</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
