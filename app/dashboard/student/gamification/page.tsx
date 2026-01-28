"use client"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"



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

import { useState, useEffect } from "react"

// Simple confetti implementation without external dependency
const triggerConfetti = () => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = '50%';
    confetti.style.top = '50%';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;

    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const velocity = 5 + Math.random() * 5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    document.body.appendChild(confetti);

    let x = 0;
    let y = 0;
    let opacity = 1;

    const animate = () => {
      x += vx;
      y += vy + 2; // Gravity
      opacity -= 0.02;

      confetti.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      confetti.style.opacity = opacity.toString();

      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(confetti);
      }
    };

    requestAnimationFrame(animate);
  }
}
const MemoryGame = () => {
  const [cards, setCards] = useState([
    { id: 1, content: "HTML", pair: "Structure", flipped: false, matched: false },
    { id: 2, content: "Structure", pair: "HTML", flipped: false, matched: false },
    { id: 3, content: "CSS", pair: "Style", flipped: false, matched: false },
    { id: 4, content: "Style", pair: "CSS", flipped: false, matched: false },
    { id: 5, content: "JS", pair: "Logic", flipped: false, matched: false },
    { id: 6, content: "Logic", pair: "JS", flipped: false, matched: false },
    { id: 7, content: "React", pair: "Component", flipped: false, matched: false },
    { id: 8, content: "Component", pair: "React", flipped: false, matched: false },
  ].sort(() => Math.random() - 0.5))

  const [flipped, setFlipped] = useState<number[]>([])
  const [matches, setMatches] = useState(0)

  const handleFlip = (index: number) => {
    if (flipped.length === 2 || cards[index].flipped || cards[index].matched) return

    const newCards = [...cards]
    newCards[index].flipped = true
    setCards(newCards)

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const first = cards[newFlipped[0]]
      const second = cards[newFlipped[1]]

      if (first.pair === second.content) {
        setTimeout(() => {
          const matchedCards = [...newCards]
          matchedCards[newFlipped[0]].matched = true
          matchedCards[newFlipped[1]].matched = true
          setCards(matchedCards)
          setFlipped([])
          setMatches(m => m + 1)
          if (matches + 1 === 4) triggerConfetti()
        }, 500)
      } else {
        setTimeout(() => {
          const resetCards = [...newCards]
          resetCards[newFlipped[0]].flipped = false
          resetCards[newFlipped[1]].flipped = false
          setCards(resetCards)
          setFlipped([])
        }, 1000)
      }
    }
  }

  const resetGame = () => {
    setCards(cards.map(c => ({ ...c, flipped: false, matched: false })).sort(() => Math.random() - 0.5))
    setMatches(0)
    setFlipped([])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-bold">Matches: {matches}/4</span>
        <Button onClick={resetGame} size="sm" variant="outline">Reset Game</Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div
            key={card.id}
            onClick={() => handleFlip(i)}
            className={`h-24 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 font-bold text-sm md:text-lg border-2
                            ${card.flipped || card.matched ? 'bg-primary text-primary-foreground rotate-y-180' : 'bg-muted text-transparent rotate-y-0 hover:bg-muted/80'}
                        `}
          >
            {(card.flipped || card.matched) && card.content}
          </div>
        ))}
      </div>
      {matches === 4 && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center animate-in fade-in">
          <p className="font-bold">🎉 You Won! +50 Points</p>
        </div>
      )}
    </div>
  )
}
export default function GamificationPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [points, setPoints] = useState(2850)
  const [pendingQuizCount, setPendingQuizCount] = useState<number | undefined>(undefined)
  const [claimedChallenges, setClaimedChallenges] = useState<string[]>([])

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
    { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
    { title: "Assignments", href: "/dashboard/student/assignments", icon: "📋" },
    { title: "Quizzes", href: "/dashboard/student/assessments", icon: "✍️", badge: pendingQuizCount },
    { title: "Gamification", href: "/dashboard/student/gamification", icon: "🎮" },
    { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },
  ]

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/student/${(session.user as any).id}/dashboard`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            if (data.data?.stats) {
              setPendingQuizCount(data.data.stats.pendingQuizzesCount || undefined)
            }
            if (data.data?.gamification) {
              setPoints(data.data.gamification.points || 0)
              // We could also set badges here if we mapped them to the UI format
            }
          }
        })
        .catch(err => console.error("Stats fetch error", err))
    }
  }, [session?.user])

  useEffect(() => {
    if (selectedBadge?.earned) {
      triggerConfetti();
    }
  }, [selectedBadge])

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
              <h1 className="text-3xl font-bold text-foreground mb-2">Learning Gamification</h1>
              <p className="text-muted-foreground">Earn badges, climb the leaderboard, and unlock achievements</p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{points}</div>
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
                <TabsTrigger value="games">Games</TabsTrigger>
              </TabsList>



              {/* ... Leaderboard and Challenges content ... */}

              <TabsContent value="games" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mini Games</CardTitle>
                    <CardDescription>Play educational games to earn bonus points!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MemoryGame />
                  </CardContent>
                </Card>
              </TabsContent>


              <TabsContent value="badges" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <Card
                      key={badge.id}
                      className={`${badge.earned ? "border-primary/50 bg-primary/5" : "opacity-60"} cursor-pointer hover:scale-105 transition-transform`}
                      onClick={() => setSelectedBadge(badge)}
                    >
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

                {/* Badge Details Dialog */}
                {selectedBadge && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedBadge(null)}>
                    <Card className="max-w-md w-full animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                      <CardHeader className="text-center">
                        <div className="text-8xl mb-4">{selectedBadge.emoji}</div>
                        <CardTitle className="text-2xl">{selectedBadge.title}</CardTitle>
                        <CardDescription className="text-lg">{selectedBadge.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className={`p-4 rounded-lg text-center ${selectedBadge.earned ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"}`}>
                          <p className="font-bold text-lg">{selectedBadge.earned ? "Unlocked!" : "Locked"}</p>
                          {selectedBadge.earned && <p className="text-sm opacity-80">Earned on {selectedBadge.earnedDate}</p>}
                          {!selectedBadge.earned && <p className="text-sm opacity-80">Keep going to unlock this badge!</p>}
                        </div>
                        <Button className="w-full" onClick={() => setSelectedBadge(null)}>Close</Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
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
                      { id: 'c1', title: "Login Streak", desc: "Log in for 7 consecutive days", reward: 100, progress: 10 },
                      { id: 'c2', title: "Quiz Master", desc: "Complete 5 quizzes this week", reward: 150, progress: 3 },
                      { id: 'c3', title: "Discussion Expert", desc: "Reply to 10 discussion posts", reward: 75, progress: 8 },
                      { id: 'c4', title: "Code Challenge", desc: "Submit 2 coding challenges", reward: 200, progress: 1 },
                    ].map((challenge) => {
                      const isComplete = challenge.progress >= 10 || (challenge.title === "Login Streak" && challenge.progress >= 5); // Simplified logic for demo
                      // Actually let's make the FIRST one complete (10/10) to demo claiming
                      const isClaimed = claimedChallenges.includes(challenge.id);

                      return (
                        <div
                          key={challenge.id}
                          className={`p-4 rounded-lg border border-border transition-all ${isComplete && !isClaimed ? 'hover:border-primary/50 cursor-pointer bg-primary/5' : ''} ${isClaimed ? 'opacity-60 bg-muted/50' : ''}`}
                          onClick={() => {
                            if (isComplete && !isClaimed) {
                              setClaimedChallenges([...claimedChallenges, challenge.id])
                              setPoints(p => p + challenge.reward)
                              triggerConfetti()
                            }
                          }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-foreground flex items-center gap-2">
                                {challenge.title}
                                {isClaimed && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Claimed</span>}
                                {isComplete && !isClaimed && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full animate-pulse">Claim Reward</span>}
                              </h4>
                              <p className="text-sm text-muted-foreground">{challenge.desc}</p>
                            </div>
                            <span className="font-bold text-primary">+{challenge.reward} pts</span>
                          </div>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold text-foreground">{challenge.progress}/10</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${isComplete ? 'bg-green-500' : 'bg-primary'}`}
                              style={{ width: `${Math.min((challenge.progress / 10) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div >
    </div >
  )
}
