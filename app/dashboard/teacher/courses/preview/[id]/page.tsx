"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, PlayCircle, FileText, CheckCircle, Lock, Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/teacher", icon: "🏠" },
    { title: "My Courses", href: "/dashboard/teacher/courses", icon: "📚" },
    { title: "Assessments", href: "/dashboard/teacher/assessments", icon: "✍️" },
    { title: "Student Progress", href: "/dashboard/teacher/progress", icon: "📊" },
    { title: "Attendance", href: "/dashboard/teacher/attendance", icon: "📋" },
    { title: "Reports", href: "/dashboard/teacher/reports", icon: "📈" },
]

type LessonType = 'video' | 'text' | 'pdf' | 'document' | 'quiz'

interface Lesson {
    id: string
    title: string
    type: LessonType
    duration?: string
    completed: boolean
    locked: boolean
    content?: string
    textContent?: string
    videoUrl?: string
    fileUrl?: string
    fileName?: string
}

interface Chapter {
    id: string
    title: string
    lessons: Lesson[]
    _id?: string
}

export default function TeacherCoursePreviewPage() {
    const router = useRouter()
    const params = useParams()
    const { data: session } = useSession()

    const [course, setCourse] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
    const [activeChapter, setActiveChapter] = useState<string>("")

    useEffect(() => {
        const fetchCourse = async () => {
            if (!params.id) return
            try {
                const res = await fetch(`/api/courses/${params.id}`)
                const data = await res.json()
                if (data.success) {
                    setCourse(data.data)
                    if (data.data.chapters && data.data.chapters.length > 0) {
                        const firstChapter = data.data.chapters[0]
                        setActiveChapter(firstChapter._id || firstChapter.id)
                        if (firstChapter.lessons && firstChapter.lessons.length > 0) {
                            setCurrentLesson(firstChapter.lessons[0])
                        }
                    }
                } else {
                    toast.error("Failed to load course preview")
                }
            } catch (error) {
                console.error("Failed to fetch course:", error)
                toast.error("Failed to load course")
            } finally {
                setLoading(false)
            }
        }
        if (session?.user) fetchCourse()
    }, [params.id, session])

    if (loading) return <div className="h-screen flex items-center justify-center">Loading preview...</div>
    if (!course) return (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-bold">Course Not Found</h2>
            <Button variant="outline" onClick={() => router.back()}>Back to Editor</Button>
        </div>
    )

    const getEmbedUrl = (url: string) => {
        if (!url) return ""
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            let videoId = "";
            if (url.includes("v=")) {
                videoId = url.split("v=")[1].split("&")[0];
            } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1].split("?")[0];
            } else if (url.includes("embed/")) {
                return url;
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        }
        if (url.includes("vimeo.com")) {
            const videoId = url.split("vimeo.com/")[1]
            return `https://player.vimeo.com/video/${videoId}`
        }
        return url
    }

    const videoSrc = currentLesson?.videoUrl ? getEmbedUrl(currentLesson.videoUrl) : ""
    const isNativeVideo = videoSrc.match(/\.(mp4|webm|ogg)$/i)

    const handleSelectLesson = (lesson: Lesson) => {
        setCurrentLesson(lesson)
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-20 xl:w-64 border-r border-border bg-sidebar transition-all duration-300">
                <div className="flex items-center justify-center py-6 border-b border-sidebar-border">
                    <img src="/logo.png" alt="Orbit" className="w-24 h-24 object-contain" />
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav userName={session?.user?.name || "Teacher"} userRole="Teacher" onLogout={() => router.push("/login")} />

                {/* Preview Banner */}
                <div className="bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 text-sm font-medium">
                        <Eye className="w-4 h-4" />
                        <span>Student Preview Mode</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-7 text-xs hover:bg-amber-200 dark:hover:bg-amber-800">
                        Exit Preview
                    </Button>
                </div>

                <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Content Viewer */}
                    <div className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6 lg:p-8 flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
                                <ChevronLeft className="w-4 h-4" /> Back to Editor
                            </Button>
                            <span className="text-muted-foreground">/</span>
                            <span className="font-medium truncate flex items-center gap-2">
                                {course.title}
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                                    course.status === 'published'
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                )}>
                                    {course.status || 'Draft'}
                                </span>
                            </span>
                        </div>

                        {currentLesson ? (
                            <Card className="flex-1 border-border/50 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                                <div className={cn(
                                    "w-full flex items-center justify-center relative",
                                    currentLesson.type === 'video' ? "bg-black aspect-video" : "bg-background min-h-[600px]"
                                )}>
                                    {currentLesson.type === 'video' ? (
                                        videoSrc ? (
                                            isNativeVideo ? (
                                                <video src={videoSrc} controls className="w-full h-full absolute inset-0" />
                                            ) : (
                                                <iframe
                                                    src={videoSrc}
                                                    className="w-full h-full absolute inset-0"
                                                    title={currentLesson.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            )
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
                                                <p>Video content unavailable</p>
                                            </div>
                                        )
                                    ) : currentLesson.type === 'text' ? (
                                        <div className="absolute inset-0 bg-background p-8 overflow-y-auto w-full h-full text-foreground">
                                            <div className="max-w-3xl mx-auto prose dark:prose-invert">
                                                <div dangerouslySetInnerHTML={{ __html: currentLesson.content || currentLesson.textContent || "" }} />
                                            </div>
                                        </div>
                                    ) : (currentLesson.type === 'pdf' || currentLesson.type === 'document') ? (
                                        currentLesson.fileUrl ? (
                                            <iframe
                                                src={currentLesson.fileUrl}
                                                width="100%"
                                                height="600px"
                                                className="bg-white border-0"
                                                title={currentLesson.title}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
                                                <FileText className="w-16 h-16 mb-4 opacity-50" />
                                                <h3 className="text-xl font-bold mb-2">Document Content</h3>
                                                <p className="mb-4">This document cannot be previewed directly.</p>
                                                {currentLesson.fileName && <p className="text-sm border p-2 rounded mb-4">{currentLesson.fileName}</p>}
                                                <Button variant="outline" onClick={() => {
                                                    if (currentLesson.fileUrl) window.open(currentLesson.fileUrl, '_blank');
                                                }}>
                                                    Download File
                                                </Button>
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-muted-foreground text-center p-8">
                                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                            <h3 className="text-xl font-bold">Content Type Not Supported Yet</h3>
                                            <p className="text-sm mt-2">Type: {currentLesson.type}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 border-t bg-card h-[200px] overflow-y-auto">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                                            <p className="text-muted-foreground text-sm mb-2">
                                                {currentLesson.type === 'video' ? 'Video Lesson' : 'Reading Material'} • {currentLesson.duration || "5 min"}
                                            </p>
                                        </div>
                                        {/* Disabled completion in preview */}
                                        <Button size="lg" className="rounded-xl px-8 opacity-50 cursor-not-allowed" title="Actions disabled in preview mode">
                                            Mark as Complete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-xl">
                                Select a lesson to preview content
                            </div>
                        )}
                    </div>

                    {/* Curriculum Sidebar */}
                    <div className="w-full md:w-80 lg:w-96 border-l bg-background flex flex-col h-[50vh] md:h-full">
                        <div className="p-4 border-b">
                            <h3 className="font-bold text-lg">Course Content</h3>
                            <p className="text-sm text-muted-foreground mt-1">Preview Mode</p>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-6">
                                {course.chapters && course.chapters.map((chapter: any) => (
                                    <div key={chapter._id || chapter.id}>
                                        <h4 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">{chapter.title}</h4>
                                        <div className="space-y-1">
                                            {chapter.lessons.map((lesson: any) => {
                                                const isActive = currentLesson && (currentLesson.id === lesson.id || currentLesson.id === lesson._id)
                                                return (
                                                    <button
                                                        key={lesson._id || lesson.id}
                                                        onClick={() => handleSelectLesson(lesson)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                                                            isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"
                                                        )}
                                                    >
                                                        {isActive ? (
                                                            <div className="w-4 h-4 rounded-full border-2 border-primary shrink-0" />
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground shrink-0" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm truncate">{lesson.title}</p>
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                                {lesson.type === 'video' ? <PlayCircle className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                                                {lesson.duration || "5 min"}
                                                            </p>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </main>
            </div>
        </div>
    )
}
