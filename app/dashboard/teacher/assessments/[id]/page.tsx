"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Download, ExternalLink, CheckCircle, XCircle, FileText } from "lucide-react"
import { toast } from "sonner"
import { useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/teacher", icon: "" },
    { title: "My Courses", href: "/dashboard/teacher/courses", icon: "" },
    { title: "Assessments", href: "/dashboard/teacher/assessments", icon: "" },
    { title: "Student Progress", href: "/dashboard/teacher/progress", icon: "" },
    { title: "Attendance", href: "/dashboard/teacher/attendance", icon: "" },
    { title: "Reports", href: "/dashboard/teacher/reports", icon: "" },
]

interface Submission {
    id: string
    studentName: string
    rollNo: string
    submittedAt: string
    status: 'pending' | 'graded'
    score?: number
    maxScore: number
    answers: {
        questionId: string
        question: string
        answer: string
        isCorrect?: boolean | null // null for subjective
        marksAwarded?: number
        maxMarks: number
        type: 'mcq' | 'subjective'
    }[]
}

export default function AssessmentReviewPage() {
    const router = useRouter()
    const params = useParams()
    const { data: session } = useSession()
    const assessmentId = params.id as string

    const [loading, setLoading] = useState(true)
    const [assessment, setAssessment] = useState<any>(null)
    const [submissionsData, setSubmissionsData] = useState<any[]>([])
    const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null)
    const [feedback, setFeedback] = useState("")
    const [gradingScore, setGradingScore] = useState<number>(0)

    const fetchData = useCallback(async () => {
        if (!assessmentId) return
        try {
            setLoading(true)
            // 1. Try to Fetch Assessment Details
            let res = await fetch(`/api/assessments/${assessmentId}`)
            let data = await res.json()

            // If not found in assessments, try assignments
            if (!data.success) {
                res = await fetch(`/api/assignments/${assessmentId}`)
                data = await res.json()
            }

            if (data.success) {
                setAssessment(data.data)

                // 2. Fetch Submissions (Assignments) or Results (Quizzes)
                const isAssessmentResult = ['quiz', 'test', 'exam'].includes(data.data.type)
                const endpoint = isAssessmentResult
                    ? `/api/assessment-results?assessmentId=${assessmentId}`
                    : `/api/submissions?assignmentId=${assessmentId}`

                const subRes = await fetch(endpoint)
                const subJson = await subRes.json()

                if (subJson.success) {
                    const mapped = subJson.data.map((s: any) => ({
                        id: s._id,
                        studentName: s.student?.name || "Unknown Student",
                        rollNo: s.student?._id?.toString().substring(0, 8) || "N/A",
                        submittedAt: new Date(s.createdAt || s.attemptedAt).toLocaleString(),
                        status: s.status === 'graded' || s.status === 'passed' || s.status === 'failed' ? 'graded' : 'pending',
                        score: s.score || s.grade,
                        maxScore: s.totalMarks || (data.data.questions?.length * 10) || 100,
                        answers: s.answers || [],
                        feedback: s.feedback,
                        fileUrl: s.fileUrl
                    }))
                    setSubmissionsData(mapped)
                    if (mapped.length > 0) setActiveSubmissionId(mapped[0].id)
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("Failed to load submission data")
        } finally {
            setLoading(false)
        }
    }, [assessmentId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const activeSubmission = submissionsData.find(s => s.id === activeSubmissionId)

    const handleUpdateMarks = (qIndex: number, marks: number) => {
        console.log(`Updated Marks for Q${qIndex}: ${marks}`)
    }

    const submitGrade = async () => {
        if (!activeSubmissionId) return
        try {
            // Logic to submit grade to API
            toast.success("Grades submitted successfully")
        } catch (error) {
            toast.error("Failed to submit grades")
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
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="bg-background border-b p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/teacher/assessments")}>
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <div>
                                    <h1 className="text-xl font-bold">
                                        {loading ? <Skeleton className="h-6 w-48" /> : `Assessment Review: ${assessment?.title || "Loading..."}`}
                                    </h1>
                                    <p className="text-xs text-muted-foreground">{submissionsData.length} Submissions</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-2" /> Export Grades
                                </Button>
                            </div>
                        </div>

                        {/* Content Split */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Student List Sidebar */}
                            <div className="w-80 border-r bg-background overflow-y-auto">
                                <div className="p-3 border-b bg-muted/10">
                                    <Input placeholder="Search students..." className="h-8" />
                                </div>
                                <div className="divide-y">
                                    {loading ? (
                                        [1, 2, 3].map(i => (
                                            <div key={i} className="p-4 space-y-2">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-3 w-1/2" />
                                            </div>
                                        ))
                                    ) : submissionsData.length === 0 ? (
                                        <div className="p-8 text-center text-sm text-muted-foreground">
                                            No submissions yet
                                        </div>
                                    ) : (
                                        submissionsData.map((sub: any) => (
                                            <div
                                                key={sub.id}
                                                onClick={() => setActiveSubmissionId(sub.id)}
                                                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${activeSubmissionId === sub.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                                            >
                                                <div className="flex items-start justify-between mb-1">
                                                    <span className="font-semibold text-sm">{sub.studentName}</span>
                                                    {sub.status === 'graded' ? (
                                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px]">
                                                            {sub.score}/{sub.maxScore}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 text-[10px]">Pending</Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{sub.rollNo}</p>
                                                <p className="text-[10px] text-muted-foreground mt-2">Submitted {sub.submittedAt}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Grading Area */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {activeSubmission ? (
                                    <div className="max-w-3xl mx-auto space-y-6">
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeSubmission.studentName}`} />
                                                        <AvatarFallback>{activeSubmission.studentName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <CardTitle className="text-base">{activeSubmission.studentName}</CardTitle>
                                                        <CardDescription>{activeSubmission.rollNo}</CardDescription>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium">Total Score</div>
                                                    <div className="text-2xl font-bold text-primary">
                                                        {activeSubmission.status === 'graded' ? activeSubmission.score : '--'} <span className="text-sm text-muted-foreground font-normal">/ {activeSubmission.maxScore}</span>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>

                                        <div className="space-y-4">
                                            {activeSubmission.answers.map((ans: any, idx: number) => (
                                                <Card key={idx}>
                                                    <CardHeader className="py-3 bg-muted/30">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="font-medium text-sm">
                                                                <span className="text-muted-foreground mr-2">Q{idx + 1}.</span>
                                                                {ans.question}
                                                            </div>
                                                            <Badge variant="secondary" className="whitespace-nowrap">
                                                                {ans.maxMarks} Marks
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="py-4">
                                                        <div className="mb-4">
                                                            <p className="text-sm font-semibold mb-1 text-muted-foreground">Student Answer:</p>
                                                            <div className="p-3 bg-muted/20 rounded-md text-sm">
                                                                {ans.answer}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 border-t pt-4">
                                                            <div className="flex-1">
                                                                <Label className="text-xs">Marks Awarded</Label>
                                                                <Input
                                                                    type="number"
                                                                    className="w-24 mt-1"
                                                                    defaultValue={ans.marksAwarded}
                                                                    max={ans.maxMarks}
                                                                    min={0}
                                                                />
                                                            </div>
                                                            {ans.type === 'mcq' && (
                                                                <div className="flex items-center gap-2 mt-4">
                                                                    {ans.isCorrect ? (
                                                                        <span className="flex items-center text-green-600 text-sm font-medium"><CheckCircle className="w-4 h-4 mr-1" /> Correct</span>
                                                                    ) : (
                                                                        <span className="flex items-center text-red-600 text-sm font-medium"><XCircle className="w-4 h-4 mr-1" /> Incorrect</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}

                                            {activeSubmission.fileUrl && (
                                                <Card>
                                                    <CardHeader className="py-4">
                                                        <CardTitle className="text-sm">Submitted File</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="pb-4">
                                                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                                                            <div className="flex items-center gap-3">
                                                                <FileText className="w-8 h-8 text-primary" />
                                                                <div>
                                                                    <p className="text-sm font-medium">{activeSubmission.fileUrl.split('/').pop()}</p>
                                                                    <p className="text-xs text-muted-foreground">Click to download and review</p>
                                                                </div>
                                                            </div>
                                                            <Button size="sm" onClick={() => {
                                                                const url = activeSubmission.fileUrl;
                                                                if (url.startsWith('data:')) {
                                                                    const a = document.createElement('a');
                                                                    a.href = url;
                                                                    // Guess extension or default to .bin
                                                                    let startExt = "file";
                                                                    if (url.includes('application/pdf')) startExt += ".pdf";
                                                                    else if (url.includes('image/')) startExt += ".jpg";
                                                                    else if (url.includes('zip')) startExt += ".zip";

                                                                    a.download = `submission_${activeSubmission.studentName.replace(/\s+/g, '_')}_${activeSubmission.rollNo}_${startExt}`;
                                                                    document.body.appendChild(a);
                                                                    a.click();
                                                                    document.body.removeChild(a);
                                                                } else {
                                                                    const fullUrl = url.startsWith('http')
                                                                        ? url
                                                                        : `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
                                                                    window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                }
                                                            }}>
                                                                <Download className="w-4 h-4 mr-2" /> Download
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}

                                            {activeSubmission.answers.length === 0 && !activeSubmission.fileUrl && (
                                                <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                                                    No answers or files found for this submission.
                                                </div>
                                            )}
                                        </div>

                                        <Card className="border-primary/20 bg-primary/5">
                                            <CardContent className="p-4 space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Overall Feedback</Label>
                                                    <Textarea
                                                        placeholder="Write feedback for the student..."
                                                        value={feedback}
                                                        onChange={(e) => setFeedback(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-3">
                                                    <Button variant="outline">Save Draft</Button>
                                                    <Button onClick={submitGrade}>Submit Grade</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">
                                        Select a submission to review
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
