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
import { ChevronLeft, Plus, Trash2, Calendar, Clock, Save, Upload } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/teacher", icon: "🏠" },
    { title: "My Courses", href: "/dashboard/teacher/courses", icon: "📚" },
    { title: "Assessments", href: "/dashboard/teacher/assessments", icon: "✍️" },
    { title: "Student Progress", href: "/dashboard/teacher/progress", icon: "📊" },
    { title: "Attendance", href: "/dashboard/teacher/attendance", icon: "📋" },
    { title: "Reports", href: "/dashboard/teacher/reports", icon: "📈" },
]

interface Question {
    id: string
    text: string
    type: "mcq" | "subjective" | "coding"
    marks: number
    options?: string[] // for mcq
    correctAnswer?: string // for mcq
}

export default function CreateAssessmentPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const isEditing = !!searchParams.get("id")

    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([
        { id: "1", text: "", type: "mcq", marks: 5, options: ["", "", "", ""] }
    ])

    const addQuestion = () => {
        setQuestions([...questions, {
            id: Date.now().toString(),
            text: "",
            type: "mcq",
            marks: 5,
            options: ["", "", "", ""]
        }])
    }

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id))
    }

    const updateQuestion = (id: string, field: keyof Question, value: any) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q))
    }

    const handlePublish = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.success("Assessment published successfully!")
            router.push("/dashboard/teacher/assessments")
        }, 1500)
    }

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar">
                <div className="flex items-center gap-2 px-4 py-6 border-b border-sidebar-border">
                    <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold">E</div>
                    <span className="text-lg font-bold text-sidebar-foreground">EduHub</span>
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav userName="Dr. Sarah Johnson" userRole="Teacher" onLogout={() => router.push("/login")} />

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
                                            <Label>Title</Label>
                                            <Input placeholder="e.g. Mid-term Exam" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea placeholder="Instructions for students..." />
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
                                                                        value={opt}
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
                                            <Select>
                                                <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="web">Web Development</SelectItem>
                                                    <SelectItem value="app">App Development</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Total Marks</Label>
                                            <div className="text-2xl font-bold">{questions.reduce((a, b) => a + (b.marks || 0), 0)}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Due Date</Label>
                                            <Input type="date" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Time Limit (Minutes)</Label>
                                            <Input type="number" placeholder="e.g. 60" />
                                        </div>
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
