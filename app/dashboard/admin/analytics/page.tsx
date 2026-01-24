"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, BookOpen, Activity, Share2 } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/admin", icon: "🏠" },
    { title: "Users", href: "/dashboard/admin/users", icon: "👥" },
    { title: "Courses", href: "/dashboard/admin/courses", icon: "📚" },
    { title: "Reports", href: "/dashboard/admin/reports", icon: "📊" },
    { title: "Analytics", href: "/dashboard/admin/analytics", icon: "📈" },
]

export default function AdminAnalyticsPage() {
    const router = useRouter()
    const { data: session } = useSession()

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar">
                <div className="flex items-center justify-center py-6 border-b border-sidebar-border">
                    <img src="/logo.png" alt="Orbit" className="w-24 h-24 object-contain" />
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav userName={session?.user?.name || "Admin"} userRole="Administrator" onLogout={() => router.push("/login")} />

                <main className="flex-1 overflow-auto bg-muted/20">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">System Analytics</h1>
                                <p className="text-muted-foreground">Real-time platform usage and performance metrics</p>
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Share2 className="w-4 h-4" /> Share Dashboard
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { title: "Daily Active Users", value: "1.2k", change: "+12%", icon: Users },
                                { title: "Course Subscriptions", value: "48", change: "+5%", icon: BookOpen },
                                { title: "System Response", value: "120ms", change: "-10ms", icon: Activity },
                                { title: "Platform Growth", value: "24%", change: "+2%", icon: TrendingUp },
                            ].map((stat, i) => (
                                <Card key={i}>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                        <stat.icon className="w-4 h-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-blue-500'}`}>
                                            {stat.change} from last period
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="h-[400px]">
                                <CardHeader>
                                    <CardTitle>User Acquisition</CardTitle>
                                    <CardDescription>New signups vs Course enrollments</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center text-muted-foreground italic h-[250px]">
                                    Chart Visualization Placeholder (Integrate with Chart.js or Recharts)
                                </CardContent>
                            </Card>
                            <Card className="h-[400px]">
                                <CardHeader>
                                    <CardTitle>Resource Usage</CardTitle>
                                    <CardDescription>Server load and database performance</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center text-muted-foreground italic h-[250px]">
                                    System Health Monitoring Placeholder
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
