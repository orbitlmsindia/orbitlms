"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { User, Mail, Shield, Calendar, Camera, Save } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/student", icon: "🏠" },
    { title: "My Courses", href: "/dashboard/student/courses", icon: "📚" },
    { title: "Assignments", href: "/dashboard/student/assignments", icon: "📋" },
    { title: "Quizzes", href: "/dashboard/student/assessments", icon: "✍️", badge: 3 },

    { title: "Gamification", href: "/dashboard/student/gamification", icon: "🎮" },
    { title: "Progress", href: "/dashboard/student/progress", icon: "📊" },
]

export default function StudentSettingsPage() {
    const { data: session, update } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        image: "",
        role: "student",
        status: "active",
        joinedDate: ""
    })

    useEffect(() => {
        if (session?.user?.id) {
            fetchProfile()
        }
    }, [session?.user?.id])

    const fetchProfile = async () => {
        try {
            const res = await fetch(`/api/users/${(session?.user as any).id}`)
            const result = await res.json()
            if (result.success) {
                setProfile({
                    ...result.data,
                    joinedDate: new Date(result.data.joinedDate).toLocaleDateString()
                })
            }
        } catch (error) {
            toast.error("Failed to load profile")
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/users/${(session?.user as any).id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profile.name,
                    email: profile.email,
                    image: profile.image
                })
            })
            const result = await res.json()
            if (result.success) {
                toast.success("Profile updated successfully")
                // Update session if needed
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: profile.name,
                        image: profile.image
                    }
                })
            } else {
                toast.error(result.error || "Failed to update profile")
            }
        } catch (error) {
            toast.error("An error occurred while saving")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <aside className="hidden lg:flex flex-col w-72 border-r border-border/40 bg-card/30 backdrop-blur-xl">
                <div className="flex items-center justify-center py-6 border-b border-sidebar-border/40 group cursor-pointer" onClick={() => router.push("/")}>
                    <img src="/logo.png" alt="Orbit" className="w-24 h-24 object-contain" />
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav
                    userName={profile.name || "Student"}
                    userRole="Student"
                    userImage={profile.image}
                    onLogout={() => router.push("/login")}
                />

                <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-primary/[0.02] to-background">
                    <div className="p-8 md:p-12 lg:p-16 max-w-4xl mx-auto space-y-12">
                        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                            <h1 className="text-5xl font-black tracking-tighter mb-3">Profile Settings</h1>
                            <p className="text-lg text-muted-foreground font-medium">Manage your institutional identity and account details.</p>
                        </div>

                        <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            <Card className="border-border/40 bg-card/30 backdrop-blur-md rounded-[2rem] shadow-sm overflow-hidden">
                                <CardHeader className="p-10 border-b border-border/40 bg-muted/20">
                                    <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-xl">
                                            <User className="w-6 h-6 text-primary" />
                                        </div>
                                        Personal Information
                                    </CardTitle>
                                    <CardDescription className="text-base font-medium">Update your name and profile picture</CardDescription>
                                </CardHeader>
                                <CardContent className="p-10 space-y-8">
                                    <div className="flex flex-col md:flex-row gap-12 items-start md:items-center">
                                        <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                            <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-primary via-primary/80 to-secondary flex items-center justify-center text-primary-foreground font-black text-4xl shadow-2xl group-hover:scale-105 transition-all overflow-hidden border-4 border-background">
                                                {profile.image ? (
                                                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    profile.name.charAt(0).toUpperCase()
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Camera className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-6 w-full">
                                            <div className="space-y-3">
                                                <Label className="uppercase tracking-widest text-[10px] font-black text-muted-foreground ml-1">Full Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        className="h-14 pl-12 bg-muted/30 border-none rounded-2xl text-base font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                                                        value={profile.name}
                                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="uppercase tracking-widest text-[10px] font-black text-muted-foreground ml-1">Academic Email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        type="email"
                                                        className="h-14 pl-12 bg-muted/30 border-none rounded-2xl text-base font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                                                        value={profile.email}
                                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="uppercase tracking-widest text-[10px] font-black text-muted-foreground ml-1">Profile Image</Label>
                                        <div className="flex gap-4 items-center">
                                            <div className="relative flex-1">
                                                <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    className="h-14 pl-12 bg-muted/30 border-none rounded-2xl text-base font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                                                    placeholder="Image URL or Upload"
                                                    value={profile.image}
                                                    onChange={(e) => setProfile({ ...profile, image: e.target.value })}
                                                />
                                            </div>
                                            <input
                                                type="file"
                                                id="avatar-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        if (file.size > 2 * 1024 * 1024) {
                                                            toast.error("Image too large (max 2MB)")
                                                            return
                                                        }
                                                        const reader = new FileReader()
                                                        reader.onloadend = () => {
                                                            setProfile(prev => ({ ...prev, image: reader.result as string }))
                                                        }
                                                        reader.readAsDataURL(file)
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="outline"
                                                className="h-14 px-6 rounded-2xl"
                                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                            >
                                                Upload
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-10 bg-muted/10 border-t border-border/40 flex justify-end">
                                    <Button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="h-14 px-10 rounded-[1.25rem] bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all font-black text-base gap-3"
                                    >
                                        {loading ? "Synchronizing..." : <><Save className="w-5 h-5" /> Save Changes</>}
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card className="border-border/40 bg-card/30 backdrop-blur-md rounded-[2rem] shadow-sm">
                                <CardHeader className="p-10">
                                    <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                        <div className="p-2 bg-secondary/10 rounded-xl">
                                            <Shield className="w-6 h-6 text-secondary" />
                                        </div>
                                        Account Verification
                                    </CardTitle>
                                    <CardDescription className="text-base font-medium">Read-only institutional records</CardDescription>
                                </CardHeader>
                                <CardContent className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 pt-0">
                                    <div className="p-6 rounded-2xl bg-muted/30 space-y-2">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Shield className="w-4 h-4" />
                                            <span className="uppercase tracking-widest text-[10px] font-black">System Role</span>
                                        </div>
                                        <p className="text-lg font-black capitalize">{profile.role}</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-muted/30 space-y-2">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Calendar className="w-4 h-4" />
                                            <span className="uppercase tracking-widest text-[10px] font-black">Joined Date</span>
                                        </div>
                                        <p className="text-lg font-black">{profile.joinedDate}</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-muted/30 space-y-2">
                                        <div className="flex items-center gap-2 text-green-500">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="uppercase tracking-widest text-[10px] font-black">Status</span>
                                        </div>
                                        <p className="text-lg font-black capitalize">{profile.status}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
