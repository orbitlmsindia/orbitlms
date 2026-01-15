"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
    { title: "Settings", href: "/dashboard/admin/settings", icon: "⚙️" },
    { title: "Analytics", href: "/dashboard/admin/analytics", icon: "📈" },
]

const mockCourses = [
    { id: "1", title: "Web Development Basics", category: "Development", students: 120, rating: 4.8, status: "published", created: "2024-01-05" },
    { id: "2", title: "UX Design Fundamentals", category: "Design", students: 85, rating: 4.5, status: "draft", created: "2024-02-10" },
    { id: "3", title: "Data Science with Python", category: "Science", students: 250, rating: 4.9, status: "published", created: "2023-11-20" },
    { id: "4", title: "Marketing Strategy", category: "Business", students: 60, rating: 4.2, status: "published", created: "2024-01-15" },
]

export default function AdminCoursesPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCourse, setSelectedCourse] = useState<any>(null)
    const [isAuditOpen, setIsAuditOpen] = useState(false)
    const [isRulesOpen, setIsRulesOpen] = useState(false)

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
                <div className="flex items-center gap-4 px-10 py-12 border-b border-sidebar-border/40 group cursor-pointer" onClick={() => router.push("/")}>
                    <span className="text-2xl font-black tracking-tighter text-sidebar-foreground group-hover:text-primary transition-colors italic">EduHub</span>
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav userName="Admin User" userRole="Administrator" onLogout={() => router.push("/login")} />

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
                            {mockCourses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="group hover:border-primary/50 transition-all cursor-pointer"
                                    onClick={() => router.push(`/dashboard/admin/courses/${course.id}`)}
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
                                                <span>{course.students} Students</span>
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
                    <div className="py-8 space-y-6">
                        {[
                            { event: "Curriculum Updated", user: "Dr. Sarah Johnson", time: "2 hours ago", detail: "Added 3 new modules to Chapter 4" },
                            { event: "Access Revoked", user: "System Admin", time: "1 day ago", detail: "Course moved to draft status for review" },
                            { event: "Assessment Published", user: "Prof. James Wilson", time: "3 days ago", detail: "Final Exam MCQ set released" }
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4 p-5 rounded-[1.5rem] bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 animate-pulse"></div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-black text-sm">{log.event}</h4>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{log.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium mb-1">Modified by <span className="text-foreground font-bold">{log.user}</span></p>
                                    <p className="text-xs text-muted-foreground/80 italic">"{log.detail}"</p>
                                </div>
                            </div>
                        ))}
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
