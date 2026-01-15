"use client"

import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, Calendar, Filter, FileBarChart } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/admin", icon: "🏠" },
    { title: "Users", href: "/dashboard/admin/users", icon: "👥" },
    { title: "Courses", href: "/dashboard/admin/courses", icon: "📚" },
    { title: "Reports", href: "/dashboard/admin/reports", icon: "📊" },
    { title: "Settings", href: "/dashboard/admin/settings", icon: "⚙️" },
    { title: "Analytics", href: "/dashboard/admin/analytics", icon: "📈" },
]

export default function AdminReportsPage() {
    const router = useRouter()

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
                <HeaderNav userName="Admin User" userRole="Administrator" onLogout={() => router.push("/login")} />

                <main className="flex-1 overflow-auto bg-muted/20">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Platform Reports</h1>
                                <p className="text-muted-foreground">Generate and download system-wide audit reports</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="gap-2">
                                    <Calendar className="w-4 h-4" /> Date Range
                                </Button>
                                <Button className="gap-2">
                                    <Download className="w-4 h-4" /> Generate Report
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {[
                                { title: "Financial Report", desc: "Monthly revenue and transaction details", icon: FileText },
                                { title: "User Growth Report", desc: "New registrations and churn rate analysis", icon: FileBarChart },
                                { title: "System Audit Log", desc: "All administrative actions performed in the system", icon: FileText },
                            ].map((report, i) => (
                                <Card key={i} className="hover:border-primary/50 transition-all cursor-pointer">
                                    <CardHeader>
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                                            <report.icon className="w-5 h-5" />
                                        </div>
                                        <CardTitle>{report.title}</CardTitle>
                                        <CardDescription>{report.desc}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <Button variant="link" className="p-0 h-auto text-xs gap-1">
                                            <Download className="w-3 h-3" /> Latest: Feb 20, 2024
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Exports</CardTitle>
                                <CardDescription>History of generated reports available for download</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">System_Health_v1.0.{i}.pdf</p>
                                                    <p className="text-xs text-muted-foreground">Generated by Admin • 2 hours ago</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
