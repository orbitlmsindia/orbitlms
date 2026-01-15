"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
  { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
  { title: "Assignments", href: "/dashboard/student/assignments", icon: "📋" },
  { title: "Assessments", href: "/dashboard/student/assessments", icon: "✍️", badge: 3 },
  { title: "AI Assistant", href: "/dashboard/student/ai-assistant", icon: "🤖" },
  { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },
  { title: "Certificates", href: "/dashboard/student/certificates", icon: "🏆" },
]

interface Course {
  id: string
  title: string
  instructor: string
  progress: number
  image: string
  enrolled: string
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    instructor: "Dr. Sarah Johnson",
    progress: 75,
    image: "🌐",
    enrolled: "2024-01-15",
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    instructor: "Prof. Mike Chen",
    progress: 45,
    image: "⚡",
    enrolled: "2024-02-01",
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    instructor: "Emily Rodriguez",
    progress: 60,
    image: "🎨",
    enrolled: "2024-01-20",
  },
  {
    id: "4",
    title: "Data Science Fundamentals",
    instructor: "Dr. James Wilson",
    progress: 30,
    image: "📈",
    enrolled: "2024-02-10",
  },
]

interface Announcement {
  id: string
  title: string
  message: string
  date: string
  priority: "high" | "normal"
}

const announcements: Announcement[] = [
  {
    id: "1",
    title: "Final Exam Scheduled",
    message: "The final exam for Web Development will be held on March 15, 2024",
    date: "2024-02-20",
    priority: "high",
  },
  {
    id: "2",
    title: "Course Materials Updated",
    message: "New lecture notes for Chapter 5 are now available in the course materials",
    date: "2024-02-19",
    priority: "normal",
  },
  {
    id: "3",
    title: "Assignment Submission Extended",
    message: "The deadline for Assignment 3 has been extended to March 10",
    date: "2024-02-18",
    priority: "normal",
  },
]

export default function StudentDashboard() {
  const router = useRouter()
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)

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
          userName="Alex Johnson"
          userRole="Student"
          onLogout={() => {
            router.push("/login")
          }}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Alex!</h1>
              <p className="text-muted-foreground">Track your progress and continue learning</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">4</div>
                    <p className="text-sm text-muted-foreground">Active Courses</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">52%</div>
                    <p className="text-sm text-muted-foreground">Avg Progress</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">12</div>
                    <p className="text-sm text-muted-foreground">Certificates</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">3</div>
                    <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Enrolled Courses */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
                    <Button variant="outline" onClick={() => router.push("/dashboard/student/courses")}>
                      View All
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {mockCourses.map((course) => (
                      <Card
                        key={course.id}
                        className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                        onMouseEnter={() => setHoveredCourse(course.id)}
                        onMouseLeave={() => setHoveredCourse(null)}
                        onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{course.title}</CardTitle>
                              <CardDescription>{course.instructor}</CardDescription>
                            </div>
                            <div className="text-4xl">{course.image}</div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold text-foreground">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Enrolled {course.enrolled}</p>
                          {hoveredCourse === course.id && (
                            <Button size="sm" className="w-full bg-transparent" variant="outline">
                              Continue Learning
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Upcoming Assessments */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Upcoming Assessments</h2>
                  <div className="space-y-3">
                    {[
                      { title: "Module 5 Quiz", course: "Web Development", date: "Mar 10, 2024" },
                      { title: "Project Submission", course: "JavaScript", date: "Mar 12, 2024" },
                      { title: "Midterm Exam", course: "UI/UX Design", date: "Mar 15, 2024" },
                    ].map((assessment, i) => (
                      <Card key={i} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{assessment.title}</h4>
                            <p className="text-sm text-muted-foreground">{assessment.course}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">{assessment.date}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push("/dashboard/student/assessments")}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="announcements" className="space-y-4">
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <Card
                      key={announcement.id}
                      className={announcement.priority === "high" ? "border-destructive/50 bg-destructive/5" : ""}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-base">{announcement.title}</CardTitle>
                            <CardDescription className="mt-2">{announcement.message}</CardDescription>
                          </div>
                          {announcement.priority === "high" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-destructive/20 text-destructive whitespace-nowrap">
                              High Priority
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">{announcement.date}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
