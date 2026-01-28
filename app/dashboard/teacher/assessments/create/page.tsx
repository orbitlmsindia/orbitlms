"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ChevronLeft, Plus, Trash2, Calendar, Clock, Save, Upload, FileText } from "lucide-react"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/teacher", icon: "" },
    { title: "My Courses", href: "/dashboard/teacher/courses", icon: "" },
    { title: "Assessments", href: "/dashboard/teacher/assessments", icon: "" },
    { title: "Student Progress", href: "/dashboard/teacher/progress", icon: "" },
    { title: "Attendance", href: "/dashboard/teacher/attendance", icon: "" },
    { title: "Reports", href: "/dashboard/teacher/reports", icon: "" },
]

interface Question {
    id: string
    text: string
    type: "mcq" | "subjective" | "coding"
    marks: number
    options?: string[] // for mcq
    correctAnswer?: string // for mcq
}

interface Course {
    _id: string
    title: string
}

export default function CreateAssessmentPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const isEditing = !!searchParams.get("id")

    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState<Course[]>([])
    const [mode, setMode] = useState<"quiz" | "assignment">("quiz")

    // Details
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [selectedCourse, setSelectedCourse] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [duration, setDuration] = useState(60)

    const [questions, setQuestions] = useState<Question[]>([
        { id: "1", text: "", type: "mcq", marks: 5, options: ["", "", "", ""], correctAnswer: "0" }
    ])

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/courses')
                const data = await res.json()
                if (data.success) setCourses(data.data)
            } catch (error) {
                console.error("Failed to fetch courses")
            }
        }
        fetchCourses()
    }, [])

    const addQuestion = () => {
        setQuestions([...questions, {
            id: Date.now().toString(),
            text: "",
            type: "mcq",
            marks: 5,
            options: ["", "", "", ""],
            correctAnswer: "0"
        }])
    }

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id))
    }

    const updateQuestion = (id: string, field: keyof Question, value: any) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q))
    }

    useEffect(() => {
        if (!isEditing) return;

        const quizId = searchParams.get("id");
        if (!quizId) return;

        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/assessments/${quizId}`);
                const json = await res.json();

                if (json.success) {
                    const data = json.data;
                    setTitle(data.title);
                    setMode(data.type === 'assignment' ? 'assignment' : 'quiz'); // Assuming type maps mostly to quiz, handling valid types
                    if (data.description) setDescription(data.description);
                    if (data.course) setSelectedCourse(data.course.title || data.course); // Handle populated or raw ID, preferably Title now that we use Input
                    if (data.dueDate) setDueDate(new Date(data.dueDate).toISOString().split('T')[0]);
                    if (data.questions) setQuestions(data.questions.map((q: any) => ({
                        ...q,
                        id: q._id || q.id || `q-${Math.random().toString(36).substr(2, 9)}`,
                        correctAnswer: q.correctAnswer?.toString() || "0"
                    })));
                    if (data.timeLimit || data.duration) setDuration(data.timeLimit || data.duration);

                    // If type is not basic quiz, handle assignment specific if needed
                    // But 'mode' state handles UI toggle.
                } else {
                    toast.error("Failed to load quiz details");
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
                toast.error("Error loading quiz");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [isEditing, searchParams]);

    const handlePublish = async () => {
        if (!title || !selectedCourse || !dueDate) {
            toast.error("Please fill in all required fields (Title, Course, Due Date)")
            return
        }

        setLoading(true)
        try {
            const endpoint = isEditing ? `/api/assessments/${searchParams.get("id")}` : (mode === 'quiz' ? '/api/assessments' : '/api/assignments')
            const method = isEditing ? 'PUT' : 'POST'

            // Standardize payload
            const payload: any = {
                title,
                course: courses.find(c => c.title === selectedCourse)?._id || selectedCourse, // Send ID if matches known course, else Title
                type: mode === 'assignment' ? 'assignment' : 'quiz', // Simplified mapping based on UI mode
                dueDate: new Date(dueDate).toISOString(),
                description, // Add description for both
                status: 'published' // Ensure published as per requirements
            }

            if (mode === 'quiz') {
                payload.questions = questions.map(q => ({
                    text: q.text,
                    options: q.options,
                    correctAnswer: parseInt(q.correctAnswer || "0"),
                    type: q.type,
                    marks: q.marks
                }));
                payload.timeLimit = duration;
                payload.duration = duration; // Sync
            } else {
                // Assignment specific extra fields if any
            }

            if (!isEditing) {
                // Add teacher ID only on create if not handled by session consistency in backend, 
                // but backend overwrites it from session usually.
                payload.teacher = (session?.user as any).id
            }

            const res = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await res.json()
            if (result.success) {
                toast.success(`${mode === 'quiz' ? 'Assessment' : 'Assignment'} ${isEditing ? 'updated' : 'published'} successfully!`)
                router.push("/dashboard/teacher/assessments")
            } else {
                toast.error(result.error || "Failed to save")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
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
                    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{isEditing ? "Edit Assessment" : "Create New Assessment"}</h1>
                                <p className="text-muted-foreground text-sm">Configure assessment details and questions</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Assessment Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Assessment Type</Label>
                                            <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="quiz">Quiz / Exam</TabsTrigger>
                                                    <TabsTrigger value="assignment">Assignment (File upload)</TabsTrigger>
                                                </TabsList>
                                            </Tabs>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input
                                                placeholder={mode === 'quiz' ? "e.g. Mid-term Quiz" : "e.g. Project Phase 1"}
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description / Instructions</Label>
                                            <Textarea
                                                placeholder="Instructions for students..."
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>File Attachments (Optional)</Label>
                                            <div className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50">
                                                <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                                                <span className="text-xs text-muted-foreground">Upload Reference Material</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {mode === 'quiz' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold">Questions ({questions.length})</h2>
                                            <Button variant="outline" size="sm" onClick={addQuestion}>
                                                <Plus className="w-4 h-4 mr-2" /> Add Question
                                            </Button>
                                        </div>

                                        {questions.map((q, idx) => (
                                            <Card key={q.id}>
                                                <CardHeader className="py-4 bg-muted/30 flex flex-row items-center justify-between">
                                                    <span className="font-semibold text-sm">Question {idx + 1}</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeQuestion(q.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </CardHeader>
                                                <CardContent className="p-4 space-y-4">
                                                    <div className="flex gap-4">
                                                        <div className="flex-1 space-y-2">
                                                            <Label>Question Text</Label>
                                                            <Textarea
                                                                value={q.text}
                                                                onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                                                                placeholder="Type your question here..."
                                                            />
                                                        </div>
                                                        <div className="w-[150px] space-y-2">
                                                            <Label>Type</Label>
                                                            <Select
                                                                value={q.type}
                                                                onValueChange={(v) => updateQuestion(q.id, 'type', v)}
                                                            >
                                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="mcq">MCQ</SelectItem>
                                                                    <SelectItem value="subjective">Subjective</SelectItem>
                                                                    <SelectItem value="coding">Coding</SelectItem>
                                                                </SelectContent>
                                                            </Select>

                                                            <div className="space-y-1 mt-2">
                                                                <Label className="text-xs">Marks</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={q.marks}
                                                                    onChange={(e) => updateQuestion(q.id, 'marks', parseInt(e.target.value))}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {q.type === 'mcq' && (
                                                        <div className="space-y-3 pl-4 border-l-2">
                                                            <Label className="text-xs text-muted-foreground">Options (Select correct answer)</Label>
                                                            <RadioGroup
                                                                value={q.correctAnswer || ""}
                                                                onValueChange={(val) => updateQuestion(q.id, 'correctAnswer', val)}
                                                            >
                                                                {q.options?.map((opt, oIdx) => (
                                                                    <div key={oIdx} className="flex items-center gap-2 mb-2">
                                                                        <RadioGroupItem value={oIdx.toString()} id={`q${q.id}-opt${oIdx}`} />
                                                                        <Input
                                                                            className="h-8"
                                                                            placeholder={`Option ${oIdx + 1}`}
                                                                            value={opt || ""}
                                                                            onChange={(e) => {
                                                                                const newOpts = [...(q.options || [])];
                                                                                newOpts[oIdx] = e.target.value;
                                                                                updateQuestion(q.id, 'options', newOpts);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </RadioGroup>
                                                        </div>
                                                    )}

                                                    {q.type === 'coding' && (
                                                        <div className="p-3 bg-muted rounded-md text-xs font-mono text-muted-foreground">
                                                            Students will see a code editor for this question.
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                                {mode === 'assignment' && (
                                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center space-y-4">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                            <FileText className="w-8 h-8 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold">Assignment Mode</h3>
                                        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                            In this mode, students will be asked to upload files (PDF, ZIP, etc.) in response to your instructions. No individual questions are needed.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Settings */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Subject / Course</Label>
                                            <div className="relative">
                                                <div className="relative">
                                                    <Input
                                                        value={selectedCourse}
                                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                                        placeholder="Select or type a course name..."
                                                        className="w-full pr-10"
                                                        list="course-options"
                                                        autoComplete="off"
                                                    />
                                                    {courses.length > 0 && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
                                                            <ChevronLeft className="w-4 h-4 rotate-270" style={{ transform: 'rotate(-90deg)' }} />
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Built-in browser datalist for accessibility and simple behavior since standard Select is strict */}
                                                <datalist id="course-options">
                                                    {courses.map(c => (
                                                        <option key={c._id} value={c.title} />
                                                    ))}
                                                </datalist>
                                                {/* 
                                                    Note: Using datalist is the simplest way to support "Select OR Type" 
                                                    without introducing complex Combobox components that might break the "No UI Change" rule 
                                                    by looking different or requiring new deps.
                                                    However, datalist saves the VALUE (Title), not the ID.
                                                    We need to handle the ID mapping in the backend or lookup.
                                                 */}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Total Marks</Label>
                                            <div className="text-2xl font-bold">{mode === 'quiz' ? questions.reduce((a, b) => a + (b.marks || 0), 0) : 100}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Due Date</Label>
                                            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                                        </div>
                                        {mode === 'quiz' && (
                                            <div className="space-y-2">
                                                <Label>Time Limit (Minutes)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 60"
                                                    value={duration}
                                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                                />
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-2 border-t pt-4">
                                        <Button className="w-full" onClick={handlePublish} disabled={loading}>
                                            {loading ? "Publishing..." : "Publish Assessment"}
                                        </Button>
                                        <Button variant="outline" className="w-full">Save Draft</Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
