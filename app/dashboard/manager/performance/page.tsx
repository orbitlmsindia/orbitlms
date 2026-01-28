"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap, Target, Award, Users, LayoutDashboard, BarChart, LineChart } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/manager", icon: <LayoutDashboard size={24} /> },
    { title: "Users", href: "/dashboard/manager/users", icon: <Users size={24} /> },
    { title: "Reports", href: "/dashboard/manager/reports", icon: <BarChart size={24} /> },
    { title: "Analytics", href: "/dashboard/manager/analytics", icon: <LineChart size={24} /> },
    { title: "Performance", href: "/dashboard/manager/performance", icon: <Zap size={24} /> },
    { title: "Certificates", href: "/dashboard/manager/certificates", icon: <Award size={24} /> },
]

export default function ManagerPerformancePage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/manager/analytics')
                const json = await res.json()
                if (json.success) setData(json.data)
            } catch (error) {
                console.error("Failed to load performance data")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
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
                        <h1 className="text-3xl font-bold mb-8">Performance Management</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Course Performance KPIs</CardTitle>
                                        <CardDescription>Track learning performance across active courses</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                        {loading ? (
                                            <div className="text-center py-8 text-muted-foreground">Loading performance metrics...</div>
                                        ) : data?.coursePerformance?.length > 0 ? (
                                            data.coursePerformance.map((course: any, i: number) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between text-sm font-medium">
                                                        <span>{course.courseName}</span>
                                                        <span className="text-muted-foreground">{course.avgProgress}% Avg. Progress ({course.totalStudents} Students)</span>
                                                    </div>
                                                    <Progress value={course.avgProgress} className="h-2" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">No course performance data available.</div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Quick Insights</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                            <Zap className="w-5 h-5 text-green-600" />
                                            <p className="text-xs font-medium text-green-700">
                                                {loading ? "Loading..." : `Overall Completion Rate is ${data?.completionRate}%`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                            <Target className="w-5 h-5 text-blue-600" />
                                            <p className="text-xs font-medium text-blue-700">
                                                {loading ? "Loading..." : `${data?.totalEnrollments} Total Active Enrollments`}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base text-primary">Key Achievement</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center pb-6">
                                        <Award className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                                        <h3 className="font-bold">Total Certifications</h3>
                                        <p className="text-2xl font-bold mt-2">{loading ? "-" : data?.completedEnrollments}</p>
                                        <p className="text-xs text-muted-foreground">Students completed courses</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
