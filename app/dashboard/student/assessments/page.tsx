"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
  { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
  { title: "Assignments", href: "/dashboard/student/assignments", icon: "📋" },
  { title: "Quizzes", href: "/dashboard/student/assessments", icon: "✍️", badge: 3 },

  { title: "Gamification", href: "/dashboard/student/gamification", icon: "🎮" },
  { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },
]

interface Assessment {
  id: string
  title: string
  course: string
  type: "quiz" | "assignment" | "exam" | "coding"
  dueDate: string
  status: "pending" | "submitted" | "graded"
  score?: number
  maxScore: number
}


import { useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function AssessmentsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user as any
  const [selectedTab, setSelectedTab] = useState("all")
  /* const [loading, setLoading] = useState(false) */
  const [loading, setLoading] = useState(true)
  const [assessmentsData, setAssessmentsData] = useState<Assessment[]>([])

  const fetchAssessments = useCallback(async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      // 1. Fetch Student's Enrollments to get Course IDs
      const enrollRes = await fetch(`/api/enrollments?studentId=${user.id}`)
      const enrollJson = await enrollRes.json()

      let enrolledCourseIds: string[] = []
      if (enrollJson.success) {
        // Safely extract course ID
        enrolledCourseIds = enrollJson.data
          .map((e: any) => {
            const course = e.course;
            if (!course) return null;
            return (course._id || course).toString()
          })
          .filter((id: string | null) => id !== null)
      }

      if (enrolledCourseIds.length === 0) {
        setAssessmentsData([])
        setLoading(false)
        return
      }

      // 2. Fetch All Assessments (Quizzes) for these Courses
      // We need an endpoint that accepts courseIds or we filter client side if API returns all.
      // Assuming we can fetch all and filter, or a specific endpoint exists.
      // Let's try fetching from /api/assessments and filtering by course.
      // Ideally backend should support filtering.
      const assessRes = await fetch(`/api/assessments`)
      const assessJson = await assessRes.json()

      let allAssessments: any[] = []
      if (assessJson.success) {
        allAssessments = assessJson.data.filter((a: any) => {
          const aCourseId = (a.course?._id || a.course).toString();
          return enrolledCourseIds.includes(aCourseId);
        })
      }

      // 3. Fetch Student's Results
      const resultsRes = await fetch(`/api/assessment-results?studentId=${user.id}`)
      const resultsJson = await resultsRes.json()
      const results = resultsJson.success ? resultsJson.data : []

      // 4. Merge Data
      const mergedData: Assessment[] = allAssessments.map((assessment: any) => {
        // Find if user has a result for this assessment
        // assessment.id might be _id
        const result = results.find((r: any) => r.assessment === assessment._id)

        let status: "pending" | "submitted" | "graded" = "pending"
        let score = undefined

        if (result) {
          status = 'graded' // Assessments are auto-graded usually
          score = result.score
        }

        return {
          id: assessment._id,
          title: assessment.title,
          course: assessment.courseName || "General", // You might need to populate this on backend or map it
          type: assessment.type || "quiz",
          dueDate: assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : "No Due Date",
          status: status,
          score: score,
          maxScore: assessment.questions ? assessment.questions.length : 0 // Assuming 1 mark per question
        }
      })

      setAssessmentsData(mergedData)

    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load assessments")
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchAssessments()
  }, [fetchAssessments])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return "📝"
      case "assignment":
        return "📄"
      case "exam":
        return "🎯"
      case "coding":
        return "💻"
      default:
        return "✍️"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "submitted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "graded":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const filteredAssessments = assessmentsData.filter((a) => {
    if (selectedTab === "all") return true
    return a.status === selectedTab
  })

  const pendingCount = assessmentsData.filter((a) => a.status === "pending").length

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
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Quizzes</h1>
              <p className="text-muted-foreground">Manage your quizzes, assignments, and exams</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {loading ? <Skeleton className="h-8 w-12 mx-auto" /> : assessmentsData.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Quizzes</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                      {loading ? <Skeleton className="h-8 w-12 mx-auto" /> : pendingCount}
                    </div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {loading ? <Skeleton className="h-8 w-12 mx-auto" /> : assessmentsData.filter((a) => a.status === "graded").length}
                    </div>
                    <p className="text-sm text-muted-foreground">Graded</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {loading ? (
                        <Skeleton className="h-8 w-16 mx-auto" />
                      ) : (
                        Math.round(
                          assessmentsData
                            .filter((a) => a.status === "graded" && a.score)
                            .reduce((sum, a) => sum + (a.score || 0), 0) /
                          Math.max(assessmentsData.filter((a) => a.status === "graded").length, 1),
                        )
                      )}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assessments List */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="submitted">Submitted</TabsTrigger>
                <TabsTrigger value="graded">Graded</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="space-y-3">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <Card key={i} className="p-6">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-12 w-1/3" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </Card>
                  ))
                ) : filteredAssessments.length === 0 ? (
                  <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">No assessments found in this category.</p>
                  </div>
                ) : filteredAssessments.map((assessment) => (
                  <Card key={assessment.id} className="overflow-hidden hover:border-primary/50 transition">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getTypeIcon(assessment.type)}</span>
                            <div>
                              <h3 className="font-semibold text-foreground">{assessment.title}</h3>
                              <p className="text-sm text-muted-foreground">{assessment.course}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(assessment.status)}`}
                          >
                            {assessment.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div className="space-y-1 text-sm">
                          <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">Due:</span> {assessment.dueDate}
                          </div>
                          {assessment.status === "graded" && (
                            <div className="text-muted-foreground">
                              <span className="font-medium text-foreground">Score:</span> {assessment.score}/
                              {assessment.maxScore}
                            </div>
                          )}
                          {assessment.status !== "graded" && (
                            <div className="text-muted-foreground">
                              <span className="font-medium text-foreground">Max Score:</span> {assessment.maxScore}
                            </div>
                          )}
                        </div>
                        <Button onClick={() => router.push(`/dashboard/student/assessments/${assessment.id}`)}>
                          {assessment.status === "pending" ? "Take Assessment" : "View Details"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
