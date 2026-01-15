"use client"

import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
  { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
  { title: "Assignments", href: "/dashboard/student/assignments", icon: "📋" },
  { title: "Assessments", href: "/dashboard/student/assessments", icon: "✍️" },
  { title: "AI Assistant", href: "/dashboard/student/ai-assistant", icon: "🤖" },
  { title: "Gamification", href: "/dashboard/student/gamification", icon: "🎮" },
  { title: "Certificates", href: "/dashboard/student/certificates", icon: "🏆" },
]

interface Badge {
  id: string
  title: string
  description: string
  emoji: string
  earned: boolean
  earnedDate?: string
  progress?: number
}

interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  level: number
  streak: number
}

const badges: Badge[] = [
  {
    id: "1",
    title: "Quick Learner",
    description: "Complete a course in 2 weeks",
    emoji: "⚡",
    earned: true,
    earnedDate: "2024-02-15",
  },
  {
    id: "2",
    title: "Perfect Score",
    description: "Achieve 100% on an assessment",
    emoji: "💯",
    earned: true,
    earnedDate: "2024-02-10",
  },
  {
    id: "3",
    title: "On Fire",
    description: "Maintain 7-day learning streak",
    emoji: "🔥",
    earned: false,
    progress: 5,
  },
  {
    id: "4",
    title: "Star Student",
    description: "Complete 5 courses",
    emoji: "⭐",
    earned: false,
    progress: 2,
  },
  {
    id: "5",
    title: "Challenge Master",
    description: "Complete 10 coding challenges",
    emoji: "🎯",
    earned: false,
    progress: 7,
  },
  {
    id: "6",
    title: "Social Learner",
    description: "Participate in 3 group discussions",
    emoji: "👥",
    earned: false,
    progress: 1,
  },
]

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "You", points: 2850, level: 12, streak: 15 },
  { rank: 2, name: "Sarah Mitchell", points: 3200, level: 14, streak: 21 },
  { rank: 3, name: "James Wilson", points: 2650, level: 11, streak: 8 },
  { rank: 4, name: "Emily Chen", points: 2420, level: 10, streak: 12 },
  { rank: 5, name: "Michael Brown", points: 2100, level: 9, streak: 5 },
]

export default function GamificationPage() {
  const router = useRouter()

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
              <h1 className="text-3xl font-bold text-foreground mb-2">Learning Gamification</h1>
              <p className="text-muted-foreground">Earn badges, climb the leaderboard, and unlock achievements</p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">2850</div>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">12</div>
                    <p className="text-sm text-muted-foreground">Level</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">15</div>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">#1</div>
                    <p className="text-sm text-muted-foreground">Rank</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="badges" className="space-y-4">
              <TabsList>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
              </TabsList>

              <TabsContent value="badges" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <Card key={badge.id} className={badge.earned ? "border-primary/50 bg-primary/5" : "opacity-60"}>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-3">
                          <div className={`text-5xl mx-auto ${badge.earned ? "" : "grayscale"}`}>{badge.emoji}</div>
                          <div>
                            <h3 className="font-semibold text-foreground">{badge.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                          </div>
                          {badge.earned ? (
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Earned {badge.earnedDate}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold text-foreground">{badge.progress}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${((badge.progress || 0) / 10) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Global Leaderboard</CardTitle>
                    <CardDescription>Top performers across the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {leaderboardData.map((entry) => (
                        <div
                          key={entry.rank}
                          className={`p-4 rounded-lg flex items-center justify-between ${entry.rank === 1 ? "border-primary/50 bg-primary/5" : "border border-border"
                            }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-foreground">
                              {entry.rank}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{entry.name}</h4>
                              <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">{entry.points} pts</div>
                            <p className="text-xs text-muted-foreground">{entry.streak} day streak</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="challenges" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Weekly Challenges</CardTitle>
                      <CardDescription>Complete challenges to earn extra points</CardDescription>
                    </div>
                    <Button size="sm">View All</Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: "Login Streak", desc: "Log in for 7 consecutive days", reward: 100, progress: 5 },
                      { title: "Quiz Master", desc: "Complete 5 quizzes this week", reward: 150, progress: 3 },
                      { title: "Discussion Expert", desc: "Reply to 10 discussion posts", reward: 75, progress: 8 },
                      { title: "Code Challenge", desc: "Submit 2 coding challenges", reward: 200, progress: 1 },
                    ].map((challenge, i) => (
                      <div key={i} className="p-4 rounded-lg border border-border hover:border-primary/50 transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{challenge.title}</h4>
                            <p className="text-sm text-muted-foreground">{challenge.desc}</p>
                          </div>
                          <span className="font-bold text-primary">+{challenge.reward} pts</span>
                        </div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold text-foreground">{challenge.progress}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${challenge.progress * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
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
