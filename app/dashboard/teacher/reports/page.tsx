"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText as FileTextIcon, PieChart as PieChartIcon, TrendingUp, Users, LayoutDashboard, BookOpen, BarChart as BarChartIcon, ClipboardList } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'


const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/teacher", icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: "My Courses", href: "/dashboard/teacher/courses", icon: <BookOpen className="w-5 h-5" /> },
    { title: "Assessments", href: "/dashboard/teacher/assessments", icon: <FileTextIcon className="w-5 h-5" /> },
    { title: "Student Progress", href: "/dashboard/teacher/progress", icon: <BarChartIcon className="w-5 h-5" /> },
    { title: "Attendance", href: "/dashboard/teacher/attendance", icon: <ClipboardList className="w-5 h-5" /> },
    { title: "Reports", href: "/dashboard/teacher/reports", icon: <PieChartIcon className="w-5 h-5" /> },
]

const performanceData = [
    { name: 'Week 1', avgScore: 65, attendance: 90 },
    { name: 'Week 2', avgScore: 70, attendance: 88 },
    { name: 'Week 3', avgScore: 75, attendance: 92 },
    { name: 'Week 4', avgScore: 72, attendance: 85 },
    { name: 'Week 5', avgScore: 82, attendance: 95 },
    { name: 'Week 6', avgScore: 85, attendance: 93 },
]

const recentReports = [
    { name: "Monthly Attendance Report", date: "Mar 01, 2024", size: "2.4 MB", type: "PDF" },
    { name: "Mid-Term Assessment Summary", date: "Feb 28, 2024", size: "1.8 MB", type: "Excel" },
    { name: "Student Engagement Analysis", date: "Feb 25, 2024", size: "3.2 MB", type: "PDF" },
    { name: "Course Completion Stats", date: "Feb 20, 2024", size: "1.1 MB", type: "CSV" },
]

export default function ReportsPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [reportType, setReportType] = useState("academic")

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
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Reports</h1>
                                <p className="text-muted-foreground">Generate insights and download detailed reports</p>
                            </div>
                            <Button>
                                <Download className="w-4 h-4 mr-2" /> Generate New Report
                            </Button>
                        </div>

                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Average Class Score</CardTitle>
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">78%</div>
                                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Overall Attendance</CardTitle>
                                    <Users className="w-4 h-4 text-blue-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">92%</div>
                                    <p className="text-xs text-muted-foreground">Consistent with previous week</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Assignments Submitted</CardTitle>
                                    <FileTextIcon className="w-4 h-4 text-purple-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">342</div>
                                    <p className="text-xs text-muted-foreground">45 pending grading</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Chart Section */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Performance Trends</CardTitle>
                                            <CardDescription>Academic scores vs Attendance over the last 6 weeks</CardDescription>
                                        </div>
                                        <Select defaultValue="all">
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Select Metric" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Overview</SelectItem>
                                                <SelectItem value="score">Scores Only</SelectItem>
                                                <SelectItem value="attendance">Attendance Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                <Legend />
                                                <Line type="monotone" dataKey="avgScore" name="Avg Score (%)" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                                                <Line type="monotone" dataKey="attendance" name="Attendance (%)" stroke="#10b981" strokeWidth={3} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Downloads Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Reports</CardTitle>
                                    <CardDescription>Previously generated files</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentReports.map((file, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                        {file.type}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium line-clamp-1">{file.name}</p>
                                                        <p className="text-xs text-muted-foreground">{file.date} | {file.size}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Download className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" className="w-full mt-6">View All Archives</Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Data Tables */}
                        <div className="mt-8">
                            <Tabs defaultValue="academic" className="space-y-4">
                                <TabsList>
                                    <TabsTrigger value="academic">Academic Performance</TabsTrigger>
                                    <TabsTrigger value="attendance">Attendance Logs</TabsTrigger>
                                    <TabsTrigger value="engagement">Student Engagement</TabsTrigger>
                                </TabsList>

                                <TabsContent value="academic">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Course-wise Performance</CardTitle>
                                            <CardDescription>Detailed breakdown of average scores per course</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Course Name</TableHead>
                                                        <TableHead>Students</TableHead>
                                                        <TableHead>Assignments</TableHead>
                                                        <TableHead>Avg. Score</TableHead>
                                                        <TableHead>Top Performer</TableHead>
                                                        <TableHead>Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Web Development Basics</TableCell>
                                                        <TableCell>45</TableCell>
                                                        <TableCell>12</TableCell>
                                                        <TableCell className="text-green-600 font-semibold">82%</TableCell>
                                                        <TableCell>Alex Johnson</TableCell>
                                                        <TableCell><Badge className="bg-green-100 text-green-700 hover:bg-green-100">Excellent</Badge></TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Advanced React Patterns</TableCell>
                                                        <TableCell>32</TableCell>
                                                        <TableCell>8</TableCell>
                                                        <TableCell className="text-blue-600 font-semibold">76%</TableCell>
                                                        <TableCell>Sarah Smith</TableCell>
                                                        <TableCell><Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Good</Badge></TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Backend with Node.js</TableCell>
                                                        <TableCell>28</TableCell>
                                                        <TableCell>15</TableCell>
                                                        <TableCell className="text-yellow-600 font-semibold">68%</TableCell>
                                                        <TableCell>Mike Tyson</TableCell>
                                                        <TableCell><Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Average</Badge></TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="attendance">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Low Attendance Alerts</CardTitle>
                                            <CardDescription>Students with attendance below 75% threshold</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center py-8 text-muted-foreground">
                                                No critical attendance alerts for this week.
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}
