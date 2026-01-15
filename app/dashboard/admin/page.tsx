"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  { title: "Settings", href: "/dashboard/admin/settings", icon: "⚙️" },
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

const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "student",
    status: "active",
    joinedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Dr. Sarah Johnson",
    email: "sarah@example.com",
    role: "teacher",
    status: "active",
    joinedDate: "2024-01-10",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "student",
    status: "inactive",
    joinedDate: "2024-02-01",
  },
  {
    id: "4",
    name: "Prof. James Wilson",
    email: "james@example.com",
    role: "teacher",
    status: "active",
    joinedDate: "2024-01-20",
  },
  {
    id: "5",
    name: "Emily Chen",
    email: "emily@example.com",
    role: "manager",
    status: "active",
    joinedDate: "2024-01-25",
  },
]

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  totalStudents: number
  totalTeachers: number
  systemHealth: number
}

const systemStats: SystemStats = {
  totalUsers: 1245,
  activeUsers: 892,
  totalCourses: 56,
  totalStudents: 1050,
  totalTeachers: 120,
  systemHealth: 98,
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student" })

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar">
        <div className="flex items-center gap-2 px-4 py-6 border-b border-sidebar-border">
          <span className="text-lg font-bold text-sidebar-foreground">EduHub</span>
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
          userName="Admin User"
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
                <p className="text-muted-foreground">Monitor and manage your EduHub instance</p>
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
                    <Button
                      onClick={() => {
                        setIsUserDialogOpen(false)
                        setNewUser({ name: "", email: "", role: "student" })
                      }}
                    >
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
                    <div className="text-3xl font-bold text-primary mb-2">{systemStats.totalUsers}</div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">{systemStats.activeUsers}</div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">{systemStats.totalCourses}</div>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{systemStats.totalStudents}</div>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">{systemStats.totalTeachers}</div>
                    <p className="text-sm text-muted-foreground">Teachers</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">{systemStats.systemHealth}%</div>
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
                      {mockUsers.map((user) => (
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
                                onClick={() => toast.error(`Account restricted: ${user.name}`)}
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Login Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Login Activity</CardTitle>
                      <CardDescription>Last 10 user logins</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { user: "Alex Johnson", time: "2024-02-20 14:30", device: "Chrome - macOS" },
                          { user: "Dr. Sarah Johnson", time: "2024-02-20 13:15", device: "Safari - iOS" },
                          { user: "Emily Chen", time: "2024-02-20 12:45", device: "Chrome - Windows" },
                          { user: "Prof. James Wilson", time: "2024-02-20 11:20", device: "Firefox - Linux" },
                          { user: "Michael Brown", time: "2024-02-20 10:30", device: "Chrome - macOS" },
                        ].map((activity, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <p className="text-sm font-medium text-foreground">{activity.user}</p>
                              <p className="text-xs text-muted-foreground">{activity.device}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Events */}
                  <Card>
                    <CardHeader>
                      <CardTitle>System Events</CardTitle>
                      <CardDescription>Recent system events and alerts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { event: "Course Created", user: "Dr. Sarah Johnson", time: "2 hours ago" },
                          { event: "User Registered", user: "New Student", time: "4 hours ago" },
                          { event: "Assessment Submitted", user: "45 Students", time: "6 hours ago" },
                          { event: "System Backup", user: "System", time: "1 day ago" },
                          { event: "Certificate Issued", user: "20 Students", time: "2 days ago" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.event}</p>
                              <p className="text-xs text-muted-foreground">{item.user}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.time}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
