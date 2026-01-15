"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Upload, Download, CheckCircle, XCircle, Save, Calendar, Users, Filter, FileSpreadsheet, RefreshCw } from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/teacher", icon: "🏠" },
  { title: "My Courses", href: "/dashboard/teacher/courses", icon: "📚" },
  { title: "Assessments", href: "/dashboard/teacher/assessments", icon: "✍️" },
  { title: "Student Progress", href: "/dashboard/teacher/progress", icon: "📊" },
  { title: "Attendance", href: "/dashboard/teacher/attendance", icon: "📋" },
  { title: "Reports", href: "/dashboard/teacher/reports", icon: "📈" },
]

interface Student {
  id: string
  name: string
  rollNo: string
  status: 'present' | 'absent' | 'pending'
}

type AttendanceSession = {
  courseId: string
  batchId: string
  date: string
  students: Student[]
}

export default function AttendancePage() {
  const router = useRouter()

  // States
  const [activeTab, setActiveTab] = useState("mark")
  const [selectedCourse, setSelectedCourse] = useState("web-dev")
  const [selectedBatch, setSelectedBatch] = useState("batch-a")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // Mock Data for Initial State
  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "Alex Johnson", rollNo: "WEB001", status: "pending" },
    { id: "2", name: "Sarah Smith", rollNo: "WEB002", status: "pending" },
    { id: "3", name: "Mike Tyson", rollNo: "WEB003", status: "pending" },
    { id: "4", name: "Emily Watson", rollNo: "WEB004", status: "pending" },
    { id: "5", name: "David Miller", rollNo: "WEB005", status: "pending" },
  ])

  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  // Real-time Auto Save Simulation
  useEffect(() => {
    if (students.some(s => s.status !== 'pending')) {
      setIsAutoSaving(true)
      const timer = setTimeout(() => {
        setLastSaved(new Date())
        setIsAutoSaving(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [students])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setUploadedFile(file)
        // Define a basic CSV parser here (mocking content for now)
        const reader = new FileReader()
        reader.onload = (event) => {
          // In a real app, parse event.target.result
          toast.success("Student list imported successfully")
          // Mocking a new list appearing from the 'file'
          setStudents([
            ...students,
            { id: "6", name: "New Student 1", rollNo: "WEB006", status: "pending" },
            { id: "7", name: "New Student 2", rollNo: "WEB007", status: "pending" },
          ])
        }
        reader.readAsText(file)
      } else {
        toast.error("Please upload a CSV file.")
      }
    }
  }

  const markAttendance = (id: string, status: 'present' | 'absent') => {
    setStudents(prev => prev.map(s =>
      s.id === id ? { ...s, status } : s
    ))
  }

  const markAll = (status: 'present' | 'absent') => {
    setStudents(prev => prev.map(s => ({ ...s, status })))
  }

  const getStats = () => {
    const present = students.filter(s => s.status === 'present').length
    const absent = students.filter(s => s.status === 'absent').length
    const pending = students.filter(s => s.status === 'pending').length
    return { present, absent, pending, total: students.length }
  }

  const stats = getStats()

  const generateReport = () => {
    toast.success("Attendance report generated and downloaded.")
  }

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
        <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderNav userName="Dr. Sarah Johnson" userRole="Teacher" onLogout={() => router.push("/login")} />

        <main className="flex-1 overflow-auto bg-muted/20">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Attendance Management</h1>
                <p className="text-muted-foreground">Manage daily attendance and view records</p>
              </div>
              <Button variant="outline" onClick={generateReport}>
                <Download className="w-4 h-4 mr-2" /> Download Report
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="w-full max-w-[400px] grid grid-cols-2">
                <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
                <TabsTrigger value="records">History & Reports</TabsTrigger>
              </TabsList>

              {/* --- MARK ATTENDANCE TAB --- */}
              <TabsContent value="mark" className="space-y-6">
                {/* Filters & Tools */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-end">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
                        <div className="space-y-2">
                          <Label>Course / Class</Label>
                          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="web-dev">Web Development</SelectItem>
                              <SelectItem value="data-struct">Data Structures</SelectItem>
                              <SelectItem value="dbms">DBMS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Batch / Section</Label>
                          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="batch-a">Batch A</SelectItem>
                              <SelectItem value="batch-b">Batch B</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="date"
                              className="pl-9"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-auto flex gap-2">
                        <div className="relative">
                          <input
                            id="csv-upload"
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          <Button variant="secondary" className="w-full" onClick={() => document.getElementById('csv-upload')?.click()}>
                            <FileSpreadsheet className="w-4 h-4 mr-2" /> Import CSV
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Header */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Total Students</p>
                        <p className="text-2xl font-bold text-primary">{stats.total}</p>
                      </div>
                      <Users className="w-8 h-8 text-primary/40" />
                    </CardContent>
                  </Card>
                  <Card className="bg-green-500/5 border-green-500/20">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Present</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.present}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600/40" />
                    </CardContent>
                  </Card>
                  <Card className="bg-red-500/5 border-red-500/20">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Absent</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.absent}</p>
                      </div>
                      <XCircle className="w-8 h-8 text-red-600/40" />
                    </CardContent>
                  </Card>
                  <Card className="flex items-center justify-center bg-muted/40 text-muted-foreground text-sm p-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        {isAutoSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{isAutoSaving ? "Saving..." : "Auto-Saved"}</span>
                      </div>
                      <span className="text-xs opacity-70">Last saved: {lastSaved ? lastSaved.toLocaleTimeString() : 'Just now'}</span>
                    </div>
                  </Card>
                </div>

                {/* Marking List */}
                <Card>
                  <CardHeader className="bg-muted/20 border-b pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Student List</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-100" onClick={() => markAll('present')}>
                          Mark All Present
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-100" onClick={() => markAll('absent')}>
                          Mark All Absent
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <div className="divide-y">
                    {students.map((student) => (
                      <div key={student.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-base">{student.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {student.rollNo}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => markAttendance(student.id, 'present')}
                            className={`
                                                flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 touch-manipulation
                                                ${student.status === 'present'
                                ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/40 dark:text-green-300 scale-105 shadow-sm'
                                : 'bg-background border-border text-muted-foreground hover:border-green-300 hover:bg-green-50'
                              }
                                            `}
                          >
                            <CheckCircle className={`w-5 h-5 ${student.status === 'present' ? 'fill-current' : ''}`} />
                            <span>Present</span>
                          </button>

                          <button
                            onClick={() => markAttendance(student.id, 'absent')}
                            className={`
                                                flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 touch-manipulation
                                                ${student.status === 'absent'
                                ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/40 dark:text-red-300 scale-105 shadow-sm'
                                : 'bg-background border-border text-muted-foreground hover:border-red-300 hover:bg-red-50'
                              }
                                            `}
                          >
                            <XCircle className={`w-5 h-5 ${student.status === 'absent' ? 'fill-current' : ''}`} />
                            <span>Absent</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    {students.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        <p>No students found for this batch.</p>
                        <Button variant="link" onClick={() => document.getElementById('csv-upload')?.click()}>Import Student List</Button>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/** --- HISTORY TAB --- **/}
              <TabsContent value="records">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance History</CardTitle>
                    <CardDescription>View past attendance records and reports.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead>Present</TableHead>
                            <TableHead>Absent</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { date: '2024-03-10', course: 'Web Development', batch: 'Batch A', present: 45, absent: 2, status: 'Submitted' },
                            { date: '2024-03-09', course: 'Web Development', batch: 'Batch A', present: 44, absent: 3, status: 'Submitted' },
                            { date: '2024-03-08', course: 'Web Development', batch: 'Batch A', present: 47, absent: 0, status: 'Submitted' },
                          ].map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>{row.date}</TableCell>
                              <TableCell>{row.course}</TableCell>
                              <TableCell>{row.batch}</TableCell>
                              <TableCell className="text-green-600 font-medium">{row.present}</TableCell>
                              <TableCell className="text-red-600 font-medium">{row.absent}</TableCell>
                              <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{row.status}</Badge></TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">View</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
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
