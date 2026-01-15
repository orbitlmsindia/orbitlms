"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
  { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
  { title: "Assignments", href: "/dashboard/student/assignments", icon: "📋" },
  { title: "Assessments", href: "/dashboard/student/assessments", icon: "✍️", badge: 3 },
  { title: "AI Assistant", href: "/dashboard/student/ai-assistant", icon: "🤖" },
  { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },
  { title: "Certificates", href: "/dashboard/student/certificates", icon: "🏆" },
]

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

const suggestedQuestions = [
  "Explain React hooks in simple terms",
  "How do I debug JavaScript code?",
  "What are the best practices for CSS?",
  "Can you help with my JavaScript assignment?",
]

export default function AIAssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI Learning Assistant. I'm here to help you understand concepts, answer questions, and provide guidance on your courses. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        "react hooks":
          "React Hooks are functions that let you use state and other React features without writing a class component. The most common hooks are useState for state management and useEffect for side effects.",
        "debug javascript":
          "Here are some debugging tips: 1) Use console.log() to track variables 2) Use browser DevTools (F12) 3) Set breakpoints in the debugger 4) Use try-catch blocks 5) Check the network tab for API issues.",
        "css practices":
          "CSS best practices include: 1) Use semantic HTML 2) Keep selectors simple 3) Avoid inline styles 4) Use CSS variables for consistency 5) Mobile-first responsive design 6) Minimize specificity 7) Organize your stylesheets.",
        "javascript assignment":
          "I'd be happy to help! Could you describe what the assignment is asking for? Please share: 1) The requirements 2) What you've tried so far 3) Any specific errors you're encountering",
      }

      let response = "That's a great question! Could you provide more details so I can give you a more specific answer?"

      const lowerText = text.toLowerCase()
      for (const [key, value] of Object.entries(responses)) {
        if (lowerText.includes(key)) {
          response = value
          break
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
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
        <SidebarNav
          items={sidebarItems}
          onLogout={() => {
            router.push("/login")
          }}
        />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderNav
          userName="Alex Johnson"
          userRole="Student"
          onLogout={() => {
            router.push("/login")
          }}
        />

        <main className="flex-1 overflow-auto flex flex-col">
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Welcome Section */}
              {messages.length === 1 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">AI Learning Assistant</h1>
                  <p className="text-muted-foreground mb-8">
                    Ask any questions about your courses and get instant help
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestedQuestions.map((question, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(question)}
                        className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition text-left text-sm font-medium text-foreground hover:bg-muted/50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xl p-4 rounded-lg ${message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card border border-border rounded-bl-none"
                      }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border p-4 rounded-lg rounded-bl-none">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Section */}
          <div className="border-t border-border bg-card p-4">
            <div className="max-w-3xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage(inputValue)
                }}
                className="flex gap-3"
              >
                <Input
                  placeholder="Ask me anything about your courses..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                  Send
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                AI Assistant can help with course concepts, assignments, and learning strategies
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
