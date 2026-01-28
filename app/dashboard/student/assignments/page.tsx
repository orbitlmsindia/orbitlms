"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Upload, FileText, CheckCircle, Clock, AlertCircle, X, File as FileIcon, Download, RefreshCw, Search } from "lucide-react"
import { cn } from "@/lib/utils"

// Sidebar items with the new Assignments module


interface Assignment {
    id: string
    title: string
    course: string
    dueDate: string
    status: 'pending' | 'submitted' | 'reviewed' | 'graded'
    instructions: string
    maxMarks: number
    marks?: number
    teacherComments?: string
    submittedFile?: { name: string, size: string, date: string }
}

const mockAssignments: Assignment[] = [
    {
        id: "1",
        title: "Responsive Web Layout",
        course: "Introduction to Web Development",
        dueDate: "2024-03-15T23:59:00",
        status: 'pending',
        instructions: "Create a fully responsive web page using HTML5 and CSS3 Grid/Flexbox. The layout should support Desktop, Tablet, and Mobile views. Submit your functionality in a zip file containing index.html and style.css.",
        maxMarks: 100
    },
    {
        id: "2",
        title: "JavaScript DOM Manipulation",
        course: "Advanced JavaScript",
        dueDate: "2024-03-10T23:59:00",
        status: 'submitted',
        instructions: "Implement a to-do list application where users can add, delete, and mark items as complete. Use local storage to persist data.",
        maxMarks: 50,
        submittedFile: { name: "todo-app.zip", size: "2.4 MB", date: "2024-03-09T14:30:00" }
    },
    {
        id: "3",
        title: "User Persona Research",
        course: "UI/UX Design Principles",
        dueDate: "2024-03-01T23:59:00",
        status: 'graded',
        instructions: "Conduct user research and create 3 distinct user personas for the proposed e-commerce app. Submit as a PDF.",
        maxMarks: 50,
        marks: 45,
        teacherComments: "Excellent work on the personas! Very detailed and realistic. The visuals are also top-notch.",
        submittedFile: { name: "personas.pdf", size: "4.1 MB", date: "2024-02-28T10:15:00" }
    },
    {
        id: "4",
        title: "Database Schema Design",
        course: "Data Science Fundamentals",
        dueDate: "2024-03-20T23:59:00",
        status: 'pending',
        instructions: "Design a relational database schema for a library management system. Include ER diagrams and SQL create scripts.",
        maxMarks: 100
    }
]

import { useSession } from "next-auth/react"
import { useCallback, useEffect } from "react"

