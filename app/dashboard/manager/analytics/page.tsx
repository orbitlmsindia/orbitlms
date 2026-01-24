"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Target, Activity } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/manager", icon: "ÃƒÂ°Ã…Â¸Ã‚ÂÃ‚Â " },
    { title: "Reports", href: "/dashboard/manager/reports", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â " },
    { title: "Analytics", href: "/dashboard/manager/analytics", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‹â€ " },
    { title: "Performance", href: "/dashboard/manager/performance", icon: "ÃƒÂ¢Ã…Â¡Ã‚Â¡" },
    { title: "Certificates", href: "/dashboard/manager/certificates", icon: "ÃƒÂ°Ã…Â¸Ã‚ÂÃ¢â‚¬Â " },
]

export default function ManagerAnalyticsPage() {
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
                <HeaderNav userName={session?.user?.name || "Manager"} userRole="Manager" onLogout={() => router.push("/login")} />
                <main className="flex-1 overflow-auto bg-muted/20">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8">Strategic Analytics</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { title: "Total Enrollment", value: "8,240", change: "+14%", icon: Users },
                                { title: "Completion Rate", value: "72%", change: "+3.2%", icon: Target },
                                { title: "Avg Session", value: "45m", change: "-2m", icon: Activity },
                                { title: "Organization ROI", value: "2.4x", change: "+0.3", icon: TrendingUp },
                            ].map((stat, i) => (
                                <Card key={i}>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                        <stat.icon className="w-4 h-4 text-primary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-green-500 font-medium">{stat.change} vs last year</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="min-h-[400px]">
                            <CardHeader>
                                <CardTitle>Organization-wide Learning Curve</CardTitle>
                                <CardDescription>Progression of skills across all departments</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/30">
                                <span className="text-muted-foreground font-medium italic">Advanced Analytics Visualization Placeholder</span>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
