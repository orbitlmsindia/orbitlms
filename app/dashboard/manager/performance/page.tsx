"use client"

import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap, Target, Award, Users } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/manager", icon: "🏠" },
    { title: "Reports", href: "/dashboard/manager/reports", icon: "📊" },
    { title: "Analytics", href: "/dashboard/manager/analytics", icon: "📈" },
    { title: "Performance", href: "/dashboard/manager/performance", icon: "⚡" },
    { title: "Certificates", href: "/dashboard/manager/certificates", icon: "🏆" },
]

export default function ManagerPerformancePage() {
    const router = useRouter()

    const departmentalKPIs = [
        { name: "Product Engineering", score: 92, target: 95, color: "bg-green-500" },
        { name: "Digital Marketing", score: 68, target: 80, color: "bg-blue-500" },
        { name: "Customer Relations", score: 85, target: 85, color: "bg-yellow-500" },
        { name: "Regional Sales", score: 45, target: 60, color: "bg-red-500" },
    ]

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar">
                <div className="flex items-center gap-2 px-4 py-6 border-b border-sidebar-border">
                    <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold">E</div>
                    <span className="text-lg font-bold text-sidebar-foreground">EduHub</span>
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav userName="Manager User" userRole="Manager" onLogout={() => router.push("/login")} />
                <main className="flex-1 overflow-auto bg-muted/20">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8">Performance Management</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Departmental KPIs</CardTitle>
                                        <CardDescription>Track learning performance against corporate targets</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                        {departmentalKPIs.map((kpi, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span>{kpi.name}</span>
                                                    <span className="text-muted-foreground">{kpi.score}% / {kpi.target}% Target</span>
                                                </div>
                                                <Progress value={kpi.score} className={`h-2 [&>div]:${kpi.color}`} />
                                            </div>
                                        ))}
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
                                            <p className="text-xs font-medium text-green-700">Engineering completion is at an all-time high.</p>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                            <Target className="w-5 h-5 text-red-600" />
                                            <p className="text-xs font-medium text-red-700">Sales department requires immediate focus.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base text-primary">Key Achievement</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center pb-6">
                                        <Award className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                                        <h3 className="font-bold">Elite Learning Status</h3>
                                        <p className="text-xs text-muted-foreground">Institution is in top 5% globally</p>
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
