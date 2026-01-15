"use client"

import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Search, Filter, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/manager", icon: "🏠" },
    { title: "Reports", href: "/dashboard/manager/reports", icon: "📊" },
    { title: "Analytics", href: "/dashboard/manager/analytics", icon: "📈" },
    { title: "Performance", href: "/dashboard/manager/performance", icon: "⚡" },
    { title: "Certificates", href: "/dashboard/manager/certificates", icon: "🏆" },
]

export default function ManagerCertificatesPage() {
    const router = useRouter()

    const issuedCertificates = [
        { name: "Alex Johnson", course: "Web Architecture", date: "Mar 15, 2024", id: "CERT-982-12" },
        { name: "Sarah Smith", course: "UX Strategic Design", date: "Mar 12, 2024", id: "CERT-872-99" },
        { name: "Emily Watson", course: "Product Management", date: "Mar 05, 2024", id: "CERT-772-54" },
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
                        <h1 className="text-3xl font-bold mb-8">Certificate Management</h1>
                        <Card className="mb-8">
                            <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="Search shared certificates or student name..." className="pl-9" />
                                    </div>
                                    <Button variant="outline" className="gap-2">
                                        <Filter className="w-4 h-4" /> Filter
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {issuedCertificates.map((cert, i) => (
                                <Card key={i} className="hover:border-primary/50 transition-all border-l-4 border-l-primary/20">
                                    <CardHeader className="pb-3">
                                        <Award className="w-8 h-8 text-primary mb-2" />
                                        <CardTitle className="text-base truncate">{cert.course}</CardTitle>
                                        <CardDescription>Issued to <span className="text-foreground font-medium">{cert.name}</span></CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-2 rounded bg-muted text-[10px] font-mono text-center border">
                                            ID: {cert.id}
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                            <span>Date: {cert.date}</span>
                                            <Button variant="link" className="p-0 h-auto gap-1 text-primary">
                                                <ShieldCheck className="w-3 h-3" /> Validate
                                            </Button>
                                        </div>
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
