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
  { title: "Assessments", href: "/dashboard/student/assessments", icon: "✍️", badge: 3 },
  { title: "AI Assistant", href: "/dashboard/student/ai-assistant", icon: "🤖" },
  { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },
  { title: "Certificates", href: "/dashboard/student/certificates", icon: "🏆" },
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

const assessments: Assessment[] = [
  {
    id: "1",
    title: "Module 1 Quiz",
    course: "Web Development Basics",
    type: "quiz",
    dueDate: "2024-03-10",
    status: "graded",
    score: 92,
    maxScore: 100,
  },
  {
    id: "2",
    title: "Project Assignment",
    course: "Web Development Basics",
    type: "assignment",
    dueDate: "2024-03-15",
    status: "submitted",
    maxScore: 100,
  },
  {
    id: "3",
    title: "Midterm Exam",
    course: "Advanced React",
    type: "exam",
    dueDate: "2024-03-20",
    status: "pending",
    maxScore: 200,
  },
  {
    id: "4",
    title: "Coding Challenge",
    course: "Advanced React",
    type: "coding",
    dueDate: "2024-03-12",
    status: "pending",
    maxScore: 50,
  },
  {
    id: "5",
    title: "Design System Quiz",
    course: "UI/UX Design",
    type: "quiz",
    dueDate: "2024-03-08",
    status: "graded",
    score: 88,
    maxScore: 100,
  },
]

export default function AssessmentsPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("all")

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

  const filteredAssessments = assessments.filter((a) => {
    if (selectedTab === "all") return true
    return a.status === selectedTab
  })

  const pendingCount = assessments.filter((a) => a.status === "pending").length

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
              <h1 className="text-3xl font-bold text-foreground mb-2">Assessments</h1>
              <p className="text-muted-foreground">Manage your quizzes, assignments, and exams</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{assessments.length}</div>
                    <p className="text-sm text-muted-foreground">Total Assessments</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">{pendingCount}</div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {assessments.filter((a) => a.status === "graded").length}
                    </div>
                    <p className="text-sm text-muted-foreground">Graded</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {Math.round(
                        assessments
                          .filter((a) => a.status === "graded" && a.score)
                          .reduce((sum, a) => sum + (a.score || 0), 0) /
                        Math.max(assessments.filter((a) => a.status === "graded").length, 1),
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
                {filteredAssessments.map((assessment) => (
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
