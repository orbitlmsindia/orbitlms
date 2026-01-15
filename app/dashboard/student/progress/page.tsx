"use client"

import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
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

interface CourseProgress {
  courseId: string
  courseName: string
  progress: number
  lessonsCompleted: number
  totalLessons: number
  lastAccessed: string
  assessmentScore: number
}

const courseProgressData: CourseProgress[] = [
  {
    courseId: "1",
    courseName: "Web Development Basics",
    progress: 75,
    lessonsCompleted: 9,
    totalLessons: 12,
    lastAccessed: "Today",
    assessmentScore: 92,
  },
  {
    courseId: "2",
    courseName: "Advanced React",
    progress: 45,
    lessonsCompleted: 9,
    totalLessons: 20,
    lastAccessed: "2 days ago",
    assessmentScore: 88,
  },
  {
    courseId: "3",
    courseName: "UI/UX Design",
    progress: 60,
    lessonsCompleted: 6,
    totalLessons: 10,
    lastAccessed: "3 days ago",
    assessmentScore: 85,
  },
]

export default function ProgressPage() {
  const router = useRouter()

  const overallProgress = Math.round(
    courseProgressData.reduce((sum, c) => sum + c.progress, 0) / courseProgressData.length,
  )

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
              <h1 className="text-3xl font-bold text-foreground mb-2">Learning Progress</h1>
              <p className="text-muted-foreground">Track your learning journey across all courses</p>
            </div>

            {/* Overall Progress */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">{overallProgress}%</div>
                    <p className="text-muted-foreground">Completed across {courseProgressData.length} courses</p>
                  </div>
                  <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{overallProgress}%</div>
                      <p className="text-xs text-muted-foreground mt-1">progress</p>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: `${overallProgress}%` }} />
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="courses" className="space-y-4">
              <TabsList>
                <TabsTrigger value="courses">Course Progress</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-4">
                {courseProgressData.map((course) => (
                  <Card key={course.courseId} className="overflow-hidden hover:border-primary/50 transition">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{course.courseName}</CardTitle>
                          <CardDescription>
                            {course.lessonsCompleted} of {course.totalLessons} lessons completed
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{course.progress}%</div>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }} />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-muted-foreground text-xs">Last Accessed</p>
                          <p className="font-semibold text-foreground">{course.lastAccessed}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-muted-foreground text-xs">Assessment Score</p>
                          <p className="font-semibold text-foreground">{course.assessmentScore}%</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-muted-foreground text-xs">Time Spent</p>
                          <p className="font-semibold text-foreground">24h 30m</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Acquired</CardTitle>
                    <CardDescription>Skills you have developed through your learning journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        "HTML",
                        "CSS",
                        "JavaScript",
                        "React",
                        "Node.js",
                        "Database Design",
                        "API Design",
                        "UI Design",
                        "Problem Solving",
                      ].map((skill, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition text-center"
                        >
                          <p className="font-medium text-foreground">{skill}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements & Badges</CardTitle>
                    <CardDescription>Your accomplishments and earned badges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { emoji: "🌟", title: "Quick Learner", desc: "Complete a course in 2 weeks" },
                        { emoji: "🔥", title: "On Fire", desc: "7-day streak" },
                        { emoji: "🎯", title: "Perfect Score", desc: "100% on an assessment" },
                        { emoji: "⭐", title: "Star Student", desc: "Complete 3 courses" },
                      ].map((badge, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-lg border border-border bg-card text-center hover:border-primary/50 transition"
                        >
                          <div className="text-3xl mb-2">{badge.emoji}</div>
                          <h4 className="font-semibold text-foreground text-sm">{badge.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{badge.desc}</p>
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
