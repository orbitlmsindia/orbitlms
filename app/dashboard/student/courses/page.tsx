"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"



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
  youtubeUrl: string
}

// Static data removed as we are fetching from API


export default function CoursesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [courses, setCourses] = useState<any[]>([])
  const [availableCourses, setAvailableCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [pendingQuizCount, setPendingQuizCount] = useState<number | undefined>(undefined)

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
    { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
    { title: "Assignments", href: "/dashboard/student/assignments", icon: "📋" },
    { title: "Quizzes", href: "/dashboard/student/assessments", icon: "✍️", badge: pendingQuizCount },
    { title: "Gamification", href: "/dashboard/student/gamification", icon: "🎮" },
    { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },
  ]

  const fetchEnrolledCourses = async () => {
    if (!session?.user) return
    try {
      const userId = (session.user as any).id
      // Fetch Enrollments and Dashboard Stats (for sidebar badge)
      const [res, dashboardRes] = await Promise.all([
        fetch(`/api/enrollments?studentId=${userId}`),
        fetch(`/api/student/${userId}/dashboard`)
      ])

      const data = await res.json()
      const dashboardResult = await dashboardRes.json()

      if (dashboardResult.success && dashboardResult.data?.stats) {
        setPendingQuizCount(dashboardResult.data.stats.pendingQuizzesCount || undefined);
      }

      if (data.success) {
        const mappedCourses = data.data
          .filter((enrollment: any) => enrollment.course) // Safety check for deleted courses
          .map((enrollment: any) => ({
            id: enrollment.course._id,
            title: enrollment.course.title,
            instructor: enrollment.course.instructor?.name || "Unknown Instructor",
            category: enrollment.course.category || "General",
            image: enrollment.course.image || "📚",
            progress: enrollment.progress || 0,
            enrolledAt: enrollment.enrolledAt,
            enrolled: true
          }))
        setCourses(mappedCourses)
      }
    } catch (error) {
      console.error("Failed to fetch enrolled courses", error)
    }
  }

  const fetchAvailableCourses = async () => {
    try {
      const res = await fetch('/api/courses')
      const data = await res.json()
      if (data.success) {
        // Map API response to Component Interface
        const mapped = data.data.map((c: any) => ({
          _id: c._id,
          title: c.title,
          category: c.category || "General",
          instructor: c.instructor?.name || "Unknown",
          image: c.image || "📚", // Default icon if image missing
          level: c.level || "Beginner", // Default level
          rating: c.rating || 0,
          students: c.students?.length || 0,
        }))
        setAvailableCourses(mapped)
      }
    } catch (error) {
      console.error("Failed to fetch available courses")
    }
  }

  const handleEnroll = async (courseId: string) => {
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Enrolled successfully!")
        fetchEnrolledCourses()
        // Optional: move to enrolled tab
      } else {
        toast.error(data.error || "Enrollment failed")
      }
    } catch (error) {
      toast.error("Enrollment failed")
    }
  }

  const [activeTab, setActiveTab] = useState("enrolled")

  // ... (inside fetch logic)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([fetchEnrolledCourses(), fetchAvailableCourses()])
      setLoading(false)
    }
    if (session?.user) {
      init()
    }
  }, [session?.user])

  // Effect to auto-switch tab if no enrolled courses but available courses exist
  useEffect(() => {
    if (!loading && courses.length === 0 && availableCourses.length > 0) {
      setActiveTab("explore")
    }
  }, [loading, courses.length, availableCourses.length])

  const filteredEnrolled = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAvailable = availableCourses.filter((course) =>
    (course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !courses.some(c => c.id === course._id) // Exclude enrolled
  )

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
          userName={session?.user?.name || "Student"}
          userRole="Student"
          onLogout={() => {
            router.push("/login")
          }}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Institute Check */}
            {session?.user && !(session.user as any).instituteId && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration Error</AlertTitle>
                <AlertDescription>
                  Your account is not associated with any institute. You will not see any courses.
                </AlertDescription>
              </Alert>
            )}

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">My Courses</h1>
              <p className="text-muted-foreground">Browse and manage your enrolled courses</p>
            </div>

            {/* Search */}
            <div className="mb-8 space-y-4">
              <Input
                placeholder="Search your courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md"
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-48 bg-muted/20 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                  <TabsTrigger value="enrolled">My Courses</TabsTrigger>
                  <TabsTrigger value="explore">Explore Courses</TabsTrigger>
                </TabsList>

                <TabsContent value="enrolled">
                  {filteredEnrolled.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-xl bg-card">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="text-4xl">📚</div>
                        <h3 className="text-lg font-semibold">No courses yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                          You haven't enrolled in any courses yet. Check out the available courses to get started!
                        </p>
                        <Button
                          variant="default"
                          onClick={() => setActiveTab("explore")}
                          className="mt-4"
                        >
                          Browse Available Courses
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEnrolled.map((course) => (
                        <Card
                          key={course.id}
                          className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
                          onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}
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
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold text-foreground">{course.progress}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }} />
                              </div>
                            </div>

                            <Button className="w-full bg-transparent" variant="outline">
                              Continue Learning
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="explore">
                  {filteredAvailable.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-xl">
                      <p className="text-muted-foreground">No new courses available.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAvailable.map((course) => (
                        <Card
                          key={course._id}
                          className="overflow-hidden hover:border-primary/50 transition-all group"
                        >
                          <CardHeader className="pb-3">
                            <div className="text-5xl mb-3 group-hover:scale-110 transition">{course.image || '📚'}</div>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            {course.instructor && <CardDescription>{course.instructor.name}</CardDescription>}
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">
                                {course.category || "General"}
                              </span>
                            </div>

                            <Button className="w-full" onClick={() => handleEnroll(course._id)}>
                              Enroll Now
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div >
        </main >
      </div >
    </div >
  )
}
