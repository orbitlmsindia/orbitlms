"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Search, Download, TrendingUp, AlertCircle, CheckCircle, Clock, LayoutDashboard, BookOpen, FileText, BarChart as BarChartIcon, ClipboardList, PieChart as PieChartIcon } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/teacher", icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: "My Courses", href: "/dashboard/teacher/courses", icon: <BookOpen className="w-5 h-5" /> },
    { title: "Assessments", href: "/dashboard/teacher/assessments", icon: <FileText className="w-5 h-5" /> },
    { title: "Student Progress", href: "/dashboard/teacher/progress", icon: <BarChartIcon className="w-5 h-5" /> },
    { title: "Attendance", href: "/dashboard/teacher/attendance", icon: <ClipboardList className="w-5 h-5" /> },
    { title: "Reports", href: "/dashboard/teacher/reports", icon: <PieChartIcon className="w-5 h-5" /> },
]

interface Student {
    id: string
    name: string
    email: string
    avatar: string
    overallScore: number
    courseCompletion: number
    attendance: number
    assignmentsSubmitted: number
    totalAssignments: number
    status: "Excellent" | "Good" | "Average" | "At Risk"
}

const performanceData = [
    { name: 'Mon', activity: 4 },
    { name: 'Tue', activity: 3 },
    { name: 'Wed', activity: 7 },
    { name: 'Thu', activity: 5 },
    { name: 'Fri', activity: 6 },
    { name: 'Sat', activity: 2 },
    { name: 'Sun', activity: 1 },
]

