"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Check, X, Users, UserPlus, Shield } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/manager", icon: "ÃƒÂ°Ã…Â¸Ã‚ÂÃ‚Â " },
    { title: "Users", href: "/dashboard/manager/users", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬ËœÃ‚Â¥" },
    { title: "Reports", href: "/dashboard/manager/reports", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â " },
    { title: "Analytics", href: "/dashboard/manager/analytics", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‹â€ " },
    { title: "Performance", href: "/dashboard/manager/performance", icon: "ÃƒÂ¢Ã…Â¡Ã‚Â¡" },
    { title: "Certificates", href: "/dashboard/manager/certificates", icon: "ÃƒÂ°Ã…Â¸Ã‚ÂÃ¢â‚¬Â " },
]

export default function ManagerUsersPage() {
    const router = useRouter()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true)
    const [teachers, setTeachers] = useState<any[]>([])
    const [students, setStudents] = useState<any[]>([])

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const [teachersRes, studentsRes] = await Promise.all([
                fetch('/api/users?role=teacher'),
                fetch('/api/users?role=student')
            ])

            const teachersData = await teachersRes.json()
            const studentsData = await studentsRes.json()

            if (teachersData.success) setTeachers(teachersData.data)
            if (studentsData.success) setStudents(studentsData.data)
        } catch (error) {
            console.error("Failed to fetch users")
            toast.error("Failed to load user lists")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            const data = await res.json()
            if (data.success) {
                toast.success(`User status updated to ${newStatus}`)
                fetchUsers() // Refresh lists
            } else {
                toast.error(data.error || "Update failed")
            }
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const pendingTeachers = teachers.filter(t => t.status === 'pending')
    const activeTeachers = teachers.filter(t => t.status !== 'pending')

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
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

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav
                    userName={session?.user?.name || "Manager"}
                    userRole="Manager"
                    onLogout={() => {
                        router.push("/login")
                    }}
                />

                <main className="flex-1 overflow-auto">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
                                <p className="text-muted-foreground">Manage approvals, teachers, and students for your institute.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={fetchUsers} variant="outline" size="sm">
                                    Refresh List
                                </Button>
                            </div>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <Card>
                                <CardContent className="pt-6 flex items-center gap-4">
                                    <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pending Approvals</p>
                                        <h3 className="text-2xl font-bold">{pendingTeachers.length}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                        <UserPlus className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Active Teachers</p>
                                        <h3 className="text-2xl font-bold">{activeTeachers.filter(t => t.status === 'active').length}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 flex items-center gap-4">
                                    <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Students</p>
                                        <h3 className="text-2xl font-bold">{students.length}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Pending Approvals Section */}
                        {pendingTeachers.length > 0 && (
                            <Card className="border-orange-200 bg-orange-50/10 mb-8">
                                <CardHeader>
                                    <CardTitle className="text-orange-700">Pending Teacher Approvals</CardTitle>
                                    <CardDescription>Action required: Review new teacher registrations</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {pendingTeachers.map((teacher) => (
                                            <div key={teacher._id} className="flex flex-col sm:flex-row items-center justify-between p-4 border border-orange-200 rounded-lg bg-background">
                                                <div className="mb-4 sm:mb-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold text-foreground">{teacher.name}</h4>
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Pending</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{teacher.email}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Applied: {new Date(teacher.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => handleUpdateStatus(teacher._id, 'rejected')}>
                                                        <X className="w-4 h-4 mr-1" /> Reject
                                                    </Button>
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateStatus(teacher._id, 'active')}>
                                                        <Check className="w-4 h-4 mr-1" /> Approve
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Tabs defaultValue="teachers" className="w-full">
                            <TabsList>
                                <TabsTrigger value="teachers">Teachers</TabsTrigger>
                                <TabsTrigger value="students">Students</TabsTrigger>
                            </TabsList>

                            <TabsContent value="teachers" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Teacher Roster</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {activeTeachers.length === 0 ? (
                                            <div className="p-8 text-center text-muted-foreground">No active teachers found.</div>
                                        ) : (
                                            <div className="divide-y">
                                                {activeTeachers.map((teacher) => (
                                                    <div key={teacher._id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                {teacher.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium">{teacher.name}</h4>
                                                                <p className="text-sm text-muted-foreground">{teacher.email}</p>
                                                                <div className="flex gap-2 mt-1">
                                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                        {teacher.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {teacher.status === 'active' ? (
                                                                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleUpdateStatus(teacher._id, 'inactive')}>
                                                                    Deactivate
                                                                </Button>
                                                            ) : (
                                                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => handleUpdateStatus(teacher._id, 'active')}>
                                                                    Activate
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="students" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Student Directory</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {students.length === 0 ? (
                                            <div className="p-8 text-center text-muted-foreground">No students enrolled yet.</div>
                                        ) : (
                                            <div className="divide-y">
                                                {students.map((student) => (
                                                    <div key={student._id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground font-bold">
                                                                {student.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium">{student.name}</h4>
                                                                <p className="text-sm text-muted-foreground">{student.email}</p>
                                                                <div className="flex gap-2 mt-1">
                                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                        {student.status}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">Joined: {new Date(student.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                    </div>
                </main>
            </div>
        </div>
    )
}
