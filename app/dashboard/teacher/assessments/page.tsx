"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Calendar, Clock, FileText, CheckCircle, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/teacher", icon: "🏠" },
    { title: "My Courses", href: "/dashboard/teacher/courses", icon: "📚" },
    { title: "Assessments", href: "/dashboard/teacher/assessments", icon: "✍️" },
    { title: "Student Progress", href: "/dashboard/teacher/progress", icon: "📊" },
    { title: "Attendance", href: "/dashboard/teacher/attendance", icon: "📋" },
    { title: "Reports", href: "/dashboard/teacher/reports", icon: "📈" },
]

interface Assessment {
    id: string
    title: string
    subject: string
    type: "MCQ" | "Subjective" | "Coding" | "Mixed"
    dueDate: string
    submissions: number
    totalStudents: number
    status: "Draft" | "Published" | "Closed"
}

const mockAssessments: Assessment[] = [
    {
        id: "1",
        title: "Web Development Basics Quiz",
        subject: "Web Development",
        type: "MCQ",
        dueDate: "2024-03-10",
        submissions: 42,
        totalStudents: 45,
        status: "Published",
    },
    {
        id: "2",
        title: "React Component Lifecycle",
        subject: "Advanced React",
        type: "Subjective",
        dueDate: "2024-03-15",
        submissions: 15,
        totalStudents: 32,
        status: "Published",
    },
    {
        id: "3",
        title: "Build a REST API",
        subject: "Backend Development",
        type: "Coding",
        dueDate: "2024-03-20",
        submissions: 0,
        totalStudents: 28,
        status: "Draft",
    },
]

export default function TeacherAssessmentsPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Published": return "bg-green-100 text-green-700 border-green-200"
            case "Draft": return "bg-yellow-100 text-yellow-700 border-yellow-200"
            case "Closed": return "bg-gray-100 text-gray-700 border-gray-200"
            default: return "bg-muted text-muted-foreground"
        }
    }

    const filteredAssessments = mockAssessments.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar">
                <div className="flex items-center gap-2 px-4 py-6 border-b border-sidebar-border">
                    <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold">
                        E
                    </div>
                    <span className="text-lg font-bold text-sidebar-foreground">EduHub</span>
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav userName="Dr. Sarah Johnson" userRole="Teacher" onLogout={() => router.push("/login")} />

                <main className="flex-1 overflow-auto bg-muted/20">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Assessments</h1>
                                <p className="text-muted-foreground">Manage quizzes, assignments, and exams</p>
                            </div>
                            <Button onClick={() => router.push("/dashboard/teacher/assessments/create")}>
                                <Plus className="w-4 h-4 mr-2" /> Create Assessment
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search assessments..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAssessments.map((assessment) => (
                                <Card key={assessment.id} className="group hover:border-primary/50 transition-all cursor-pointer" onClick={() => router.push(`/dashboard/teacher/assessments/${assessment.id}`)}>
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className={getStatusColor(assessment.status)}>
                                                {assessment.status}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/teacher/assessments/create?id=${assessment.id}`) }}>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <CardTitle className="line-clamp-1 text-lg">{assessment.title}</CardTitle>
                                        <CardDescription>{assessment.subject}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span>Due: {assessment.dueDate}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <span>{assessment.type}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Submissions</span>
                                                <span className="font-medium">{assessment.submissions} / {assessment.totalStudents}</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${(assessment.submissions / assessment.totalStudents) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t pt-4">
                                        <Button variant="outline" className="w-full">Review Submissions</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
