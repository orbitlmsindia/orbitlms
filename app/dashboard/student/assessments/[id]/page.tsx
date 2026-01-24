"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, AlertCircle, CheckCircle, ChevronLeft, XCircle, Check } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function AssessmentDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    // Await params in Next.js 15+ (if applicable, but handling as object for now is safe with client use) 
    // Actually in client components params is directly available but let's be safe.
    const id = params.id as string

    // State
    const [status, setStatus] = useState<'loading' | 'intro' | 'active' | 'completed'>('loading')
    const [assessment, setAssessment] = useState<any>(null)
    const [questions, setQuestions] = useState<any[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [answers, setAnswers] = useState<number[]>([]) // Store user answers
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)
    const [resultData, setResultData] = useState<any>(null)
    const [saving, setSaving] = useState(false)

    // Fetch Data
    const fetchData = useCallback(async () => {
        if (!session?.user || !id) return

        try {
            setStatus('loading')

            // 1. Fetch Assessment Details
            const assessRes = await fetch(`/api/assessments/${id}`)
            const assessJson = await assessRes.json()

            if (!assessJson.success) {
                toast.error("Assessment not found")
                router.push('/dashboard/student/assessments')
                return
            }

            const assessData = assessJson.data
            setAssessment(assessData)
            setQuestions(assessData.questions || [])
            setTimeLeft((assessData.duration || 30) * 60)

            // 2. Check for existing result
            const user = session.user as any
            const resultRes = await fetch(`/api/assessment-results?studentId=${user.id || user._id}`)
            const resultJson = await resultRes.json()

            if (resultJson.success) {
                // Find result for THIS assessment
                const existingResult = resultJson.data.find((r: any) =>
                    r.assessment === id || (typeof r.assessment === 'object' && r.assessment._id === id)
                )

                if (existingResult) {
                    setResultData(existingResult)
                    // Reconstruct answers array from existing result
                    // existingResult.answers is usually [{questionId, selectedOption, ...}]
                    // We need to map it back to the simple `answers` index array matching `questions` order
                    const loadedAnswers = new Array(assessData.questions.length).fill(-1)
                    existingResult.answers.forEach((ans: any) => {
                        // Assuming questionId corresponds to index or we match by text? 
                        // The current save logic uses index as questionId.
                        const idx = parseInt(ans.questionId)
                        if (!isNaN(idx)) {
                            loadedAnswers[idx] = ans.selectedOption
                        }
                    })
                    setAnswers(loadedAnswers)
                    setScore(existingResult.score)
                    setStatus('completed')
                } else {
                    setStatus('intro')
                }
            } else {
                setStatus('intro')
            }

        } catch (error) {
            console.error("Error fetching assessment:", error)
            toast.error("Failed to load assessment")
        }
    }, [id, session, router])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Timer Logic
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (status === 'active' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (status === 'active' && timeLeft === 0) {
            handleSubmit()
        }
        return () => clearInterval(timer)
    }, [status, timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    const handleStart = () => {
        setStatus('active')
    }

    const handleOptionSelect = (index: number) => {
        setSelectedOption(index)
    }

    const handleNext = () => {
        if (selectedOption === null) return // Should be disabled anyway

        const newAnswers = [...answers]
        newAnswers[currentQuestion] = selectedOption
        setAnswers(newAnswers)

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedOption(null)
        } else {
            handleSubmit(newAnswers)
        }
    }

    const handleSubmit = async (finalAnswers?: number[]) => {
        const answersToSubmit = finalAnswers || answers

        // Calculate Score locally for immediate feedback (and valid payload)
        let calculatedScore = 0
        const formattedAnswers = questions.map((q, idx) => {
            const selected = answersToSubmit[idx]
            const isCorrect = selected === q.correctAnswer
            if (isCorrect) calculatedScore++

            return {
                questionId: idx.toString(),
                selectedOption: selected,
                isCorrect
            }
        })

        setScore(calculatedScore)
        setAnswers(answersToSubmit) // Ensure state is up to date
        setStatus('completed')

        if (!session?.user) return

        try {
            setSaving(true)
            const user = session.user as any

            await fetch('/api/assessment-results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student: user.id || user._id,
                    assessment: id, // Send ID as string
                    score: calculatedScore,
                    totalMarks: questions.length,
                    status: calculatedScore >= (questions.length * 0.4) ? 'passed' : 'failed', // 40% pass mark assumption
                    answers: formattedAnswers
                })
            })
            toast.success("Quiz submitted successfully!")

            try {
                await fetch('/api/notifications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user: user.id || user._id,
                        title: "Quiz Completed",
                        message: `You scored ${calculatedScore}/${questions.length} in ${assessment?.title || 'the quiz'}.`,
                        type: 'success'
                    })
                })
            } catch (ignore) { }

            // Re-fetch to confirm saved state and allow "View Details" to work with persistent data matches
            // But we already set status to completed, so UI is fine.
        } catch (error) {
            console.error("Failed to save result", error)
            toast.error("Failed to save result to database")
        } finally {
            setSaving(false)
        }
    }

    // -- RENDER HELPERS --

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <p className="text-muted-foreground">Loading assessment...</p>
                </div>
            </div>
        )
    }

    if (status === 'intro') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="max-w-2xl w-full">
                    <CardHeader>
                        <Button variant="ghost" className="w-fit mb-2 pl-0 hover:bg-transparent" onClick={() => router.back()}>
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <CardTitle className="text-3xl">{assessment?.title}</CardTitle>
                        <CardDescription>Ready to test your knowledge?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center text-center">
                                <Clock className="w-8 h-8 mb-2 text-primary" />
                                <span className="font-bold">{assessment?.duration || 30} Min</span>
                                <span className="text-xs text-muted-foreground">Duration</span>
                            </div>
                            <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center text-center">
                                <CheckCircle className="w-8 h-8 mb-2 text-primary" />
                                <span className="font-bold">{questions.length}</span>
                                <span className="text-xs text-muted-foreground">Questions</span>
                            </div>
                            <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center text-center">
                                <AlertCircle className="w-8 h-8 mb-2 text-primary" />
                                <span className="font-bold">40%</span>
                                <span className="text-xs text-muted-foreground">Pass Mark</span>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                            <li>The timer starts immediately after clicking Start.</li>
                            <li>You cannot pause the quiz once started.</li>
                            <li>Do not refresh the page during the quiz.</li>
                        </ul>
                        <div className="flex gap-4 pt-4">
                            <Button variant="outline" className="flex-1" onClick={() => router.back()}>Cancel</Button>
                            <Button className="flex-1" onClick={handleStart}>Start Quiz</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (status === 'completed') {
        const percentage = Math.round((score / questions.length) * 100)

        return (
            <div className="min-h-screen bg-background flex flex-col">
                <header className="border-b border-border bg-card p-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <Button variant="ghost" onClick={() => router.push('/dashboard/student/assessments')}>
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back to List
                        </Button>
                        <h1 className="font-bold">Result Summary</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 flex flex-col items-center gap-8">
                    <Card className="max-w-3xl w-full">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl mb-2">Quiz Completed</CardTitle>
                            <CardDescription>
                                {percentage >= 40 ? "Great job! You passed." : "Keep practicing. You can improve!"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex justify-center">
                                <div className={`relative w-32 h-32 flex items-center justify-center rounded-full border-4 ${percentage >= 40 ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}`}>
                                    <span className="text-3xl font-bold">{percentage}%</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 rounded-lg border border-green-100 dark:bg-green-900/20 dark:border-green-900/30">
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">{score}</p>
                                    <p className="text-sm text-muted-foreground">Correct Answers</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded-lg border border-red-100 dark:bg-red-900/20 dark:border-red-900/30">
                                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">{questions.length - score}</p>
                                    <p className="text-sm text-muted-foreground">Wrong Answers</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="max-w-3xl w-full space-y-4">
                        <h3 className="text-xl font-semibold">Detailed Review</h3>
                        {questions.map((q, idx) => {
                            const userAnswer = answers[idx]
                            const isCorrect = userAnswer === q.correctAnswer
                            // Handle missed/skipped if logical - currently default -1 implies skipped or missed
                            const isSkipped = userAnswer === -1 || userAnswer === undefined

                            return (
                                <Card key={idx} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1">
                                                {isCorrect ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <p className="font-medium text-lg">{idx + 1}. {q.text}</p>

                                                <div className="space-y-2">
                                                    {q.options.map((opt: string, optIdx: number) => {
                                                        const isSelected = userAnswer === optIdx
                                                        const isRealCorrect = q.correctAnswer === optIdx

                                                        let optionClass = "p-3 rounded-md border text-sm flex justify-between items-center"
                                                        if (isRealCorrect) optionClass += " bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-300"
                                                        else if (isSelected && !isCorrect) optionClass += " bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-300"
                                                        else optionClass += " bg-background border-border"

                                                        return (
                                                            <div key={optIdx} className={optionClass}>
                                                                <span>{opt}</span>
                                                                {isRealCorrect && <Check className="w-4 h-4 ml-2" />}
                                                                {isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-2" />}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </main>
            </div>
        )
    }

    // ACTIVE QUIZ RENDER
    const currentQ = questions[currentQuestion]
    if (!currentQ) return null; // Safety

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b border-border bg-card p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <h1 className="font-bold text-lg">Question {currentQuestion + 1}/{questions.length}</h1>
                    <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-4 flex items-center justify-center">
                <Card className="max-w-3xl w-full">
                    <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-medium leading-relaxed">
                                {currentQ.text}
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {currentQ.options.map((option: string, idx: number) => {
                                // Manage local selection state during quiz
                                // selectedOption state is used for current immediate selection
                                // However, if user goes simpler flow (one q at a time), state is enough.
                                // If we wanted back/forth navigation, we'd read from `answers` array.
                                // Current logic: One-way flow.
                                const isSelected = selectedOption === idx
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-3
                                            ${isSelected
                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                : 'border-border hover:bg-muted/50 hover:border-primary/50'
                                            }
                                        `}
                                    >
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0
                                            ${isSelected
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-muted-foreground'
                                            }
                                        `}>
                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                        </div>
                                        <span className="text-lg">{option}</span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button size="lg" disabled={selectedOption === null} onClick={handleNext}>
                                {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
