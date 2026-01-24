"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
  { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
  { title: "Assignments", href: "/dashboard/student/assignments", icon: "📋" },
  { title: "Quizzes", href: "/dashboard/student/assessments", icon: "✍️" },
  { title: "Virtual Labs", href: "/dashboard/student/virtual-labs", icon: "🔬" },
  { title: "Gamification", href: "/dashboard/student/gamification", icon: "🎮" },
  { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },

]

interface Lab {
  id: string
  title: string
  course: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  completed: boolean
  score?: number
}

const labs: Lab[] = [
  {
    id: "1",
    title: "HTML & CSS Basics",
    course: "Web Development",
    description: "Build your first webpage with HTML and style it with CSS",
    difficulty: "beginner",
    duration: "2 hours",
    completed: true,
    score: 95,
  },
  {
    id: "2",
    title: "JavaScript DOM Manipulation",
    course: "Web Development",
    description: "Learn to interact with webpage elements using JavaScript",
    difficulty: "intermediate",
    duration: "3 hours",
    completed: true,
    score: 88,
  },
  {
    id: "3",
    title: "React Components Deep Dive",
    course: "Advanced React",
    description: "Master React components, hooks, and state management",
    difficulty: "advanced",
    duration: "4 hours",
    completed: false,
  },
  {
    id: "4",
    title: "API Development with Node.js",
    course: "Backend Development",
    description: "Create RESTful APIs using Node.js and Express",
    difficulty: "intermediate",
    duration: "3.5 hours",
    completed: false,
  },
  {
    id: "5",
    title: "Database Design & SQL",
    course: "Database Fundamentals",
    description: "Design databases and write SQL queries",
    difficulty: "intermediate",
    duration: "3 hours",
    completed: false,
  },
]

export default function VirtualLabsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const completedLabs = labs.filter((lab) => lab.completed).length

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "advanced":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-700"
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Virtual Labs</h1>
              <p className="text-muted-foreground">Interactive hands-on learning experiences</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{labs.length}</div>
                    <p className="text-sm text-muted-foreground">Total Labs</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">{completedLabs}</div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">
                      {Math.round((completedLabs / labs.length) * 100)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Completion</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lab Grid */}
            {!selectedLab ? (
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Labs</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="inprogress">In Progress</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {labs.map((lab) => (
                    <Card
                      key={lab.id}
                      className="overflow-hidden hover:border-primary/50 transition cursor-pointer group"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <CardTitle className="text-lg">{lab.title}</CardTitle>
                          {lab.completed && <span className="text-2xl">✓</span>}
                        </div>
                        <CardDescription>{lab.course}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{lab.description}</p>

                        <div className="flex gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(lab.difficulty)}`}
                          >
                            {lab.difficulty}
                          </span>
                          <span className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground font-medium">
                            {lab.duration}
                          </span>
                        </div>

                        {lab.completed && lab.score && (
                          <div className="p-2 rounded-lg bg-green-100/50 dark:bg-green-900/20">
                            <p className="text-xs text-muted-foreground">Score</p>
                            <p className="font-bold text-green-600 dark:text-green-400">{lab.score}%</p>
                          </div>
                        )}

                        <Button
                          className="w-full"
                          variant={lab.completed ? "outline" : "default"}
                          onClick={() => setSelectedLab(lab)}
                        >
                          {lab.completed ? "Review" : "Start Lab"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="completed" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {labs
                    .filter((l) => l.completed)
                    .map((lab) => (
                      <Card key={lab.id} className="overflow-hidden hover:border-primary/50 transition cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <CardTitle className="text-lg">{lab.title}</CardTitle>
                            <span className="text-2xl">✓</span>
                          </div>
                          <CardDescription>{lab.course}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{lab.description}</p>

                          {lab.score && (
                            <div className="p-2 rounded-lg bg-green-100/50 dark:bg-green-900/20">
                              <p className="text-xs text-muted-foreground">Score</p>
                              <p className="font-bold text-green-600 dark:text-green-400">{lab.score}%</p>
                            </div>
                          )}

                          <Button
                            className="w-full bg-transparent"
                            variant="outline"
                            onClick={() => setSelectedLab(lab)}
                          >
                            Review
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>

                <TabsContent value="inprogress" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {labs
                    .filter((l) => !l.completed)
                    .map((lab) => (
                      <Card key={lab.id} className="overflow-hidden hover:border-primary/50 transition cursor-pointer">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{lab.title}</CardTitle>
                          <CardDescription>{lab.course}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{lab.description}</p>
                          <Button className="w-full" onClick={() => setSelectedLab(lab)}>
                            Start Lab
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              </Tabs>
            ) : (
              // Lab Viewer
              <div className="space-y-4">
                <Button variant="outline" onClick={() => setSelectedLab(null)}>
                  Back to Labs
                </Button>

                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{selectedLab.title}</CardTitle>
                        <CardDescription className="mt-2">{selectedLab.course}</CardDescription>
                      </div>
                      {selectedLab.completed && <span className="text-3xl">✓</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-foreground">{selectedLab.description}</p>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-xs text-muted-foreground">Difficulty</p>
                        <p className="font-semibold text-foreground capitalize">{selectedLab.difficulty}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-semibold text-foreground">{selectedLab.duration}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="font-semibold text-foreground">
                          {selectedLab.completed ? "Completed" : "Not Started"}
                        </p>
                      </div>
                    </div>

                    {/* Lab Simulation Area */}
                    <div className="p-6 rounded-lg border-2 border-dashed border-border bg-muted/30 text-center space-y-4">
                      <div className="text-6xl">🔬</div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Interactive Lab Environment</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          This is where the lab simulation would run. You can write code, run experiments, and see
                          real-time results.
                        </p>
                      </div>
                      <Button onClick={() => setIsSimulating(!isSimulating)}>
                        {isSimulating ? "Stop Simulation" : "Start Simulation"}
                      </Button>
                      {isSimulating && (
                        <div className="mt-4 p-4 rounded-lg bg-background border border-border text-left">
                          <p className="text-xs font-mono text-muted-foreground">
                            Lab simulation is running...
                            <br />
                            Environment ready for interaction
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedLab.completed && selectedLab.score && (
                      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Your Score</p>
                            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                              {selectedLab.score}%
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {!selectedLab.completed && (
                      <Button className="w-full" size="lg">
                        Submit Lab
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
