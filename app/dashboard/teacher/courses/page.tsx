"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreVertical, Edit, Trash, Eye, FileText, Users, BarChart3, Upload } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/teacher", icon: "🏠" },
    { title: "My Courses", href: "/dashboard/teacher/courses", icon: "📚" },
    { title: "Assessments", href: "/dashboard/teacher/assessments", icon: "✍️" },
    { title: "Student Progress", href: "/dashboard/teacher/progress", icon: "📊" },
    { title: "Attendance", href: "/dashboard/teacher/attendance", icon: "📋" },
    { title: "Reports", href: "/dashboard/teacher/reports", icon: "📈" },
]

interface Course {
    id: string
    title: string
    category: string
    level: string
    lessons: number
    students: number
    status: "published" | "draft" | "archived"
    lastUpdated: string
    thumbnail: string
}

const mockCourses: Course[] = [
    {
        id: "1",
        title: "Web Development Basics",
        category: "Web Development",
        level: "Beginner",
        lessons: 12,
        students: 45,
        status: "published",
        lastUpdated: "2024-03-01",
        thumbnail: "🌐",
    },
    {
        id: "2",
        title: "Advanced React Patterns",
        category: "Programming",
        level: "Advanced",
        lessons: 8,
        students: 32,
        status: "published",
        lastUpdated: "2024-02-25",
        thumbnail: "⚛️",
    },
    {
        id: "3",
        title: "Backend with Node.js",
        category: "Backend",
        level: "Intermediate",
        lessons: 15,
        students: 0,
        status: "draft",
        lastUpdated: "2024-03-05",
        thumbnail: "🟢",
    },
]

export default function CoursesPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredCourses = mockCourses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusColor = (status: Course["status"]) => {
        switch (status) {
            case "published": return "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200"
            case "draft": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 border-yellow-200"
            case "archived": return "bg-gray-100 text-gray-700 hover:bg-gray-100/80 border-gray-200"
            default: return "bg-gray-100 text-gray-700"
        }
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar">
                <div className="flex items-center gap-2 px-4 py-6 border-b border-sidebar-border">
                    <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold">
                        E
                    </div>
                    <span className="text-lg font-bold text-sidebar-foreground">EduHub</span>
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
                    userName="Dr. Sarah Johnson"
                    userRole="Teacher"
                    onLogout={() => {
                        router.push("/login")
                    }}
                />

                <main className="flex-1 overflow-auto bg-muted/20">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">My Courses</h1>
                                <p className="text-muted-foreground">Manage your curriculum and learning materials</p>
                            </div>
                            <Button onClick={() => router.push("/dashboard/teacher/courses/create")}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Course
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search courses..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => (
                                <Card key={course.id} className="group hover:border-primary/50 transition-all">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-4xl p-2 bg-muted rounded-lg">{course.thumbnail}</div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/teacher/courses/create?id=${course.id}`)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" /> Preview
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="font-normal text-xs">{course.category}</Badge>
                                            <span className="text-xs text-muted-foreground">• {course.level}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-3">
                                        <div className="grid grid-cols-3 gap-2 text-sm text-center py-2 bg-muted/30 rounded-lg">
                                            <div className="space-y-1">
                                                <p className="font-semibold">{course.lessons}</p>
                                                <p className="text-xs text-muted-foreground flex justify-center items-center gap-1"><FileText className="w-3 h-3" /> Lessons</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold">{course.students}</p>
                                                <p className="text-xs text-muted-foreground flex justify-center items-center gap-1"><Users className="w-3 h-3" /> Students</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-green-600">4.8</p>
                                                <p className="text-xs text-muted-foreground flex justify-center items-center gap-1"><BarChart3 className="w-3 h-3" /> Rating</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between items-center pt-3 border-t">
                                        <Badge variant="outline" className={getStatusColor(course.status)}>
                                            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">Updated: {course.lastUpdated}</span>
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
