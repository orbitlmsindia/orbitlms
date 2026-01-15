"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

interface CourseType {
  id: string
  title: string
  instructor: string
  category: string
  level: string
  students: number
  rating: number
  progress?: number
  enrolled: boolean
  image: string
}

const allCourses: CourseType[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    instructor: "Dr. Sarah Johnson",
    category: "Web Development",
    level: "Beginner",
    students: 1250,
    rating: 4.8,
    progress: 75,
    enrolled: true,
    image: "🌐",
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    instructor: "Prof. Mike Chen",
    category: "Programming",
    level: "Advanced",
    students: 450,
    rating: 4.9,
    progress: 45,
    enrolled: true,
    image: "⚡",
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    instructor: "Emily Rodriguez",
    category: "Design",
    level: "Intermediate",
    students: 890,
    rating: 4.7,
    progress: 60,
    enrolled: true,
    image: "🎨",
  },
  {
    id: "5",
    title: "Machine Learning Basics",
    instructor: "Dr. Priya Patel",
    category: "AI/ML",
    level: "Intermediate",
    students: 600,
    rating: 4.6,
    enrolled: false,
    image: "🧠",
  },
  {
    id: "6",
    title: "Cloud Computing with AWS",
    instructor: "Tom Harris",
    category: "Cloud",
    level: "Advanced",
    students: 400,
    rating: 4.8,
    enrolled: false,
    image: "☁️",
  },
  {
    id: "7",
    title: "Digital Marketing Fundamentals",
    instructor: "Lisa Anderson",
    category: "Marketing",
    level: "Beginner",
    students: 2100,
    rating: 4.5,
    enrolled: false,
    image: "📱",
  },
]

export default function CoursesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(allCourses.map((c) => c.category)))

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
          userName="Alex Johnson"
          userRole="Student"
          onLogout={() => {
            router.push("/login")
          }}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">My Courses</h1>
              <p className="text-muted-foreground">Browse and manage your enrolled courses</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />

              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Courses</TabsTrigger>
                  <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
                  <TabsTrigger value="available">Available</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <Card
                        key={course.id}
                        className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
                        onClick={() => router.push(`/courses/${course.id}`)}
                      >
                        <CardHeader className="pb-3">
                          <div className="text-5xl mb-3 group-hover:scale-110 transition">{course.image}</div>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <CardDescription>{course.instructor}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">
                              {course.category}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary font-medium">
                              {course.level}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{course.students} students</span>
                            <span>★ {course.rating}</span>
                          </div>

                          {course.progress && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold text-foreground">{course.progress}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }} />
                              </div>
                            </div>
                          )}

                          <Button className="w-full" variant={course.enrolled ? "outline" : "default"}>
                            {course.enrolled ? "Continue Learning" : "Enroll Now"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="enrolled" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses
                      .filter((c) => c.enrolled)
                      .map((course) => (
                        <Card
                          key={course.id}
                          className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
                        >
                          <CardHeader className="pb-3">
                            <div className="text-5xl mb-3 group-hover:scale-110 transition">{course.image}</div>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <CardDescription>{course.instructor}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">
                                {course.category}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary font-medium">
                                {course.level}
                              </span>
                            </div>

                            {course.progress && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-semibold text-foreground">{course.progress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${course.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            <Button className="w-full bg-transparent" variant="outline">
                              Continue Learning
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="available" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses
                      .filter((c) => !c.enrolled)
                      .map((course) => (
                        <Card
                          key={course.id}
                          className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
                        >
                          <CardHeader className="pb-3">
                            <div className="text-5xl mb-3 group-hover:scale-110 transition">{course.image}</div>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <CardDescription>{course.instructor}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">
                                {course.category}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary font-medium">
                                {course.level}
                              </span>
                            </div>

                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{course.students} students</span>
                              <span>★ {course.rating}</span>
                            </div>

                            <Button className="w-full">Enroll Now</Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
