"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, CheckCircle, Clock, Calendar } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
    { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
    { title: "Assignments", href: "/dashboard/student/assignments", icon: "📋" },
    { title: "Quizzes", href: "/dashboard/student/assessments", icon: "✍️", badge: 3 },
    { title: "Gamification", href: "/dashboard/student/gamification", icon: "🎮" },
    { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },
]

export default function LearningActivityPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchActivity = async () => {
            if (!session?.user) return
            const user = session.user as any

            try {
                setLoading(true)
                // Fetch data from multiple sources to aggregate activity
                const [enrollRes, subRes, resultRes] = await Promise.all([
                    fetch(`/api/enrollments?studentId=${user.id}`),
                    fetch(`/api/submissions?studentId=${user.id}`),
                    fetch(`/api/assessment-results?studentId=${user.id}`)
                ])

                const enrolls = await enrollRes.json()
                const submissions = await subRes.json()
                const results = await resultRes.json()

                let allActivities: any[] = []

                if (enrolls.success) {
                    allActivities = [...allActivities, ...enrolls.data.map((e: any) => ({
                        type: 'course_enrollment',
                        title: `Enrolled in ${e.course?.title || 'Unknown Course'}`,
                        date: new Date(e.enrolledAt),
                        details: e.course?.code,
                        icon: <BookOpen className="w-4 h-4" />
                    }))]
                }

                if (submissions.success) {
                    allActivities = [...allActivities, ...submissions.data.map((s: any) => ({
                        type: 'assignment_submission',
                        title: `Submitted Assignment: ${s.assignment?.title || 'Unknown Assignment'}`,
                        date: new Date(s.createdAt),
                        details: `Status: ${s.status}`,
                        icon: <FileText className="w-4 h-4" />
                    }))]
                }

                if (results.success) {
                    allActivities = [...allActivities, ...results.data.map((r: any) => ({
                        type: 'quiz_attempt',
                        title: `Attempted Quiz: ${r.assessment?.title || 'Unknown Quiz'}`, // Assessment might be ID sometimes
                        date: new Date(r.attemptedAt || r.createdAt),
                        details: `Score: ${r.score}/${r.totalMarks}`,
                        icon: <CheckCircle className="w-4 h-4" />
                    }))]
                }

                // Sort by date descending
                allActivities.sort((a, b) => b.date.getTime() - a.date.getTime())

                setActivities(allActivities)

            } catch (error) {
                console.error("Failed to load activity", error)
            } finally {
                setLoading(false)
            }
        }

        fetchActivity()
    }, [session])

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden lg:flex flex-col w-72 border-r border-border/40 bg-card/30 backdrop-blur-xl">
                <div className="flex items-center justify-center py-6 border-b border-sidebar-border/40 group cursor-pointer" onClick={() => router.push("/")}>
                    <img src="/logo.png" alt="Orbit" className="w-24 h-24 object-contain" />
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav
                    userName={session?.user?.name || "Student"}
                    userRole="Student"
                    onLogout={() => router.push("/login")}
                />

                <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-primary/[0.02] to-background">
                    <div className="p-8 md:p-12 lg:p-16 max-w-5xl mx-auto space-y-12">
                        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                            <h1 className="text-5xl font-black tracking-tighter mb-3">Learning Activity</h1>
                            <p className="text-lg text-muted-foreground font-medium">Track your learning journey and recent interactions.</p>
                        </div>

                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            {loading ? (
                                <p>Loading activity...</p>
                            ) : activities.length === 0 ? (
                                <p className="text-muted-foreground">No recent activity found.</p>
                            ) : (
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                                    {activities.map((activity, idx) => (
                                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                {activity.icon}
                                            </div>

                                            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge variant="outline" className="mb-2 uppercase text-[10px] tracking-widest">{activity.type.replace('_', ' ')}</Badge>
                                                    <time className="font-mono text-xs text-muted-foreground">{activity.date.toLocaleDateString()} {activity.date.toLocaleTimeString()}</time>
                                                </div>
                                                <h3 className="text-lg font-bold mb-1">{activity.title}</h3>
                                                <p className="text-sm text-muted-foreground">{activity.details}</p>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
