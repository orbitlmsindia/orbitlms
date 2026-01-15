"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  status: "active" | "draft" | "archived"
}

interface StudentProgress {
  id: string
  name: string
  course: string
  progress: number
  lastActive: string
  status: "active" | "inactive"
}

const mockCourses: Course[] = [
  { id: "1", title: "Web Development Basics", students: 45, lessons: 12, progress: 100, status: "active" },
  { id: "2", title: "Advanced React Patterns", students: 32, lessons: 8, progress: 75, status: "active" },
  { id: "3", title: "Backend with Node.js", students: 28, lessons: 15, progress: 50, status: "draft" },
]

const studentProgress: StudentProgress[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    course: "Web Development Basics",
    progress: 85,
    lastActive: "Today",
    status: "active",
  },
  {
    id: "2",
    name: "James Wilson",
    course: "Web Development Basics",
    progress: 65,
    lastActive: "2 days ago",
    status: "inactive",
  },
  { id: "3", name: "Emily Chen", course: "Advanced React", progress: 92, lastActive: "Today", status: "active" },
  {
    id: "4",
    name: "Michael Brown",
    course: "Advanced React",
    progress: 45,
    lastActive: "1 week ago",
    status: "inactive",
  },
]

export default function TeacherDashboard() {
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: "", description: "" })

  const totalStudents = mockCourses.reduce((sum, course) => sum + course.students, 0)
  const totalLessons = mockCourses.reduce((sum, course) => sum + course.lessons, 0)
  const avgProgress = Math.round(mockCourses.reduce((sum, course) => sum + course.progress, 0) / mockCourses.length)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar">
        <div className="flex items-center gap-2 px-4 py-6 border-b border-sidebar-border">
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

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, Dr. Johnson!</h1>
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
                    <Button
                      onClick={() => {
                        setIsCreateDialogOpen(false)
                        setNewCourse({ title: "", description: "" })
                      }}
                    >
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
                    <div className="text-3xl font-bold text-primary mb-2">{mockCourses.length}</div>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">{totalStudents}</div>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">{totalLessons}</div>
                    <p className="text-sm text-muted-foreground">Lessons</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{avgProgress}%</div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockCourses.map((course) => (
                    <Card key={course.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{course.title}</CardTitle>
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
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Progress Overview</CardTitle>
                    <CardDescription>Track how your students are progressing through their courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studentProgress.map((student) => (
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
                      ))}
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
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
