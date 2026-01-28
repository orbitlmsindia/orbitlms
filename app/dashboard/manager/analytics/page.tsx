"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Target, Activity, LayoutDashboard, BarChart, LineChart, Zap, Award } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/manager", icon: <LayoutDashboard size={24} /> },
    { title: "Users", href: "/dashboard/manager/users", icon: <Users size={24} /> },
    { title: "Reports", href: "/dashboard/manager/reports", icon: <BarChart size={24} /> },
    { title: "Analytics", href: "/dashboard/manager/analytics", icon: <LineChart size={24} /> },
    { title: "Performance", href: "/dashboard/manager/performance", icon: <Zap size={24} /> },
    { title: "Certificates", href: "/dashboard/manager/certificates", icon: <Award size={24} /> },
]

export default function ManagerAnalyticsPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/manager/analytics')
                const data = await res.json()
                if (data.success) {
                    setStats(data.data)
                }
            } catch (error) {
                console.error("Failed to load analytics")
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()
    }, [])

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar">
                <div className="flex items-center justify-center py-6 border-b border-sidebar-border">
                    <img src="/logo.png" alt="Orbit" className="w-24 h-24 object-contain" />
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav userName={session?.user?.name || "Manager"} userRole="Manager" onLogout={() => router.push("/login")} />
                <main className="flex-1 overflow-auto bg-muted/20">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8">Strategic Analytics</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { title: "Total Students", value: loading ? "-" : stats?.totalStudents, change: "Active across all courses", icon: Users, color: "text-blue-500" },
                                { title: "Completion Rate", value: loading ? "-" : `${stats?.completionRate}%`, change: "Average course completion", icon: Target, color: "text-green-500" },
                                { title: "Total Enrollments", value: loading ? "-" : stats?.totalEnrollments, change: "Total course registrations", icon: Activity, color: "text-purple-500" },
                                { title: "Certified Students", value: loading ? "-" : stats?.completedEnrollments, change: "Successfully certified", icon: Award, color: "text-yellow-500" },
                            ].map((stat, i) => (
                                <Card key={i}>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground font-medium">{stat.change}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="min-h-[400px]">
                            <CardHeader>
                                <CardTitle>Course Performance Overview</CardTitle>
                                <CardDescription>Top performing courses by average student progress</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-[300px] flex items-center justify-center">Loading...</div>
                                ) : stats?.coursePerformance?.length > 0 ? (
                                    <div className="space-y-6">
                                        {stats.coursePerformance.map((course: any, i: number) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span>{course.courseName}</span>
                                                    <span className="text-muted-foreground">{course.avgProgress}% Avg. Progress</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${course.avgProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        No course performance data available yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
