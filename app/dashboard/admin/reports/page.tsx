"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, Calendar, Filter, FileBarChart, Loader2 } from "lucide-react"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { toast } from "sonner"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/admin", icon: "🏠" },
    { title: "Users", href: "/dashboard/admin/users", icon: "👥" },
    { title: "Courses", href: "/dashboard/admin/courses", icon: "📚" },
    { title: "Reports", href: "/dashboard/admin/reports", icon: "📊" },
    { title: "Analytics", href: "/dashboard/admin/analytics", icon: "📈" },
]

export default function AdminReportsPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [reports, setReports] = useState<any[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        try {
            const res = await fetch('/api/reports')
            const result = await res.json()
            if (result.success) {
                setReports(result.data)
                if (result.data.length > 0) {
                    // Set last updated to the most recent report's date
                    const date = new Date(result.data[0].createdAt)
                    setLastUpdated(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))
                }
            }
        } catch (error) {
            console.error("Failed to fetch reports")
        }
    }

    const handleGenerate = async (type: string, title?: string) => {
        setIsGenerating(true)
        try {
            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title || `Platform_Audit_${new Date().getTime()}`,
                    type: type,
                    generatedBy: session?.user?.name || "Admin"
                })
            })
            const result = await res.json()
            if (result.success) {
                toast.success("Report Generated Successfully")
                fetchReports()
            } else {
                toast.error("Failed to generate report")
            }
        } catch (error) {
            toast.error("Error generating report")
        } finally {
            setIsGenerating(false)
        }
    }

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
                                <h1 className="text-3xl font-bold text-foreground mb-2">Platform Reports</h1>
                                <p className="text-muted-foreground">Generate and download system-wide audit reports</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <DatePickerWithRange />
                                <Button
                                    className="gap-2"
                                    onClick={() => handleGenerate("PDF", "Main_System_Report")}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                    Generate Report
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {[
                                { title: "Financial Report", desc: "Monthly revenue and transaction details", icon: FileText, type: "PDF" },
                                { title: "User Growth Report", desc: "New registrations and churn rate analysis", icon: FileBarChart, type: "Excel" },
                                { title: "System Audit Log", desc: "All administrative actions performed in the system", icon: FileText, type: "CSV" },
                            ].map((report, i) => (
                                <Card key={i} className="hover:border-primary/50 transition-all cursor-pointer" onClick={() => handleGenerate(report.type, report.title)}>
                                    <CardHeader>
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                                            <report.icon className="w-5 h-5" />
                                        </div>
                                        <CardTitle>{report.title}</CardTitle>
                                        <CardDescription>{report.desc}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <Button variant="link" className="p-0 h-auto text-xs gap-1">
                                            <Download className="w-3 h-3" />
                                            {lastUpdated ? `Latest: ${lastUpdated}` : 'Generate Now'}
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
                                {reports.length > 0 ? (
                                    <div className="space-y-4">
                                        {reports.map((report) => (
                                            <div key={report._id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{report.title}.{report.type.toLowerCase()}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Generated by {report.generatedBy} • {new Date(report.createdAt).toLocaleDateString()} {new Date(report.createdAt).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => toast.info("Download started...")}>
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                        <FileText className="w-12 h-12 mb-4 opacity-20" />
                                        <p className="font-medium">No reports generated recently</p>
                                        <p className="text-xs">Generated reports will appear here for download.</p>
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
