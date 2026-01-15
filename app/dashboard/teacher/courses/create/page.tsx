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
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { ChevronLeft, Upload, Plus, Trash2, GripVertical, FileVideo, FileText, Globe, File, Image as ImageIcon, Save, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/teacher", icon: "🏠" },
    { title: "My Courses", href: "/dashboard/teacher/courses", icon: "📚" },
    { title: "Assessments", href: "/dashboard/teacher/assessments", icon: "✍️" },
    { title: "Student Progress", href: "/dashboard/teacher/progress", icon: "📊" },
    { title: "Attendance", href: "/dashboard/teacher/attendance", icon: "📋" },
    { title: "Reports", href: "/dashboard/teacher/reports", icon: "📈" },
]

type LessonType = 'video' | 'pdf' | 'document' | 'quiz'

interface Lesson {
    id: string
    title: string
    type: LessonType
    fileName?: string
    duration?: string
    isFree?: boolean
}

interface Chapter {
    id: string
    title: string
    lessons: Lesson[]
}

export default function CreateCoursePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const isEditing = !!searchParams.get("id")

    const [activeTab, setActiveTab] = useState("details")
    const [loading, setLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    // Course Details State
    const [courseDetails, setCourseDetails] = useState({
        title: isEditing ? "Web Development Basics" : "",
        description: isEditing ? "A comprehensive guide to HTML, CSS, and JS." : "",
        category: isEditing ? "development" : "",
        level: isEditing ? "beginner" : "",
        price: isEditing ? "0" : "",
    })

    // Curriculum State
    const [chapters, setChapters] = useState<Chapter[]>([
        {
            id: "1",
            title: "Introduction",
            lessons: [
                { id: "l1", title: "Course Overview", type: "video", fileName: "intro.mp4", duration: "2:30", isFree: true }
            ]
        }
    ])

    // Content Upload Helper
    const handleFileUpload = (chapterId: string, lessonId: string, file: File) => {
        // Simulate upload
        setUploadProgress(0)
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 10
            })
        }, 200)

        setTimeout(() => {
            setChapters(prev => prev.map(ch => {
                if (ch.id === chapterId) {
                    return {
                        ...ch,
                        lessons: ch.lessons.map(l => {
                            if (l.id === lessonId) {
                                return { ...l, fileName: file.name }
                            }
                            return l
                        })
                    }
                }
                return ch
            }))
            toast.success(`Uploaded ${file.name}`)
            setUploadProgress(0)
        }, 2500)
    }

    const addChapter = () => {
        setChapters([...chapters, { id: Date.now().toString(), title: "New Chapter", lessons: [] }])
    }

    const addLesson = (chapterId: string) => {
        setChapters(prev => prev.map(ch => {
            if (ch.id === chapterId) {
                return {
                    ...ch,
                    lessons: [...ch.lessons, { id: Date.now().toString(), title: "New Lesson", type: "video" }]
                }
            }
            return ch
        }))
    }

    const removeChapter = (id: string) => {
        setChapters(chapters.filter(c => c.id !== id))
    }

    const removeLesson = (chapterId: string, lessonId: string) => {
        setChapters(prev => prev.map(ch => {
            if (ch.id === chapterId) {
                return {
                    ...ch,
                    lessons: ch.lessons.filter(l => l.id !== lessonId)
                }
            }
            return ch
        }))
    }

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.success("Course saved successfully!")
            router.push("/dashboard/teacher/courses")
        }, 1000)
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar - Hidden on mobile */}
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
                    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">

                        {/* Header Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">{isEditing ? "Edit Course" : "Create New Course"}</h1>
                                    <p className="text-muted-foreground text-sm">Fill in the details to publish your course</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => router.push("/courses/1")}>
                                    <Eye className="w-4 h-4 mr-2" /> Preview
                                </Button>
                                <Button onClick={handleSave} disabled={loading}>
                                    <Save className="w-4 h-4 mr-2" /> {loading ? "Saving..." : "Save Course"}
                                </Button>
                            </div>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
                                <TabsTrigger value="details">Basic Details</TabsTrigger>
                                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>

                            {/* --- DETAILS TAB --- */}
                            <TabsContent value="details">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Course Information</CardTitle>
                                        <CardDescription>The basic information your students will see.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Course Title</Label>
                                            <Input
                                                id="title"
                                                placeholder="e.g. Master Web Development"
                                                value={courseDetails.title}
                                                onChange={(e) => setCourseDetails({ ...courseDetails, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="desc">Description</Label>
                                            <Textarea
                                                id="desc"
                                                placeholder="What will students learn in this course?"
                                                className="min-h-[150px]"
                                                value={courseDetails.description}
                                                onChange={(e) => setCourseDetails({ ...courseDetails, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Category</Label>
                                                <Select value={courseDetails.category} onValueChange={(v) => setCourseDetails({ ...courseDetails, category: v })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="development">Web Development</SelectItem>
                                                        <SelectItem value="design">Design</SelectItem>
                                                        <SelectItem value="business">Business</SelectItem>
                                                        <SelectItem value="marketing">Marketing</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Level</Label>
                                                <Select value={courseDetails.level} onValueChange={(v) => setCourseDetails({ ...courseDetails, level: v })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="beginner">Beginner</SelectItem>
                                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="advanced">Advanced</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Course Thumbnail</Label>
                                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                                                        <ImageIcon className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <p className="font-medium text-sm">Click to upload or drag and drop</p>
                                                    <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                                </div>
                                                <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* --- CURRICULUM TAB --- */}
                            <TabsContent value="curriculum">
                                <div className="flex justify-end mb-4">
                                    <Button onClick={addChapter} variant="outline" className="border-dashed border-2">
                                        <Plus className="w-4 h-4 mr-2" /> Add Chapter
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {chapters.map((chapter, cIndex) => (
                                        <Card key={chapter.id} className="relative">
                                            <CardHeader className="py-4 bg-muted/20 border-b">
                                                <div className="flex items-center gap-3">
                                                    <div className="cursor-move text-muted-foreground"><GripVertical className="w-5 h-5" /></div>
                                                    <div className="flex-1">
                                                        <Input
                                                            value={chapter.title}
                                                            onChange={(e) => {
                                                                const newChapters = [...chapters];
                                                                newChapters[cIndex].title = e.target.value;
                                                                setChapters(newChapters);
                                                            }}
                                                            className="font-semibold text-lg border-transparent hover:border-border px-0 bg-transparent h-auto focus-visible:ring-0"
                                                        />
                                                        <span className="text-xs text-muted-foreground">Chapter {cIndex + 1}</span>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeChapter(chapter.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 space-y-4">
                                                {chapter.lessons.map((lesson, lIndex) => (
                                                    <div key={lesson.id} className="flex items-start gap-3 p-3 bg-card border rounded-lg group">
                                                        <div className="mt-2 text-muted-foreground"><GripVertical className="w-4 h-4" /></div>
                                                        <div className="flex-1 space-y-3">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex-1">
                                                                    <Label className="text-xs text-muted-foreground">Lesson Title</Label>
                                                                    <Input
                                                                        value={lesson.title}
                                                                        onChange={(e) => {
                                                                            const newChapters = [...chapters];
                                                                            newChapters[cIndex].lessons[lIndex].title = e.target.value;
                                                                            setChapters(newChapters);
                                                                        }}
                                                                        className="h-8"
                                                                    />
                                                                </div>
                                                                <div className="w-[140px]">
                                                                    <Label className="text-xs text-muted-foreground">Type</Label>
                                                                    <Select
                                                                        value={lesson.type}
                                                                        onValueChange={(v: LessonType) => {
                                                                            const newChapters = [...chapters];
                                                                            newChapters[cIndex].lessons[lIndex].type = v;
                                                                            setChapters(newChapters);
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-8">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="video">Video</SelectItem>
                                                                            <SelectItem value="pdf">PDF File</SelectItem>
                                                                            <SelectItem value="document">Text</SelectItem>
                                                                            <SelectItem value="quiz">Quiz</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>

                                                            {/* Content Upload Area */}
                                                            <div className="flex items-center gap-4">
                                                                {lesson.fileName ? (
                                                                    <div className="flex items-center gap-2 text-sm bg-muted px-3 py-1.5 rounded-md flex-1">
                                                                        {lesson.type === 'video' ? <FileVideo className="w-4 h-4 text-primary" /> : <FileText className="w-4 h-4 text-primary" />}
                                                                        <span className="truncate flex-1">{lesson.fileName}</span>
                                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => {
                                                                            const newChapters = [...chapters];
                                                                            newChapters[cIndex].lessons[lIndex].fileName = undefined;
                                                                            setChapters(newChapters);
                                                                        }}>
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex-1">
                                                                        <Label htmlFor={`file-${lesson.id}`} className="cursor-pointer">
                                                                            <div className="border border-dashed rounded-md p-2 text-xs text-center text-muted-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
                                                                                <Upload className="w-3 h-3" /> Upload {lesson.type === 'video' ? 'Video' : 'Document'}
                                                                            </div>
                                                                            <Input
                                                                                id={`file-${lesson.id}`}
                                                                                type="file"
                                                                                className="hidden"
                                                                                onChange={(e) => {
                                                                                    if (e.target.files?.[0]) handleFileUpload(chapter.id, lesson.id, e.target.files[0])
                                                                                }}
                                                                            />
                                                                        </Label>
                                                                    </div>
                                                                )}

                                                                <div className="flex items-center gap-2">
                                                                    <Label className="text-xs cursor-pointer whitespace-nowrap">Free Preview</Label>
                                                                    <Switch
                                                                        checked={lesson.isFree}
                                                                        onCheckedChange={(c) => {
                                                                            const newChapters = [...chapters];
                                                                            newChapters[cIndex].lessons[lIndex].isFree = c;
                                                                            setChapters(newChapters);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {uploadProgress > 0 && !lesson.fileName && (
                                                                <Progress value={uploadProgress} className="h-1 w-full" />
                                                            )}
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeLesson(chapter.id, lesson.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button variant="ghost" size="sm" className="w-full border-2 border-dashed text-muted-foreground" onClick={() => addLesson(chapter.id)}>
                                                    <Plus className="w-4 h-4 mr-2" /> Add Lesson
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {chapters.length === 0 && (
                                        <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
                                            <p className="text-muted-foreground">No chapters yet. Start building your curriculum!</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* --- SETTINGS TAB --- */}
                            <TabsContent value="settings">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Course Settings</CardTitle>
                                        <CardDescription>Configure visibility and accessibility.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Publish Course</Label>
                                                <p className="text-sm text-muted-foreground">Make this course visible to students</p>
                                            </div>
                                            <Switch />
                                        </div>

                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Public Access</Label>
                                                <p className="text-sm text-muted-foreground">Allow anyone to view the course landing page</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="space-y-0.5">
                                                <Label className="text-base flex items-center gap-2"><Globe className="w-4 h-4" /> SEO Settings</Label>
                                                <p className="text-sm text-muted-foreground">Index this course on search engines</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 mt-8">
                                            <h4 className="text-destructive font-medium mb-2">Danger Zone</h4>
                                            <Button variant="destructive">Delete Course</Button>
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
