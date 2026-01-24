"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, PlayCircle, FileText, CheckCircle, Lock, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
    { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
    { title: "Assignments", href: "/dashboard/student/assignments", icon: "📝" },
    { title: "Quizzes", href: "/dashboard/student/assessments", icon: "✍️", badge: 3 },
    { title: "Gamification", href: "/dashboard/student/gamification", icon: "🎮" },
    { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },
]

type LessonType = 'video' | 'text' | 'pdf' | 'document' | 'quiz'

interface Lesson {
    id: string
    title: string
    type: LessonType
    duration?: string
    completed: boolean
    locked: boolean
    content?: string // For text content
    textContent?: string // Fallback for some APIs
    videoUrl?: string // For video content
    fileUrl?: string // For pdf/doc content
    fileName?: string // Fallback name
}

interface Chapter {
    id: string
    title: string
    lessons: Lesson[]
    _id?: string
}

export default function CourseViewerPage() {
    const router = useRouter()
    const params = useParams()
    const { data: session } = useSession()

    const [course, setCourse] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
    // activeChapter unused but kept for state shape if needed later
    const [activeChapter, setActiveChapter] = useState<string>("")

    const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const fetchCourseAndEnrollment = async () => {
            if (!params.id || !session?.user?.id) return
            try {
                // 1. Fetch Course
                const courseRes = await fetch(`/api/courses/${params.id}`)
                const courseData = await courseRes.json()

                if (courseData.success) {
                    setCourse(courseData.data)
                    // Set initial lesson if needed
                    if (!currentLesson && courseData.data.chapters?.length > 0) {
                        const firstChapter = courseData.data.chapters[0]
                        setActiveChapter(firstChapter._id || firstChapter.id)
                        if (firstChapter.lessons && firstChapter.lessons.length > 0) {
                            setCurrentLesson(firstChapter.lessons[0])
                        }
                    }
                } else {
                    console.error("API Error:", courseData.error)
                    toast.error("Failed to load course content")
                }

                // 2. Fetch Enrollment (to get progress)
                const enrollRes = await fetch(`/api/enrollments?studentId=${session.user.id}`)
                const enrollData = await enrollRes.json()

                if (enrollData.success && enrollData.data) {
                    // Find enrollment for THIS course
                    const myEnrollment = enrollData.data.find((e: any) =>
                        (e.course._id || e.course) === params.id
                    )

                    if (myEnrollment) {
                        setProgress(myEnrollment.progress || 0)
                        setCompletedLessonIds(myEnrollment.completedLessons || [])
                    }
                }

            } catch (error) {
                console.error("Failed to fetch data:", error)
                toast.error("Failed to load course data")
            } finally {
                setLoading(false)
            }
        }

        if (session?.user) fetchCourseAndEnrollment()
    }, [params.id, session])

    const handleMarkComplete = async () => {
        if (!currentLesson || !course) return

        // Optimistic Update
        if (!completedLessonIds.includes(currentLesson.id)) {
            setCompletedLessonIds(prev => [...prev, currentLesson.id])
        }

        try {
            const res = await fetch('/api/enrollments/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: course._id || params.id,
                    lessonId: currentLesson.id
                })
            })
            const data = await res.json()
            if (data.success) {
                setProgress(data.progress)
                toast.success("Progress saved!")
            } else {
                toast.error("Failed to save progress")
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) return <div className="h-screen flex items-center justify-center">Loading course content...</div>
    if (!course) return (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-bold">Course Not Found</h2>
            <p className="text-muted-foreground">The course content could not be loaded.</p>
            <Button variant="outline" onClick={() => router.push('/dashboard/student/courses')}>Back to Courses</Button>
        </div>
    )

    // Helper to get embed URL
    const getEmbedUrl = (url: string) => {
        if (!url) return ""
        // Handle YouTube
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            let videoId = "";
            if (url.includes("v=")) {
                videoId = url.split("v=")[1].split("&")[0];
            } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1].split("?")[0];
            } else if (url.includes("embed/")) {
                return url; // Already an embed URL
            }

            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        }
        // Handle Vimeo
        if (url.includes("vimeo.com")) {
            const videoId = url.split("vimeo.com/")[1]
            return `https://player.vimeo.com/video/${videoId}`
        }
        return url
    }

    const videoSrc = currentLesson?.videoUrl ? getEmbedUrl(currentLesson.videoUrl) : ""
    const isNativeVideo = videoSrc.match(/\.(mp4|webm|ogg)$/i)

    // Handle lesson selection
    const handleSelectLesson = (lesson: Lesson) => {
        if (lesson.locked) return
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
                <HeaderNav userName={session?.user?.name || "Student"} userRole="Student" onLogout={() => router.push("/login")} />

                <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Course Player / Content Area */}
                    <div className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6 lg:p-8 flex flex-col">
                        {/* Breadcrumb / Back */}
                        <div className="flex items-center gap-2 mb-6">
                            <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
                                <ChevronLeft className="w-4 h-4" /> Back to Courses
                            </Button>
                            <span className="text-muted-foreground">/</span>
                            <span className="font-medium truncate">{course.title}</span>
                        </div>

                        {/* Content Viewer */}
                        {currentLesson ? (
                            <Card className="flex-1 border-border/50 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                                <div className={cn(
                                    "w-full flex items-center justify-center relative",
                                    currentLesson.type === 'video' ? "bg-black aspect-video" : "bg-background min-h-[600px]"
                                )}>
                                    {currentLesson.type === 'video' ? (
                                        videoSrc ? (
                                            isNativeVideo ? (
                                                <video
                                                    src={videoSrc}
                                                    controls
                                                    className="w-full h-full absolute inset-0"
                                                />
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
                                                {/* Render HTML content safely */}
                                                <div dangerouslySetInnerHTML={{ __html: currentLesson.content || currentLesson.textContent || "" }} />
                                            </div>
                                        </div>
                                    ) : (currentLesson.type === 'pdf' || currentLesson.type === 'document') ? (
                                        // Robust PDF/Document Viewer
                                        <div className="w-full h-full bg-white relative">
                                            {currentLesson.fileUrl ? (
                                                <iframe
                                                    src={currentLesson.fileUrl}
                                                    width="100%"
                                                    height="100%"
                                                    className="w-full h-full border-0 absolute inset-0"
                                                    title={currentLesson.title}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                                                    <FileText className="w-16 h-16 mb-4 opacity-50" />
                                                    <h3 className="text-xl font-bold mb-2">Document Content</h3>
                                                    <p className="mb-4">This document cannot be previewed directly.</p>
                                                    {currentLesson.fileName && <p className="text-sm border p-2 rounded mb-4">{currentLesson.fileName}</p>}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-white text-center p-8">
                                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                            <h3 className="text-xl font-bold">Content Type Not Supported Yet</h3>
                                            <p className="text-sm text-gray-400 mt-2">Type: {currentLesson.type}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Lesson Details Footer */}
                                <div className="p-6 border-t bg-card h-[200px] overflow-y-auto">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                                            <p className="text-muted-foreground text-sm mb-2">{currentLesson.type === 'video' ? 'Video Lesson' : 'Reading Material'} • {currentLesson.duration || "5 min"}</p>
                                            {(currentLesson.type === 'pdf' || currentLesson.type === 'document') && currentLesson.fileUrl && (
                                                <Button variant="outline" size="sm" onClick={() => window.open(currentLesson.fileUrl, '_blank')}>
                                                    <Download className="w-4 h-4 mr-2" /> Download
                                                </Button>
                                            )}
                                        </div>
                                        <Button
                                            size="lg"
                                            className={cn("rounded-xl px-8", completedLessonIds.includes(currentLesson.id) ? "bg-green-600 hover:bg-green-700" : "")}
                                            onClick={handleMarkComplete}
                                        >
                                            {completedLessonIds.includes(currentLesson.id) ? "Completed" : "Mark as Complete"}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-xl">
                                Select a lesson to start learning
                            </div>
                        )}
                    </div>

                    {/* Course Curriculum Sidebar (Right Side) */}
                    <div className="w-full md:w-80 lg:w-96 border-l bg-background flex flex-col h-[50vh] md:h-full">
                        <div className="p-4 border-b">
                            <h3 className="font-bold text-lg">Course Content</h3>
                            <p className="text-sm text-muted-foreground mt-1">{progress}% User Progress</p>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-6">
                                {course.chapters && course.chapters.map((chapter: any) => (
                                    <div key={chapter._id || chapter.id}>
                                        <h4 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">{chapter.title}</h4>
                                        <div className="space-y-1">
                                            {chapter.lessons.map((lesson: any) => {
                                                const isActive = currentLesson && (currentLesson.id === lesson.id || currentLesson.id === lesson._id)
                                                const isCompleted = completedLessonIds.includes(lesson.id || lesson._id)

                                                return (
                                                    <button
                                                        key={lesson._id || lesson.id}
                                                        disabled={lesson.locked}
                                                        onClick={() => handleSelectLesson(lesson)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                                                            isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50",
                                                            lesson.locked && "opacity-50 cursor-not-allowed"
                                                        )}
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                                        ) : lesson.locked ? (
                                                            <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                                                        ) : (
                                                            <div className={cn("w-4 h-4 rounded-full border-2 shrink-0", isActive ? "border-primary" : "border-muted-foreground")} />
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
