"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Check, X, LayoutDashboard, Users, BarChart, LineChart, Zap, Award } from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/manager", icon: <LayoutDashboard size={24} /> },
  { title: "Users", href: "/dashboard/manager/users", icon: <Users size={24} /> },
  { title: "Reports", href: "/dashboard/manager/reports", icon: <BarChart size={24} /> },
  { title: "Analytics", href: "/dashboard/manager/analytics", icon: <LineChart size={24} /> },
  { title: "Performance", href: "/dashboard/manager/performance", icon: <Zap size={24} /> },
  { title: "Certificates", href: "/dashboard/manager/certificates", icon: <Award size={24} /> },
]

export default function ManagerDashboard() {
  const router = useRouter()
  const { data: session } = useSession()

  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [teachers, setTeachers] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("staff")

  const fetchUsers = async () => {
    try {
      const [teachersRes, studentsRes] = await Promise.all([
        fetch('/api/users?role=teacher'),
        fetch('/api/users?role=student')
      ])

      const teachersData = await teachersRes.json()
      const studentsData = await studentsRes.json()

      if (teachersData.success) setTeachers(teachersData.data)
      if (studentsData.success) setStudents(studentsData.data)
    } catch (error) {
      console.error("Failed to fetch users")
      toast.error("Failed to load user lists")
    }
  }



  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`User status updated to ${newStatus}`)
        fetchUsers() // Refresh lists
      } else {
        toast.error(data.error || "Update failed")
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        const data = await res.json()
        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch stats")
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
    fetchUsers()
  }, [])

  const pendingTeachers = teachers.filter(t => t.status === 'pending')
  const activeTeachers = teachers.filter(t => t.status !== 'pending')

  const performanceMetrics = [
    { metric: "Total Students", value: stats?.totalStudents?.toString() || "0", trend: "stable" },
    { metric: "Total Courses", value: stats?.totalCourses?.toString() || "0", trend: "stable" },
    { metric: "Active Users", value: stats?.activeUsers?.toString() || "0", trend: "up" },
    { metric: "Total Teachers", value: stats?.totalTeachers?.toString() || "0", trend: "stable" },
  ]

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
          userName={session?.user?.name || "Manager"}
          userRole="Manager"
          onLogout={() => {
            router.push("/login")
          }}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Institution Dashboard</h1>
              <p className="text-muted-foreground">Monitor institutional performance and analytics</p>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {performanceMetrics.map((item, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{item.metric}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">{isLoading ? "-" : item.value}</span>
                        {/* Trend indicator removed as we don't have historical data yet */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="departments" className="space-y-4">
              <TabsList>
                <TabsTrigger value="departments">Department Analytics</TabsTrigger>
                <TabsTrigger value="trends">Learning Trends</TabsTrigger>
                <TabsTrigger value="reports">Generate Reports</TabsTrigger>
                <TabsTrigger value="staff">User Management</TabsTrigger>
              </TabsList>

              <TabsContent value="staff" className="space-y-6">
                {/* Pending Approvals Section */}
                {pendingTeachers.length > 0 && (
                  <Card className="border-orange-200 bg-orange-50/10">
                    <CardHeader>
                      <CardTitle className="text-orange-700">Pending Teacher Approvals</CardTitle>
                      <CardDescription>Action required: Review new teacher registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pendingTeachers.map((teacher) => (
                          <div key={teacher._id} className="flex flex-col sm:flex-row items-center justify-between p-4 border border-orange-200 rounded-lg bg-background">
                            <div className="mb-4 sm:mb-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{teacher.name}</h4>
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Pending</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{teacher.email}</p>
                              <p className="text-xs text-muted-foreground mt-1">Applied: {new Date(teacher.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => handleUpdateStatus(teacher._id, 'rejected')}>
                                <X className="w-4 h-4 mr-1" /> Reject
                              </Button>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateStatus(teacher._id, 'active')}>
                                <Check className="w-4 h-4 mr-1" /> Approve
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Tabs defaultValue="teachers" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger value="teachers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
                      Teachers ({teachers.length})
                    </TabsTrigger>
                    <TabsTrigger value="students" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
                      Students ({students.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="teachers" className="pt-4">
                    <Card>
                      <CardContent className="p-0">
                        {activeTeachers.length === 0 ? (
                          <div className="p-8 text-center text-muted-foreground">No active teachers found.</div>
                        ) : (
                          <div className="divide-y">
                            {activeTeachers.map((teacher) => (
                              <div key={teacher._id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                <div>
                                  <h4 className="font-medium">{teacher.name}</h4>
                                  <p className="text-sm text-muted-foreground">{teacher.email}</p>
                                  <div className="flex gap-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {teacher.status}
                                    </span>
                                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">Joined: {new Date(teacher.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <div>
                                  {teacher.status === 'active' ? (
                                    <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleUpdateStatus(teacher._id, 'inactive')}>
                                      Deactivate
                                    </Button>
                                  ) : (
                                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => handleUpdateStatus(teacher._id, 'active')}>
                                      Activate
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="students" className="pt-4">
                    <Card>
                      <CardContent className="p-0">
                        {students.length === 0 ? (
                          <div className="p-8 text-center text-muted-foreground">No students enrolled yet.</div>
                        ) : (
                          <div className="divide-y">
                            {students.map((student) => (
                              <div key={student._id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                <div>
                                  <h4 className="font-medium">{student.name}</h4>
                                  <p className="text-sm text-muted-foreground">{student.email}</p>
                                  <div className="flex gap-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {student.status}
                                    </span>
                                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">Joined: {new Date(student.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <div>
                                  <Button size="sm" variant="ghost" disabled>View Details</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

              </TabsContent>

              <TabsContent value="departments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Department Performance</CardTitle>
                    <CardDescription>Performance metrics by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <p>No department data available.</p>
                      <p className="text-xs mt-2">(Departmental analytics will appear here once configured)</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Trends</CardTitle>
                    <CardDescription>Analyze learning patterns and student engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <p className="text-muted-foreground text-sm mb-4">Analytics chart would render here</p>
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                          <span className="text-muted-foreground">📈 Chart Visualization</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Generate Reports</CardTitle>
                    <CardDescription>Create comprehensive institutional reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { title: "Performance Report", desc: "Comprehensive institutional performance metrics" },
                      { title: "Student Progress", desc: "Individual and cohort learning progress analysis" },
                      { title: "Course Effectiveness", desc: "Analysis of course completion rates and outcomes" },
                      { title: "Financial Summary", desc: "Revenue and enrollment analytics" },
                    ].map((report, i) => (
                      <div key={i} className="p-4 rounded-lg border border-border flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-foreground">{report.title}</h4>
                          <p className="text-sm text-muted-foreground">{report.desc}</p>
                        </div>
                        <Button size="sm">Generate</Button>
                      </div>
                    ))}
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
