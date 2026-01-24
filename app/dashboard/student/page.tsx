"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
  { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
  { title: "Assignments", href: "/dashboard/student/assignments", icon: "📋" },
  { title: "Quizzes", href: "/dashboard/student/assessments", icon: "✍️", badge: 3 },
  { title: "Gamification", href: "/dashboard/student/gamification", icon: "🎮" },
  { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },
]

interface DashboardData {
  profile: any
  stats: {
    activeCourses: number
    avgProgress: number
    pendingTasks: number
    attendancePercentage: number
    totalPoints: number
    rank: number
  }
  courses: any[]
  upcomingQuizzes: any[]
  gamification: {
    points: number
    badges: any[]
  }
}

export default function StudentDashboard() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const user = session?.user as any
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    // If we have a session but no ID, this is a problem
    if (!user?.id) {
      if (status === 'authenticated') {
        console.error("Session authenticated but no user ID found:", session)
        toast.error("User session invalid. Please login again.")
        setLoading(false)
      }
      return
    }

    try {
      setLoading(true)
      //console.log(`Fetching dashboard for user: ${user.id}`) // Reduced log spam
      const res = await fetch(`/api/student/${user.id}/dashboard`)

      if (res.status === 404) {
        console.error("Student profile not found (404). Redirecting to login.")
        toast.error("User profile not found. Please log in again.")
        router.push("/api/auth/signout") // Force signout/login
        return
      }

      const result = await res.json()

      if (result.success) {
        setData(result.data)

        // Sync session with fresh profile data if different
        if (result.data.profile?.image && result.data.profile.image !== user.image) {
          await update({
            ...session,
            user: {
              ...session?.user,
              image: result.data.profile.image
            }
          })
        }
      } else {
        console.error("Dashboard API Error:", result.error)
        toast.error(result.error || "Failed to fetch dashboard data")
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error)
      toast.error("An error occurred while fetching dashboard data")
    } finally {
      setLoading(false)
    }
  }, [user?.id, status, update, router]) // Removed session from dependencies

  useEffect(() => {
    // Only fetch if authenticated and we haven't fetched data yet (or if we really want to poll, but we don't here)
    if (status === "authenticated" && !data && user?.id) {
      fetchDashboardData()
    } else if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, user?.id, router]) // Logic adjusted to fetch only when needed

  if (loading || status === "loading") {
    return (
      <div className="flex h-screen bg-background text-foreground">
        <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar p-6 space-y-4">
          <Skeleton className="h-8 w-3/4 mb-4" />
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
        </aside>
        <div className="flex-1 p-8 space-y-8 overflow-auto">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
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
          userName={data?.profile?.name || session?.user?.name || "Student"}
          userRole="Student"
          userImage={data?.profile?.image}
          onLogout={() => {
            router.push("/login")
          }}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {data?.profile?.name?.split(' ')[0] || session?.user?.name?.split(' ')[0]}!</h1>
              <p className="text-muted-foreground">Track your progress and continue learning</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{data?.stats?.activeCourses || 0}</div>
                    <p className="text-sm text-muted-foreground">Active Courses</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">{data?.stats?.avgProgress || 0}%</div>
                    <p className="text-sm text-muted-foreground">Avg Progress</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">{data?.stats?.pendingTasks || 0}</div>
                    <p className="text-sm text-muted-foreground">Pending Quizzes</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-2">{data?.stats?.totalPoints || 0}</div>
                    <p className="text-sm text-muted-foreground">Points</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">#{data?.stats?.rank || 1}</div>
                    <p className="text-sm text-muted-foreground">Rank</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gamification">Gamification</TabsTrigger>
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

                  {data?.courses && data.courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      {data.courses.map((course) => (
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
                            <p className="text-xs text-muted-foreground">Enrolled {new Date(course.enrolled).toLocaleDateString()}</p>
                            {hoveredCourse === course.id && (
                              <Button size="sm" className="w-full bg-transparent" variant="outline">
                                Continue Learning
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-muted/20 rounded-xl border border-dashed border-border">
                      <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
                      <Button className="mt-4" onClick={() => router.push("/dashboard/student/courses")}>Explore Courses</Button>
                    </div>
                  )}
                </div>

                {/* Upcoming Quizzes */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Upcoming Quizzes</h2>
                  {data?.upcomingQuizzes && data.upcomingQuizzes.length > 0 ? (
                    <div className="space-y-3">
                      {data.upcomingQuizzes.map((quiz, i) => (
                        <Card key={i} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground">{quiz.title}</h4>
                              <p className="text-sm text-muted-foreground">{quiz.course}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-foreground">{quiz.date}</p>
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
                  ) : (
                    <div className="p-4 border border-dashed border-border rounded-lg text-center text-muted-foreground italic">
                      No upcoming quizzes.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="gamification" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Leaderboard Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Leaderboard Rank</CardTitle>
                      <CardDescription>Top performers this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { rank: 1, name: "You", points: data?.gamification?.points || 2850, emoji: "🥇" },
                          { rank: 2, name: "Sarah Mitchell", points: 2720, emoji: "🥈" },
                          { rank: 3, name: "James Wilson", points: 2650, emoji: "🥉" },
                        ].map((user) => (
                          <div key={user.rank} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-lg w-6">{user.rank}</span>
                              <span className="font-medium">{user.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-primary">{user.points} pts</span>
                              <span>{user.emoji}</span>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/student/gamification")}>
                          View Full Leaderboard
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Weekly Challenges */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Weekly Challenges</CardTitle>
                      <CardDescription>Earn bonus points</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { title: "Quiz Master", progress: 60, points: 150 },
                          { title: "Discussion Expert", progress: 80, points: 75 },
                          { title: "Code Challenge", progress: 20, points: 200 },
                        ].map((challenge, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{challenge.title}</span>
                              <span className="text-primary font-bold">+{challenge.points} pts</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: `${challenge.progress}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Badges Earned */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Recent Badges</CardTitle>
                    <CardDescription>Your latest achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {data?.gamification?.badges && data.gamification.badges.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {data.gamification.badges.map((badge, i) => (
                          <div key={i} className="text-center p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <h4 className="font-bold text-sm text-foreground">{badge.name}</h4>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Earned</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8 italic border border-dashed border-border rounded-lg">No badges earned yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="announcements" className="space-y-4">
                <div className="space-y-3">
                  {[
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
                    }
                  ].map((announcement) => (
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
