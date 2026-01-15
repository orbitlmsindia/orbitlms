"use client"

import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/manager", icon: "🏠" },
  { title: "Reports", href: "/dashboard/manager/reports", icon: "📊" },
  { title: "Analytics", href: "/dashboard/manager/analytics", icon: "📈" },
  { title: "Performance", href: "/dashboard/manager/performance", icon: "⚡" },
  { title: "Certificates", href: "/dashboard/manager/certificates", icon: "🏆" },
]

export default function ManagerDashboard() {
  const router = useRouter()

  const performanceMetrics = [
    { metric: "Avg Course Completion", value: "68%", trend: "up" },
    { metric: "Student Engagement", value: "78%", trend: "up" },
    { metric: "Course Quality", value: "4.6/5", trend: "stable" },
    { metric: "Active Learners", value: "892", trend: "up" },
  ]

  const departmentStats = [
    { dept: "Engineering", students: 320, courses: 12, completion: 72 },
    { dept: "Business", students: 210, courses: 8, completion: 65 },
    { dept: "Arts", students: 180, courses: 6, completion: 70 },
    { dept: "Science", students: 270, courses: 10, completion: 75 },
  ]

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
          userName="Manager User"
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
                        <span className="text-3xl font-bold text-primary">{item.value}</span>
                        <span
                          className={`text-xs font-semibold ${item.trend === "up" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
                        >
                          {item.trend === "up" ? "↑" : "→"}
                        </span>
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
              </TabsList>

              <TabsContent value="departments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Department Performance</CardTitle>
                    <CardDescription>Performance metrics by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentStats.map((dept) => (
                        <div key={dept.dept} className="p-4 rounded-lg border border-border">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-foreground">{dept.dept}</h4>
                            <span className="text-sm text-muted-foreground">{dept.completion}% completion</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground block text-xs">Students</span>
                              <span className="font-semibold text-foreground text-lg">{dept.students}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-xs">Courses</span>
                              <span className="font-semibold text-foreground text-lg">{dept.courses}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-xs">Completion</span>
                              <span className="font-semibold text-foreground text-lg">{dept.completion}%</span>
                            </div>
                          </div>
                          <div className="mt-3 w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${dept.completion}%` }} />
                          </div>
                        </div>
                      ))}
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
                          <span className="text-muted-foreground">📊 Chart Visualization</span>
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
