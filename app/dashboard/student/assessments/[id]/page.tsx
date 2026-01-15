"use client"

import { useParams, useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckCircle, ChevronLeft } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
    { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
    { title: "Assignments", href: "/dashboard/student/assignments", icon: "📋" },
    { title: "Assessments", href: "/dashboard/student/assessments", icon: "✍️", badge: 3 },
    { title: "AI Assistant", href: "/dashboard/student/ai-assistant", icon: "🤖" },
    { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },
    { title: "Certificates", href: "/dashboard/student/certificates", icon: "🏆" },
]

export default function AssessmentDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id

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

                <main className="flex-1 overflow-auto bg-muted/20">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                        <Button
                            variant="ghost"
                            className="mb-4 pl-0 hover:pl-2 transition-all"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back to Assessments
                        </Button>

                        <Card className="mb-6">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/20">
                                            Assessment #{id}
                                        </Badge>
                                        <CardTitle className="text-2xl mb-2">Module Quiz: Web Development Fundamentals</CardTitle>
                                        <CardDescription>Course: Introduction to Web Development</CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="text-sm px-3 py-1">
                                        Pending
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg bg-muted flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Duration</p>
                                            <p className="font-semibold">45 Minutes</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Due Date</p>
                                            <p className="font-semibold">Mar 10, 2024</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Total Questions</p>
                                            <p className="font-semibold">30 Questions</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose dark:prose-invert max-w-none">
                                    <h3>Instructions</h3>
                                    <ul>
                                        <li>This assessment covers topics from Week 1-4.</li>
                                        <li>You will have 45 minutes to complete 30 multiple-choice questions.</li>
                                        <li>Once started, the timer cannot be paused.</li>
                                        <li>Ensure you have a stable internet connection before beginning.</li>
                                    </ul>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                                    <Button size="lg">Start Assessment</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
