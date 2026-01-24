"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreVertical, Edit, Trash, Eye, FileText, Users, BarChart3, Upload } from "lucide-react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

export default function CoursesPage() {
    const router = useRouter()

    const { data: session } = useSession()
    const [searchQuery, setSearchQuery] = useState("")
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null)

    useEffect(() => {
        const fetchCourses = async () => {
            if (!session?.user) return
            try {
                const res = await fetch('/api/courses')
                const data = await res.json()
                if (data.success) {
                    const mappedCourses = data.data.map((c: any) => ({
                        id: c._id,
                        title: c.title,
                        category: c.category || 'General',
                        level: c.level || 'Beginner',
                        lessons: c.chapters?.reduce((acc: number, ch: any) => acc + (ch.lessons?.length || 0), 0) || 0,
                        students: c.students?.length || 0,
                        status: c.status || 'draft',
                        lastUpdated: new Date(c.updatedAt).toLocaleDateString(),
                        thumbnail: c.image || (c.category === 'Web Development' ? "🌐" : "📚"), // Fallback icon
                    }))
                    setCourses(mappedCourses)
                }
            } catch (error) {
                console.error("Failed to fetch courses", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCourses()
    }, [session])

    const handlePublish = async (courseId: string) => {
        try {
            const res = await fetch(`/api/courses/${courseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'published' })
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Course published successfully")
                setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: 'published' } : c))
            } else {
                toast.error(data.error || "Failed to publish")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    const handleDelete = async () => {
        if (!deleteCourseId) return

        try {
            const res = await fetch(`/api/courses/${deleteCourseId}`, {
                method: 'DELETE',
            })
            const data = await res.json()

            if (data.success) {
                toast.success("Course deleted successfully")
                setCourses(prev => prev.filter(c => c.id !== deleteCourseId))
            } else {
                toast.error(data.error || "Failed to delete course")
            }
        } catch (error) {
            toast.error("Failed to delete course")
        } finally {
            setDeleteCourseId(null)
        }
    }

    const filteredCourses = courses.filter((course) =>
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
                    userName={session?.user?.name || "Teacher"}
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
                                                    {course.status === 'draft' && (
                                                        <DropdownMenuItem onClick={() => handlePublish(course.id)}>
                                                            <Upload className="mr-2 h-4 w-4" /> Publish
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/teacher/courses/preview/${course.id}`)}>
                                                        <Eye className="mr-2 h-4 w-4" /> Preview
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => setDeleteCourseId(course.id)}
                                                    >
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

            <AlertDialog open={!!deleteCourseId} onOpenChange={(open) => !open && setDeleteCourseId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the course
                            and remove all student enrollments associated with it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