export default function AssignmentsPage() {
    const { data: session } = useSession()
    const user = session?.user as any
    const router = useRouter()
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [uploadFile, setUploadFile] = useState<File | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [pendingQuizCount, setPendingQuizCount] = useState<number | undefined>(undefined)

    const sidebarItems = [
        { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
        { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
        { title: "Assignments", href: "/dashboard/student/assignments", icon: "📋" },
        { title: "Quizzes", href: "/dashboard/student/assessments", icon: "✍️", badge: pendingQuizCount },
        { title: "Gamification", href: "/dashboard/student/gamification", icon: "🎮" },
        { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },
    ]

    const fetchAssignmentsData = useCallback(async () => {
        if (!user?.id) return

        try {
            setLoading(true)

            // 1. Fetch Student Enrollments & Dashboard Stats (for sidebar badge)
            const [enrollRes, dashboardRes] = await Promise.all([
                fetch(`/api/enrollments?studentId=${user.id}`),
                fetch(`/api/student/${user.id}/dashboard`)
            ]);

            const enrollResult = await enrollRes.json();
            const dashboardResult = await dashboardRes.json();

            if (dashboardResult.success && dashboardResult.data?.stats) {
                setPendingQuizCount(dashboardResult.data.stats.pendingQuizzesCount || undefined);
            }

            let enrolledCourseIds: string[] = [];
            if (enrollResult.success && enrollResult.data) {
                enrolledCourseIds = enrollResult.data.map((e: any) => e.course?._id || e.course);
            }

            // 2. Fetch Assignments and Submissions
            const [assignRes, subRes] = await Promise.all([
                fetch('/api/assignments'), // Fetch all, then filter. Ideally Backend filters.
                fetch(`/api/submissions?studentId=${user.id}`)
            ]);

            const assignResult = await assignRes.json();
            const subResult = await subRes.json();

            if (assignResult.success && subResult.success) {
                const submissions = subResult.data || [];
                let allAssignments = assignResult.data || [];

                // Client-side enrollment filtering removed. 
                // We display ALL assignments for the student's Institute (as returned by the API).

                /* 
                // Filter assignments by enrolled courses
                if (enrolledCourseIds.length > 0) {
                    allAssignments = allAssignments.filter((a: any) => {
                        const courseId = a.course?._id || a.course;
                        return enrolledCourseIds.includes(courseId);
                    });
                } else {
                    allAssignments = [];
                }
                */

                const mappedAssignments = allAssignments.map((a: any) => {
                    // Robust ID matching handling both string and object formats
                    const submission = submissions.find((s: any) => {
                        const assignmentId = s.assignment?._id || s.assignment
                        return String(assignmentId) === String(a._id)
                    })

                    return {
                        id: a._id,
                        title: a.title,
                        course: a.course?.title || "Unknown Course",
                        dueDate: a.dueDate,
                        // If submission exists, status is submitted (unless graded), otherwise pending
                        status: submission ? (submission.status === 'graded' ? 'graded' : 'submitted') : 'pending',
                        instructions: a.description || "No instructions provided.",
                        maxMarks: a.maxMarks || 100, // Handle missing maxMarks
                        marks: submission?.grade,
                        teacherComments: submission?.feedback,
                        // Handle submission file details
                        submittedFile: submission ? {
                            name: submission.fileUrl?.split('/').pop() || "submission.file",
                            size: "N/A",
                            date: submission.createdAt
                        } : undefined
                    }
                })
                setAssignments(mappedAssignments)
            }
        } catch (error) {
            console.error("Error fetching assignments:", error)
            toast.error("Failed to load assignments")
        } finally {
            setLoading(false)
        }
    }, [user?.id])

    useEffect(() => {
        fetchAssignmentsData()
    }, [fetchAssignmentsData])

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = (file: File) => {
        // Validate file type
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/zip', 'image/jpeg', 'image/png']
        if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
            toast.error("Unsupported file format. Please upload PDF, DOCX, PPT, ZIP or Images.")
            return
        }
        // Validate file size (e.g. 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File is too large. Maximum size is 10MB.")
            return
        }

        setUploadFile(file)
        setUploadProgress(0)
    }

    const handleUpload = async () => {
        if (!uploadFile || !selectedAssignment || !user?.id) return
        setIsUploading(true)

        try {
            // In a real app, we would upload to S3/Cloudinary and get a URL
            // For now, we simulate a URL
            const simulatedUrl = `https://storage.eduhub.com/submissions/${uploadFile.name}`

            const res = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignment: selectedAssignment.id,
                    student: user.id,
                    fileUrl: simulatedUrl,
                    status: 'pending'
                })
            })

            const result = await res.json()
            if (result.success) {
                toast.success("Assignment submitted successfully!")

                try {
                    await fetch('/api/notifications', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user: user.id,
                            title: "Assignment Submitted",
                            message: `You have successfully submitted ${selectedAssignment.title}.`,
                            type: 'success'
                        })
                    })
                } catch (ignore) { }

                fetchAssignmentsData()
                setTimeout(() => {
                    setIsDialogOpen(false)
                    setUploadFile(null)
                    setUploadProgress(0)
                    setIsUploading(false)
                }, 1000)
            } else {
                toast.error(result.error || "Failed to submit assignment")
                setIsUploading(false)
            }
        } catch (error) {
            toast.error("An error occurred during submission")
            setIsUploading(false)
        }
    }

    const getStatusColor = (status: Assignment['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            case 'submitted': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'reviewed': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            case 'graded': return 'bg-green-500/10 text-green-500 border-green-500/20'
            default: return 'bg-gray-500/10 text-gray-500'
        }
    }

    const getStatusIcon = (status: Assignment['status']) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 mr-1" />
            case 'submitted': return <CheckCircle className="w-4 h-4 mr-1" />
            case 'graded': return <CheckCircle className="w-4 h-4 mr-1" />
            default: return <Clock className="w-4 h-4 mr-1" />
        }
    }

    const openAssignment = (assignment: Assignment) => {
        setSelectedAssignment(assignment)
        setUploadFile(null)
        setUploadProgress(0)
        setIsDialogOpen(true)
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar with Glassmorphism */}
            <aside className="hidden lg:flex flex-col w-72 border-r border-border/40 bg-sidebar/30 backdrop-blur-xl">
                <div className="flex items-center justify-center py-8 border-b border-sidebar-border/40 group cursor-pointer" onClick={() => router.push("/")}>
                    <img src="/logo.png" alt="Orbit" className="w-24 h-24 object-contain" />
                </div>
                <SidebarNav
                    items={sidebarItems}
                    onLogout={() => {
                        router.push("/login")
                    }}
                />
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav
                    userName={session?.user?.name || "Student"}
                    userRole="Student"
                    onLogout={() => {
                        router.push("/login")
                    }}
                />

                <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-primary/[0.02] to-background">
                    <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter mb-4 animate-in fade-in slide-in-from-left-4 duration-1000">Assignments</h1>
                                <p className="text-xl text-muted-foreground font-medium animate-in fade-in slide-in-from-left-4 duration-1000 delay-100">Deliver your best work and track your progress in real-time.</p>
                            </div>
                            <div className="relative w-full md:w-96 animate-in fade-in slide-in-from-right-4 duration-1000 delay-200">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search assignments or courses..."
                                    className="pl-12 h-14 rounded-2xl bg-card/50 backdrop-blur-md border-border/50 text-base"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="absolute top-0 right-0 hidden xl:block opacity-5 blur-[120px] pointer-events-none">
                                <div className="w-96 h-96 bg-primary rounded-full"></div>
                            </div>
                        </div>

                        <Tabs defaultValue="pending" className="w-full space-y-12">
                            <TabsList className="p-1.5 h-16 bg-muted/40 backdrop-blur-md rounded-[1.5rem] border border-border/40 w-fit">
                                <TabsTrigger value="pending" className="rounded-2xl px-12 font-black text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all h-full">Pending</TabsTrigger>
                                <TabsTrigger value="submitted" className="rounded-2xl px-12 font-black text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all h-full">Completed</TabsTrigger>
                            </TabsList>

                            <TabsContent value="pending" className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {loading ? (
                                        Array(3).fill(0).map((_, i) => (
                                            <Card key={i} className="rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-md h-[400px] animate-pulse">
                                                <CardContent className="p-10 space-y-4">
                                                    <div className="h-6 w-24 bg-muted rounded-full" />
                                                    <div className="h-10 w-full bg-muted rounded-xl" />
                                                    <div className="h-4 w-3/4 bg-muted rounded-lg" />
                                                    <div className="h-20 w-full bg-muted rounded-2xl" />
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <>
                                            {assignments
                                                .filter(a => a.status === 'pending')
                                                .filter(a =>
                                                    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    a.course.toLowerCase().includes(searchQuery.toLowerCase())
                                                )
                                                .map((assignment, i) => (
                                                    <Card
                                                        key={assignment.id}
                                                        className="group relative overflow-hidden border-border/40 bg-card/40 backdrop-blur-md hover:bg-card/60 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-3 transition-all duration-500 cursor-pointer rounded-[2.5rem]"
                                                        style={{ animationDelay: `${i * 100}ms` }}
                                                        onClick={() => openAssignment(assignment)}
                                                    >
                                                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-primary/10 transition-all"></div>
                                                        <CardHeader className="pb-4 pt-10 px-10">
                                                            <div className="flex justify-between items-center mb-8">
                                                                <Badge className={cn("px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-none shadow-sm", getStatusColor(assignment.status))}>
                                                                    {assignment.status}
                                                                </Badge>
                                                                <span className="text-[10px] font-black text-primary px-4 py-1.5 bg-primary/10 rounded-full uppercase tracking-widest border border-primary/20">
                                                                    {assignment.maxMarks} Marks
                                                                </span>
                                                            </div>
                                                            <CardTitle className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors pr-4 leading-tight">{assignment.title}</CardTitle>
                                                            <CardDescription className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest mt-2">{assignment.course}</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="px-10 pb-6">
                                                            <div className="flex items-center text-sm font-black text-destructive mb-8 bg-destructive/5 px-5 py-3 rounded-2xl border border-destructive/10 inline-flex">
                                                                <AlertCircle className="w-5 h-5 mr-3" />
                                                                Due {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                            </div>
                                                            <p className="text-muted-foreground/80 line-clamp-3 font-medium leading-relaxed text-lg">{assignment.instructions}</p>
                                                        </CardContent>
                                                        <CardFooter className="px-10 pb-10 pt-4">
                                                            <Button className="w-full h-14 rounded-2xl font-black text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all group/btn" variant="default">
                                                                Begin Task <span className="ml-3 group-hover/btn:translate-x-2 transition-transform">→</span>
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                ))}
                                            {assignments.filter(a => a.status === 'pending').length === 0 && !loading && (
                                                <div className="col-span-full py-32 text-center">
                                                    <div className="text-8xl mb-6 opacity-20">🎉</div>
                                                    <p className="text-2xl font-black text-muted-foreground tracking-tight">You're all caught up! Enjoy your free time.</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="submitted" className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {assignments
                                        .filter(a => a.status !== 'pending')
                                        .filter(a =>
                                            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            a.course.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((assignment, i) => (
                                            <Card
                                                key={assignment.id}
                                                className="group relative overflow-hidden border-border/40 bg-card/20 backdrop-blur-md hover:bg-card/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer rounded-[2.5rem]"
                                                style={{ animationDelay: `${i * 100}ms` }}
                                                onClick={() => openAssignment(assignment)}
                                            >
                                                <CardHeader className="pb-4 pt-10 px-10">
                                                    <div className="flex justify-between items-center mb-8">
                                                        <Badge className={cn("px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-none", getStatusColor(assignment.status))}>
                                                            {assignment.status}
                                                        </Badge>
                                                        {assignment.marks !== undefined && (
                                                            <div className="text-right">
                                                                <div className="text-3xl font-black text-primary tracking-tighter leading-none">{assignment.marks}</div>
                                                                <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest text-center mt-1">/ {assignment.maxMarks}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <CardTitle className="text-2xl font-black tracking-tight leading-tight">{assignment.title}</CardTitle>
                                                    <CardDescription className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mt-2">{assignment.course}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="px-10 pb-10">
                                                    <div className="flex items-center text-sm font-black text-muted-foreground/80 mb-8 bg-muted/30 px-5 py-3 rounded-2xl border border-border/40 inline-flex">
                                                        <CheckCircle className="w-5 h-5 mr-3 text-secondary" />
                                                        Graded on {new Date(assignment.submittedFile?.date || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </div>
                                                    {assignment.teacherComments && (
                                                        <div className="mt-4 bg-primary/[0.03] p-6 rounded-[2rem] text-sm font-bold italic border-l-4 border-primary/30 relative text-muted-foreground/90">
                                                            <span className="absolute -top-4 -left-2 text-6xl text-primary/10 opacity-50 font-serif">"</span>
                                                            {assignment.teacherComments}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{selectedAssignment?.title}</DialogTitle>
                        <DialogDescription>{selectedAssignment?.course}</DialogDescription>
                    </DialogHeader>

                    {selectedAssignment && (
                        <div className="space-y-6 py-4">
                            {/* Status & Dates */}
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="bg-muted px-3 py-1.5 rounded-md flex items-center">
                                    <span className="text-muted-foreground mr-2">Status:</span>
                                    <Badge variant="outline" className={getStatusColor(selectedAssignment.status) + " border-0"}>
                                        {selectedAssignment.status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="bg-muted px-3 py-1.5 rounded-md flex items-center">
                                    <span className="text-muted-foreground mr-2">Due Date:</span>
                                    <span className="font-medium">{new Date(selectedAssignment.dueDate).toLocaleString()}</span>
                                </div>
                                <div className="bg-muted px-3 py-1.5 rounded-md flex items-center">
                                    <span className="text-muted-foreground mr-2">Maixmum Marks:</span>
                                    <span className="font-medium">{selectedAssignment.maxMarks}</span>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center">
                                    <FileText className="w-4 h-4 mr-2" /> Instructions
                                </h3>
                                <div className="bg-muted/30 p-4 rounded-lg border border-border text-sm leading-relaxed">
                                    {selectedAssignment.instructions}
                                </div>
                            </div>

                            {/* Teacher Comments if Graded */}
                            {selectedAssignment.teacherComments && (
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center text-primary">
                                        Teacher Feedback
                                    </h3>
                                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-sm">
                                        <p className="italic text-foreground/90">{selectedAssignment.teacherComments}</p>
                                        <div className="mt-2 font-bold text-lg">
                                            Score: {selectedAssignment.marks} / {selectedAssignment.maxMarks}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submission Section */}
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center">
                                    <Upload className="w-4 h-4 mr-2" /> Submission
                                </h3>

                                {selectedAssignment.status === 'pending' || selectedAssignment.status === 'submitted' ? (
                                    <div className="space-y-4">
                                        {/* Drag & Drop Area */}
                                        {!uploadFile && !selectedAssignment.submittedFile && (
                                            <div
                                                className={cn(
                                                    "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                                                    dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"
                                                )}
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                                onClick={() => document.getElementById('file-upload')?.click()}
                                            >
                                                <input
                                                    id="file-upload"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleChange}
                                                    accept=".pdf,.docx,.ppt,.pptx,.zip,.jpg,.jpeg,.png"
                                                />
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                                    <Upload className="w-6 h-6 text-primary" />
                                                </div>
                                                <h4 className="font-medium mb-1">Click to upload or drag and drop</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    PDF, DOCX, PPT, ZIP, or Images (max. 10MB)
                                                </p>
                                            </div>
                                        )}

                                        {/* Selected File / Submitted File Preview */}
                                        {(uploadFile || selectedAssignment.submittedFile) && (
                                            <div className="border rounded-lg p-4 bg-muted/20">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center overflow-hidden">
                                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                                                            <FileIcon className="w-5 h-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-sm truncate">
                                                                {uploadFile ? uploadFile.name : selectedAssignment.submittedFile?.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {uploadFile ? `${(uploadFile.size / 1024 / 1024).toFixed(2)} MB` : selectedAssignment.submittedFile?.size}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {uploadFile && !isUploading && (
                                                        <Button variant="ghost" size="icon" onClick={() => { setUploadFile(null); setUploadProgress(0); }}>
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {selectedAssignment.submittedFile && !uploadFile && (
                                                        <Button variant="outline" size="sm">
                                                            <Download className="w-4 h-4 mr-2" /> Download
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* Progress Bar (Only when uploading) */}
                                                {uploadFile && (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs text-muted-foreground">
                                                            <span>{isUploading ? 'Uploading...' : 'Ready to submit'}</span>
                                                            <span>{uploadProgress}%</span>
                                                        </div>
                                                        <Progress value={uploadProgress} className="h-2" />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
                                            {uploadFile && (
                                                <Button onClick={handleUpload} disabled={isUploading}>
                                                    {isUploading ? (
                                                        <>
                                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        'Submit Assignment'
                                                    )}
                                                </Button>
                                            )}
                                            {!uploadFile && selectedAssignment.submittedFile && (
                                                <Button variant="outline" onClick={() => setUploadFile(null)}>
                                                    Update Submission
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-muted p-4 rounded-lg text-center text-muted-foreground text-sm">
                                        This assignment has been graded and is closed for submissions.
                                        {selectedAssignment.submittedFile && (
                                            <div className="mt-3 flex justify-center">
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <FileIcon className="w-4 h-4" />
                                                    {selectedAssignment.submittedFile.name}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