export default function StudentProgressPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [students, setStudents] = useState<Student[]>([])
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchStudents = async () => {
        try {
            const res = await fetch('/api/users?role=student')
            const data = await res.json()
            if (data.success) {
                // Transform API user data to Student interface with mock stats
                // In a real app, these stats would come from a separate 'student-performance' API
                const mappedStudents: Student[] = data.data.map((user: any) => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.name.charAt(0).toUpperCase(),
                    overallScore: Math.floor(Math.random() * 40) + 60, // Mock score 60-100
                    courseCompletion: Math.floor(Math.random() * 100),
                    attendance: Math.floor(Math.random() * 30) + 70, // Mock attendance 70-100
                    assignmentsSubmitted: Math.floor(Math.random() * 12),
                    totalAssignments: 12,
                    status: ['Excellent', 'Good', 'Average', 'At Risk'][Math.floor(Math.random() * 4)] as any
                }))
                setStudents(mappedStudents)
                if (mappedStudents.length > 0) {
                    setSelectedStudent(mappedStudents[0])
                }
            }
        } catch (error) {
            console.error("Failed to fetch students")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const getStatusColor = (status: Student['status']) => {
        switch (status) {
            case 'Excellent': return "text-green-600 bg-green-100 border-green-200"
            case 'Good': return "text-blue-600 bg-blue-100 border-blue-200"
            case 'Average': return "text-yellow-600 bg-yellow-100 border-yellow-200"
            case 'At Risk': return "text-red-600 bg-red-100 border-red-200"
            default: return ""
        }
    }

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar">
                <div className="flex items-center justify-center py-6 border-b border-sidebar-border">
                    <img src="/logo.png" alt="Orbit" className="w-24 h-24 object-contain" />
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav userName={session?.user?.name || "Teacher"} userRole="Teacher" onLogout={() => router.push("/login")} />

                <main className="flex-1 overflow-auto bg-muted/20">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto h-full flex flex-col">

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Student Progress</h1>
                                <p className="text-muted-foreground">Track performance and identify students needing support</p>
                            </div>
                            <div className="flex gap-2">
                                <Select defaultValue="web-dev">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="web-dev">Web Development</SelectItem>
                                        <SelectItem value="react">Advanced React</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" /> Export Report
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                            {/* Student List */}
                            <Card className="flex flex-col h-full overflow-hidden">
                                <CardHeader className="pb-3 border-b">
                                    <CardTitle className="text-lg">Students</CardTitle>
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Search students..." className="pl-9" />
                                    </div>
                                </CardHeader>
                                <div className="flex-1 overflow-y-auto p-2">
                                    {students.map((student: Student) => (
                                        <div
                                            key={student.id}
                                            onClick={() => setSelectedStudent(student)}
                                            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${selectedStudent?.id === student.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted'}`}
                                        >
                                            <Avatar>
                                                <AvatarFallback>{student.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between">
                                                    <p className="font-semibold truncate">{student.name}</p>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(student.status)}`}>{student.status}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Detailed View */}
                            <div className="lg:col-span-2 h-full overflow-y-auto">
                                {selectedStudent ? (
                                    <div className="space-y-6">
                                        {/* Profile Header */}
                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex gap-4">
                                                        <Avatar className="h-16 w-16">
                                                            <AvatarFallback className="text-xl bg-primary/10 text-primary">{selectedStudent.avatar}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                                                            <p className="text-muted-foreground">{selectedStudent.email}</p>
                                                            <div className="flex gap-2 mt-2">
                                                                <Badge variant="secondary">Roll No: 202400{selectedStudent.id}</Badge>
                                                                <Badge variant="outline">Batch A</Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium text-muted-foreground">Overall Score</div>
                                                        <div className="text-4xl font-bold text-primary">{selectedStudent.overallScore}%</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Key Metrics */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium text-muted-foreground">Course Completion</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold mb-2">{selectedStudent.courseCompletion}%</div>
                                                    <Progress value={selectedStudent.courseCompletion} className="h-2" />
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium text-muted-foreground">Attendance</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold mb-2">{selectedStudent.attendance}%</div>
                                                    <Progress value={selectedStudent.attendance} className={`h-2 ${selectedStudent.attendance < 75 ? 'bg-red-100 [&>div]:bg-red-500' : ''}`} />
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium text-muted-foreground">Assignments</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold mb-2">{selectedStudent.assignmentsSubmitted}/{selectedStudent.totalAssignments}</div>
                                                    <Progress value={(selectedStudent.assignmentsSubmitted / selectedStudent.totalAssignments) * 100} className="h-2" />
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Recent Activity */}
                                            <Card className="md:col-span-1">
                                                <CardHeader>
                                                    <CardTitle className="text-base">Recent Activity</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        {[
                                                            { icon: CheckCircle, color: "text-green-500", text: "Submitted Assignment 3", time: "2 hours ago" },
                                                            { icon: Clock, color: "text-blue-500", text: "Started Module 4", time: "Yesterday" },
                                                            { icon: AlertCircle, color: "text-yellow-500", text: "Missed Live Session", time: "2 days ago" },
                                                        ].map((item, i) => (
                                                            <div key={i} className="flex items-start gap-3">
                                                                <item.icon className={`w-5 h-5 mt-0.5 ${item.color}`} />
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium">{item.text}</p>
                                                                    <p className="text-xs text-muted-foreground">{item.time}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Learning Timeline Chart */}
                                            <Card className="md:col-span-1">
                                                <CardHeader>
                                                    <CardTitle className="text-base">Learning Activity</CardTitle>
                                                </CardHeader>
                                                <CardContent className="h-[200px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={performanceData}>
                                                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                                            <Tooltip
                                                                cursor={{ fill: 'transparent' }}
                                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                            />
                                                            <Bar dataKey="activity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Weakest/Strongest Areas */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">Subject Performance</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex justify-between mb-1 text-sm">
                                                            <span>React Components</span>
                                                            <span className="font-semibold text-green-600">Strong (88%)</span>
                                                        </div>
                                                        <Progress value={88} className="h-2 bg-green-100 [&>div]:bg-green-600" />
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between mb-1 text-sm">
                                                            <span>State Management</span>
                                                            <span className="font-semibold text-primary">Good (75%)</span>
                                                        </div>
                                                        <Progress value={75} className="h-2" />
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between mb-1 text-sm">
                                                            <span>Backend Integration</span>
                                                            <span className="font-semibold text-red-600">Weak Area (45%)</span>
                                                        </div>
                                                        <Progress value={45} className="h-2 bg-red-100 [&>div]:bg-red-600" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                                            <TrendingUp className="w-12 h-12 text-muted-foreground/50" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-medium text-foreground">Select a Student</h3>
                                            <p>Click on a student from the list to view their detailed progress report.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
