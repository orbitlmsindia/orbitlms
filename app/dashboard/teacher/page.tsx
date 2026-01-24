"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"


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
  students: number
  lessons: number
  progress: number
  status: "active" | "draft" | "archived" | "published"
}

interface StudentProgress {
  id: string
  name: string
  course: string
  progress: number
  lastActive: string
  status: "active" | "inactive"
}

export default function TeacherDashboard() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: "", description: "" })
  const [courses, setCourses] = useState<Course[]>([])
  const [recentStudents, setRecentStudents] = useState<StudentProgress[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    if (!session?.user) return

    setLoading(true)
    try {
      // 1. Fetch Courses (Single Source of Truth)
      const coursesRes = await fetch('/api/courses')
      const coursesData = await coursesRes.json()

      if (coursesData.success) {
        const mappedCourses = coursesData.data.map((c: any) => ({
          id: c._id,
          title: c.title,
          students: c.students?.length || 0,
          lessons: c.chapters?.reduce((acc: number, ch: any) => acc + (ch.lessons?.length || 0), 0) || 0,
          progress: 0, // Calculate real progress if possible, else 0 or average
          status: c.status === 'published' ? 'active' : (c.status || 'draft')
        }))
        setCourses(mappedCourses)
      } else {
        toast.error("Failed to load courses")
      }

      // 2. Fetch Students
      const usersRes = await fetch('/api/users?role=student')
      const usersData = await usersRes.json()
      if (usersData.success) {
        const mappedStudents = usersData.data.slice(0, 5).map((u: any) => ({
          id: u._id,
          name: u.name,
          course: "Web Development", // This needs real enrollment data linkage
          progress: Math.floor(Math.random() * 100), // Placeholder until real progress API
          lastActive: "Today",
          status: "active"
        }))
        setRecentStudents(mappedStudents)
      }

    } catch (e) {
      console.error("Dashboard fetch error:", e)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [session])

  const handleCreateCourse = async () => {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      })
      const data = await res.json()

      if (data.success) {
        toast.success("Course created successfully!")
        setIsCreateDialogOpen(false)
        setNewCourse({ title: "", description: "" })
        fetchDashboardData() // Refresh list
        router.push(`/dashboard/teacher/courses/create?id=${data.data._id}`)
      } else {
        toast.error(data.error || "Failed to create course")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }


  // Dynamic Stats Calculation
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
  const totalLessons = courses.reduce((sum, course) => sum + course.lessons, 0)
  // Avoid division by zero
  const avgProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)
    : 0

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

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {session?.user?.name || "Teacher"}!</h1>
                <p className="text-muted-foreground">Manage your courses and track student progress</p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Create New Course</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>Add a new course to your teaching portfolio</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Course Title</label>
                      <Input
                        placeholder="e.g., Introduction to Machine Learning"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Description</label>
                      <Textarea
                        placeholder="Brief description of your course"
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCourse}>
                      Create Course
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{loading ? "-" : courses.length}</div>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">{loading ? "-" : totalStudents}</div>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">{loading ? "-" : totalLessons}</div>
                    <p className="text-sm text-muted-foreground">Lessons</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{loading ? "-" : avgProgress}%</div>
                    <p className="text-sm text-muted-foreground">Avg Progress</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="courses" className="space-y-4">
              <TabsList>
                <TabsTrigger value="courses">My Courses</TabsTrigger>
                <TabsTrigger value="progress">Student Progress</TabsTrigger>
                <TabsTrigger value="assessments">Assessments</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-4">
                {courses.length === 0 && !loading ? (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                    No courses found. Create one to get started!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <Card key={course.id} className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => router.push(`/dashboard/teacher/courses/create?id=${course.id}`)}>
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div className="flex-1">
                              <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${course.status === "active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : course.status === "draft"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                                }`}
                            >
                              {course.status}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div>
                              <div className="text-lg font-semibold text-primary">{course.students}</div>
                              <p className="text-xs text-muted-foreground">Students</p>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-secondary">{course.lessons}</div>
                              <p className="text-xs text-muted-foreground">Lessons</p>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-accent">{course.progress}%</div>
                              <p className="text-xs text-muted-foreground">Done</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }} />
                            </div>
                          </div>

                          <div className="flex gap-2 group-hover:opacity-100 opacity-0 transition">
                            <Button size="sm" className="flex-1 text-xs bg-transparent" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" className="flex-1 text-xs">
                              Manage
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Progress Overview</CardTitle>
                    <CardDescription>Track how your students are progressing through their courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentStudents.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No students found in your institute.</p>
                      ) : (
                        recentStudents.map((student) => (
                          <div
                            key={student.id}
                            className="p-4 rounded-lg border border-border hover:border-primary/50 transition"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-foreground">{student.name}</h4>
                                <p className="text-sm text-muted-foreground">{student.course}</p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === "active"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  }`}
                              >
                                {student.status}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold text-foreground">{student.progress}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${student.progress}%` }} />
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">Last active: {student.lastActive}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assessments" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Manage Assessments</CardTitle>
                      <CardDescription>Create and manage quizzes, assignments, and exams</CardDescription>
                    </div>
                    <Button size="sm">Create Assessment</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { title: "Module 1 Quiz", type: "MCQ", submissions: 42, avgScore: 78 },
                        { title: "Project Assignment", type: "Coding", submissions: 38, avgScore: 82 },
                        { title: "Midterm Exam", type: "Mixed", submissions: 45, avgScore: 75 },
                      ].map((assessment, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border hover:border-primary/50 transition">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-foreground">{assessment.title}</h4>
                              <p className="text-sm text-muted-foreground">{assessment.type}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              View Results
                            </Button>
                          </div>
                          <div className="flex gap-6 text-sm mt-3">
                            <div>
                              <span className="text-muted-foreground">Submissions:</span>
                              <span className="ml-2 font-semibold text-foreground">{assessment.submissions}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Avg Score:</span>
                              <span className="ml-2 font-semibold text-foreground">{assessment.avgScore}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs >
          </div >
        </main >
      </div >
    </div >
  )
}
