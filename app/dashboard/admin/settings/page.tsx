"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Bell, Globe, Database, Save, Lock } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/admin", icon: "🏠" },
    { title: "Users", href: "/dashboard/admin/users", icon: "👥" },
    { title: "Courses", href: "/dashboard/admin/courses", icon: "📚" },
    { title: "Reports", href: "/dashboard/admin/reports", icon: "📊" },
    { title: "Analytics", href: "/dashboard/admin/analytics", icon: "📈" },
]

export default function AdminSettingsPage() {
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
                    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Global Settings</h1>
                                <p className="text-muted-foreground">Configure system-wide policies and integrations</p>
                            </div>
                            <Button className="gap-2">
                                <Save className="w-4 h-4" /> Save All Changes
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-primary" />
                                        <CardTitle className="text-lg">Security & Privacy</CardTitle>
                                    </div>
                                    <CardDescription>Manage password policies and system access rules</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Two-Factor Authentication</Label>
                                            <p className="text-sm text-muted-foreground">Enforce 2FA for all administrator accounts</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Strict Password Policy</Label>
                                            <p className="text-sm text-muted-foreground">Require symbols, numbers, and capital letters</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Session Timeout (Minutes)</Label>
                                        <Input type="number" defaultValue={30} className="max-w-[120px]" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-primary" />
                                        <CardTitle className="text-lg">System Configuration</CardTitle>
                                    </div>
                                    <CardDescription>General platform behavior and localization</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">New User Registration</Label>
                                            <p className="text-sm text-muted-foreground">Allow new users to sign up themselves</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Maintenance Mode</Label>
                                            <p className="text-sm text-muted-foreground">Take the platform offline for updates</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-destructive/20">
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-destructive">
                                        <Database className="w-5 h-5" />
                                        <CardTitle className="text-lg">Danger Zone</CardTitle>
                                    </div>
                                    <CardDescription>Permanent actions that cannot be undone</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Deleting system logs or resetting the database will result in permanent data loss.
                                    </p>
                                    <div className="flex gap-4">
                                        <Button variant="destructive" className="gap-2">
                                            <Database className="w-4 h-4" /> Clear Cache
                                        </Button>
                                        <Button variant="destructive" className="gap-2">
                                            <Lock className="w-4 h-4" /> Reset API Keys
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
