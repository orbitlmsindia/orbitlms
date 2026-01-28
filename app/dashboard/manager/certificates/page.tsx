"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Search, Filter, ShieldCheck, LayoutDashboard, Users, BarChart, LineChart, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/manager", icon: <LayoutDashboard size={24} /> },
    { title: "Users", href: "/dashboard/manager/users", icon: <Users size={24} /> },
    { title: "Reports", href: "/dashboard/manager/reports", icon: <BarChart size={24} /> },
    { title: "Analytics", href: "/dashboard/manager/analytics", icon: <LineChart size={24} /> },
    { title: "Performance", href: "/dashboard/manager/performance", icon: <Zap size={24} /> },
    { title: "Certificates", href: "/dashboard/manager/certificates", icon: <Award size={24} /> },
]

export default function ManagerCertificatesPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [certificates, setCertificates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await fetch('/api/manager/analytics')
                const json = await res.json()
                if (json.success) {
                    setCertificates(json.data.certificates)
                }
            } catch (error) {
                console.error("Failed to load certificates")
            } finally {
                setLoading(false)
            }
        }
        fetchCertificates()
    }, [])

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar">
                <div className="flex items-center justify-center py-6 border-b border-sidebar-border">
                    <img src="/logo.png" alt="Orbit" className="w-24 h-24 object-contain" />
                </div>
                <SidebarNav
                    items={sidebarItems}
                    onLogout={() => {
                        router.push("/login")
                    }}
                />
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav
                    userName={session?.user?.name || "Manager"}
                    userRole="Manager"
                    onLogout={() => {
                        router.push("/login")
                    }}
                />
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

                        {loading ? (
                            <div className="text-center py-20 text-muted-foreground">Loading certificates...</div>
                        ) : certificates.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {certificates.map((cert, i) => (
                                    <Card key={i} className="hover:border-primary/50 transition-all border-l-4 border-l-primary/20">
                                        <CardHeader className="pb-3">
                                            <Award className="w-8 h-8 text-primary mb-2" />
                                            <CardTitle className="text-base truncate">{cert.course}</CardTitle>
                                            <CardDescription>
                                                Issued to <span className="text-foreground font-medium">{cert.name}</span>
                                            </CardDescription>
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
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                                <Award className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-lg font-medium">No certificates issued yet</p>
                                <p className="text-sm">Issued certificates will appear here once students complete courses.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
