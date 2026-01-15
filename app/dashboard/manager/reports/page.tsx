"use client"

import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart3, PieChart } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/manager", icon: "🏠" },
    { title: "Reports", href: "/dashboard/manager/reports", icon: "📊" },
    { title: "Analytics", href: "/dashboard/manager/analytics", icon: "📈" },
    { title: "Performance", href: "/dashboard/manager/performance", icon: "⚡" },
    { title: "Certificates", href: "/dashboard/manager/certificates", icon: "🏆" },
]

export default function ManagerReportsPage() {
    const router = useRouter()

    const reports = [
        { title: "Institutional ROI Report", desc: "Detailed analysis of training investment returns", type: "PDF" },
        { title: "Departmental Progress", desc: "Monthly breakdown of department learning stats", type: "Excel" },
        { title: "Skill Gap Analysis", desc: "Identification of organizational competency gaps", type: "PDF" },
        { title: "Engagement Metrics", desc: "User interaction and platform usage statistics", type: "CSV" },
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
                        <h1 className="text-3xl font-bold mb-8">Strategic Reports</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reports.map((report, i) => (
                                <Card key={i} className="hover:border-primary/50 transition-all cursor-pointer group">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{report.title}</CardTitle>
                                            <CardDescription>{report.desc}</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex justify-between items-center pt-0">
                                        <span className="text-xs font-medium text-muted-foreground uppercase">{report.type} File • Generated Mar 20</span>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Download className="w-4 h-4" /> Download
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
