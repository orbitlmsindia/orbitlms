"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    instituteId: "",
  })
  const [institutes, setInstitutes] = useState<any[]>([])

  // Fetch institutes on mount
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await fetch('/api/institutes')
        const data = await res.json()
        if (data.success) {
          setInstitutes(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch institutes")
      }
    }
    fetchInstitutes()
  }, [])
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value.toLowerCase() }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (!formData.instituteId) {
      setError("Please select an institute.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          instituteId: formData.instituteId,
          password: formData.password,
          role: formData.role,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (formData.role === 'teacher') {
          toast.success("Registration Successful", {
            description: "Your account is pending approval by the institute manager.",
          })
        } else {
          toast.success("Account Created!", {
            description: "Welcome to Orbit. Please log in with your new credentials.",
          })
        }
        router.push("/login")
      } else {
        setError(data.error || "Registration failed. This email might already be in use.")
        toast.error("Registration Error", {
          description: data.error || "Could not synchronize with identity vault.",
        })
      }
    } catch (err) {
      setError("A critical database connection error occurred.")
      toast.error("Operational Failure", {
        description: "The system could not reach the database.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <img src="/logo.png" alt="Orbit" className="h-12 w-auto object-contain mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">Join Orbit</h1>
          <p className="text-muted-foreground mt-2">Create your account to get started</p>
        </div>

        {/* Register Card */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Fill in the details below to register</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select Institute</label>
                <Select disabled={isLoading || institutes.length === 0} value={formData.instituteId} onValueChange={(value) => setFormData(prev => ({ ...prev, instituteId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={institutes.length === 0 ? "Loading institutes..." : "Select Institute"} />
                  </SelectTrigger>
                  <SelectContent>
                    {institutes.length === 0 ? (
                      <SelectItem value="none" disabled>No institutes available</SelectItem>
                    ) : (
                      institutes.map((inst) => (
                        <SelectItem key={inst._id} value={inst._id}>{inst.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {institutes.length === 0 && (
                  <p className="text-xs text-muted-foreground">If no institutes appear, please contact support.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Account Type</label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>



              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
