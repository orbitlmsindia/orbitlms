"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // TODO: Implement actual authentication
      // For demo, route to dashboard based on email
      const role = email.includes("teacher")
        ? "teacher"
        : email.includes("admin")
          ? "admin"
          : email.includes("manager")
            ? "manager"
            : "student"
      router.push(`/dashboard/${role}`)
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,var(--primary-foreground)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,var(--secondary)_0%,transparent_50%)] bg-background flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated background highlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-[480px] relative z-10">
        {/* Logo and Greeting */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-primary via-primary/80 to-secondary text-primary-foreground font-black text-3xl mb-4 shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] animate-in fade-in zoom-in duration-700">
            E
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700">Welcome Back</h1>
          <p className="text-lg text-muted-foreground/80 font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">Your intelligence portal awaits.</p>
        </div>

        {/* Login Card with Glassmorphism */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <CardHeader className="pt-12 px-10 pb-4">
            <CardTitle className="text-3xl font-black tracking-tight">Login</CardTitle>
            <CardDescription className="text-base font-medium text-muted-foreground/70">Connect to your workspace</CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Email Address</label>
                <div className="relative group">
                  <Input
                    type="email"
                    placeholder="name@university.edu"
                    className="h-14 bg-muted/30 border-border/40 rounded-2xl px-5 text-base font-medium focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all border-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">Password</label>
                  <Link href="/forgot-password" title="Recover Password" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">
                    Forgot?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-14 bg-muted/30 border-border/40 rounded-2xl px-5 text-base font-medium focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all border-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm font-bold border border-destructive/20 animate-in shake duration-500">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-16 rounded-[1.25rem] bg-primary text-primary-foreground font-black text-lg shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_25px_50px_rgba(var(--primary-rgb),0.4)] hover:scale-[1.02] active:scale-95 transition-all" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Sign In →"}
              </Button>
            </form>

            <div className="mt-10 pt-10 border-t border-border/40">
              <p className="text-center text-base font-medium text-muted-foreground">
                New to EduHub?{" "}
                <Link href="/register" className="font-black text-primary hover:underline underline-offset-4">
                  Create Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials as a Premium Disclosure */}
        <div className="mt-8 p-6 rounded-[2rem] bg-card/20 backdrop-blur-md border border-border/40 animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">💡</span>
            <p className="text-xs font-black uppercase tracking-widest text-foreground">Explorer Credentials</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[10px] font-bold text-muted-foreground/80">
            <div className="space-y-2">
              <p><span className="text-foreground">Student:</span> student@example.com</p>
              <p><span className="text-foreground">Teacher:</span> teacher@example.com</p>
            </div>
            <div className="space-y-2">
              <p><span className="text-foreground">Manager:</span> manager@example.com</p>
              <p><span className="text-foreground">Admin:</span> admin@example.com</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
            Password: demo123
          </div>
        </div>
      </div>
    </div >
  )
}
