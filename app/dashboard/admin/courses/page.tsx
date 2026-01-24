"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, BookOpen, Clock, Users, Star, History, Settings2 } from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/admin", icon: "🏠" },
    { title: "Users", href: "/dashboard/admin/users", icon: "👥" },
    { title: "Courses", href: "/dashboard/admin/courses", icon: "📚" },
    { title: "Reports", href: "/dashboard/admin/reports", icon: "📊" },
    { title: "Analytics", href: "/dashboard/admin/analytics", icon: "📈" },
]

// Mock data replaced by database integration

export default function AdminCoursesPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [courses, setCourses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCourse, setSelectedCourse] = useState<any>(null)
    const [isAuditOpen, setIsAuditOpen] = useState(false)
    const [isRulesOpen, setIsRulesOpen] = useState(false)

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/courses')
            const result = await res.json()
            if (result.success) {
                setCourses(result.data)
            }
        } catch (error) {
            toast.error("Failed to sync curriculum vault")
        } finally {
            setIsLoading(false)
        }
    }

    const openAudit = (course: any) => {
        setSelectedCourse(course)
        setIsAuditOpen(true)
    }

    const openRules = (course: any) => {
        setSelectedCourse(course)
        setIsRulesOpen(true)
    }

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden lg:flex flex-col w-72 border-r border-border/40 bg-sidebar/30 backdrop-blur-xl">
                <div className="flex items-center justify-center py-8 border-b border-sidebar-border/40 group cursor-pointer" onClick={() => router.push("/")}>
                    <img src="/logo.png" alt="Orbit" className="w-28 h-28 object-contain" />
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav userName={session?.user?.name || "Admin"} userRole="Administrator" onLogout={() => router.push("/login")} />

                <main className="flex-1 overflow-auto bg-muted/20">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Global Courses</h1>
                                <p className="text-muted-foreground">Monitor and audit all courses across the platform</p>
                            </div>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" /> Create New Course
                            </Button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="Search courses..." className="pl-9" />
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Filter className="w-4 h-4" /> Filter
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading ? (
                                <div className="col-span-full py-20 text-center animate-pulse">
                                    <div className="text-4xl mb-4">📚</div>
                                    <p className="text-muted-foreground font-black tracking-widest uppercase text-xs">Synchronizing Academic Records...</p>
                                </div>
                            ) : courses.map((course) => (
                                <Card
                                    key={course._id}
                                    className="group hover:border-primary/50 transition-all cursor-pointer"
                                    onClick={() => router.push(`/dashboard/admin/courses/${course._id}`)}
                                >
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline">{course.category}</Badge>
                                            <Badge
                                                variant={course.status === "published" ? "default" : "secondary"}
                                                className={course.status === "published" ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}
                                            >
                                                {course.status}
                                            </Badge>
                                        </div>
                                        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                        <CardDescription>Created on {course.created}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Users className="w-4 h-4" />
                                                <span>{course.students?.length || 0} Students</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span>{course.rating} Rating</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <div className="p-4 border-t flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            variant="outline"
                                            className="flex-1 text-xs rounded-xl font-bold border-border/40 hover:bg-primary/5 hover:text-primary transition-all"
                                            onClick={() => openAudit(course)}
                                        >
                                            Audit Logs
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 text-xs rounded-xl font-bold border-border/40 hover:bg-primary/5 hover:text-primary transition-all"
                                            onClick={() => openRules(course)}
                                        >
                                            Edit Rules
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Audit Logs Dialog */}
            <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
                <DialogContent className="rounded-[2.5rem] border-border/40 bg-card/95 backdrop-blur-3xl max-w-2xl">
                    <DialogHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                            <History className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tight">Access Audit History</DialogTitle>
                        <DialogDescription className="text-base font-medium">Viewing institutional modifications for <span className="text-foreground font-bold">{selectedCourse?.title}</span>.</DialogDescription>
                    </DialogHeader>
                    <div className="py-8 space-y-6 flex flex-col items-center justify-center text-center text-muted-foreground">
                        <History className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium">No audit logs found</p>
                        <p className="text-xs max-w-xs mx-auto">Audit logging will monitor changes to this course once active interactions begin.</p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Rules Dialog */}
            <Dialog open={isRulesOpen} onOpenChange={setIsRulesOpen}>
                <DialogContent className="rounded-[2.5rem] border-border/40 bg-card/95 backdrop-blur-3xl">
                    <DialogHeader>
                        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-4">
                            <Settings2 className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tight">System Compliance</DialogTitle>
                        <DialogDescription className="text-base font-medium">Configure institutional constraints for this course template.</DialogDescription>
                    </DialogHeader>
                    <div className="py-8 space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Academic Rules</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-5 rounded-2xl bg-muted/20 border border-border/40">
                                    <span className="text-sm font-bold">Mandatory Attendance</span>
                                    <div className="w-10 h-6 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                                </div>
                                <div className="flex items-center justify-between p-5 rounded-2xl bg-muted/20 border border-border/40">
                                    <span className="text-sm font-bold">Proctored Examinations</span>
                                    <div className="w-10 h-6 bg-muted-foreground/20 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full h-14 rounded-2xl font-black bg-primary text-primary-foreground shadow-lg" onClick={() => {
                            setIsRulesOpen(false)
                            toast.success("Policies Applied", { description: "Institutional constraints have been synchronized." })
                        }}>Synchronize Rules</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
