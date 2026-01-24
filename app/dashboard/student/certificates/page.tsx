"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, ExternalLink, ShieldCheck } from "lucide-react"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/student", icon: "ÃƒÂ°Ã…Â¸Ã‚ÂÃ‚Â " },
    { title: "My Courses", href: "/dashboard/student/courses", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â¡" },
    { title: "Assignments", href: "/dashboard/student/assignments", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â" },
    { title: "Assessments", href: "/dashboard/student/assessments", icon: "ÃƒÂ¢Ã…â€œÃ‚ÂÃƒÂ¯Ã‚Â¸Ã‚Â", badge: 3 },

    { title: "Progress", href: "/dashboard/student/progress", icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â " },
    { title: "Certificates", href: "/dashboard/student/certificates", icon: "ÃƒÂ°Ã…Â¸Ã‚ÂÃ¢â‚¬Â " },
    { title: "Virtual Labs", href: "/dashboard/student/virtual-labs", icon: "ÃƒÂ°Ã…Â¸Ã‚Â§Ã‚Âª" },
    { title: "Gamification", href: "/dashboard/student/gamification", icon: "ÃƒÂ°Ã…Â¸Ã…Â½Ã‚Â®" },
]

export default function StudentCertificatesPage() {
    const router = useRouter()
    const { data: session } = useSession()

    const certificates = [
        { title: "Web Development Bootcamp", date: "Jan 12, 2024", issuer: "Orbit Academy", id: "EDH-123-ABC" },
        { title: "Advanced React Patterns", date: "Feb 05, 2024", issuer: "Meta Technical Center", id: "MET-456-XYZ" },
    ]

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden sm:flex flex-col w-64 border-r border-border bg-sidebar">
                <div className="flex items-center justify-center py-6 border-b border-sidebar-border">
                    <img src="/logo.png" alt="Orbit" className="w-24 h-24 object-contain" />
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav userName={session?.user?.name || "Student"} userRole="Student" onLogout={() => router.push("/login")} />
                <main className="flex-1 overflow-auto bg-muted/20">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8 text-foreground">My Achievements</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {certificates.map((cert, i) => (
                                <Card key={i} className="hover:shadow-lg transition-all border-t-4 border-t-primary">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <Award className="w-8 h-8" />
                                            </div>
                                            <Badge variant="outline" className="text-[10px] font-mono">{cert.id}</Badge>
                                        </div>
                                        <CardTitle className="mt-4">{cert.title}</CardTitle>
                                        <CardDescription>Issued by {cert.issuer} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ {cert.date}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="flex-1 gap-2 text-xs">
                                                <Download className="w-3 h-3" /> Download PDF
                                            </Button>
                                            <Button variant="outline" className="flex-1 gap-2 text-xs">
                                                <ExternalLink className="w-3 h-3" /> Share
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Card className="border-dashed flex items-center justify-center p-12 text-center bg-muted/10">
                                <div className="space-y-2">
                                    <p className="text-muted-foreground italic">Complete more courses to earn prestigious certificates!</p>
                                    <Button variant="link" onClick={() => router.push("/dashboard/student/courses")}>Browse Courses</Button>
                                </div>
                            </Card>
                        </div>

                        <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-6">
                            <ShieldCheck className="w-12 h-12 text-primary shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold">Verified Credentials</h3>
                                <p className="text-sm text-muted-foreground">All certificates issued by Orbit are digitally signed and blockchain-verifiable. Employers can scan the internal QR code for instant validation.</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

function Badge({ children, className, variant = "default" }: { children: React.ReactNode; className?: string; variant?: string }) {
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${variant === 'outline' ? 'border border-border' : 'bg-primary text-primary-foreground'} ${className}`}>{children}</span>
}
