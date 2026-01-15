"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const features = [
  {
    title: "Courses",
    description: "Create, manage, and organize comprehensive course content with chapters and lessons",
    icon: "📚",
  },
  {
    title: "Assessments",
    description: "Design MCQ, subjective, and coding assessments to test student knowledge",
    icon: "✍️",
  },
  {
    title: "AI Assistant",
    description: "Smart learning companion to help students with personalized guidance",
    icon: "🤖",
  },
  {
    title: "Virtual Labs",
    description: "Interactive simulation environments for hands-on learning experiences",
    icon: "🔬",
  },
  {
    title: "Gamification",
    description: "Badges, leaderboards, and challenges to increase engagement",
    icon: "🏆",
  },
  {
    title: "Analytics",
    description: "Track progress and performance with detailed insights and reports",
    icon: "📊",
  },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl transition-all hover:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push("/")}>
              <div className="w-10 h-10 bg-gradient-to-tr from-primary via-primary/80 to-secondary rounded-xl flex items-center justify-center text-primary-foreground font-black shadow-[0_8px_16px_rgba(var(--primary-rgb),0.3)] group-hover:scale-110 transition-all duration-300">
                E
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">EduHub</span>
            </div>
            <div className="flex gap-8 items-center">
              <Button variant="ghost" onClick={() => router.push("/login")} className="hover:bg-primary/10 hover:text-primary font-bold hidden md:flex rounded-full px-6">
                Sign In
              </Button>
              <Button onClick={() => router.push("/register")} className="shadow-[0_10px_30px_rgba(var(--primary-rgb),0.4)] bg-primary hover:bg-primary/90 text-primary-foreground px-10 rounded-full font-black h-12 transition-all hover:scale-105 active:scale-95">
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-background via-primary/[0.03] to-background">
        {/* Abstract Background Orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[90px] animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-left space-y-12">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black tracking-[0.2em] uppercase animate-in fade-in slide-in-from-left-4 duration-1000">
                The Future of Learning
              </div>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-foreground leading-[1] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                Reshaping <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent italic px-1">
                  Knowledge.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground/80 max-w-xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                EduHub integrates advanced AI, intuitive course management, and interactive virtual labs into one seamless ecosystem for students and educators.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                <Button
                  size="lg"
                  onClick={() => router.push("/register")}
                  className="shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] bg-primary hover:bg-primary/90 hover:scale-105 transition-all px-12 rounded-full text-lg h-18 font-black"
                >
                  Create Portal
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                  className="hover:bg-primary/5 hover:border-primary border-primary/20 rounded-full px-12 text-lg h-18 font-black transition-all"
                >
                  Explore Tools
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-10 border-t border-border/50 max-w-sm animate-in fade-in duration-1000 delay-500">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User avatar" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold text-muted-foreground">Joined by <span className="text-foreground">1.2k+</span> students this week</p>
              </div>
            </div>

            <div className="relative group hidden lg:block perspective-1000 animate-in fade-in slide-in-from-right-12 duration-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-secondary/40 rounded-[2.5rem] blur opacity-20 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative rounded-[2rem] overflow-hidden border border-border/40 bg-card/40 backdrop-blur-md shadow-2xl transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.01]">
                <img
                  src="/lms_hero_modern.png"
                  alt="EduHub Platform Preview"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating Dynamic Metric */}
              <div className="absolute -bottom-12 -left-12 p-8 rounded-[2rem] bg-card border border-border shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-bounce-slow hidden xl:block">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group/icon">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-2 group-hover/icon:scale-110 transition-transform" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
                  </div>
                  <div>
                    <h4 className="font-black text-2xl tracking-tighter">98.4%</h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Satisfaction Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-32 space-y-6">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.4em]">Integrated Intelligence</h2>
            <h3 className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter">
              The tools you need to <br /><span className="text-muted-foreground/40">master any discipline.</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="p-12 rounded-[3rem] border border-border/30 bg-card/30 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(var(--primary-rgb),0.08)] hover:border-primary/40 hover:-translate-y-4 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-primary/10 transition-all"></div>
                <div className="text-7xl mb-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 origin-center drop-shadow-2xl">
                  {feature.icon}
                </div>
                <h4 className="text-3xl font-black text-foreground mb-6 tracking-tighter group-hover:text-primary transition-colors">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed text-lg font-medium opacity-70 group-hover:opacity-100 transition-opacity">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">Role-Based Dashboards</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tailored interfaces for students, teachers, managers, and admins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-2xl">
                  👤
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Student</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Access courses, track progress, take assessments, and interact with AI learning assistants
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Enrolled courses
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Progress tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Online assessments
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> AI assistant
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center text-2xl">
                  🎓
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Teacher</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Create courses, upload content, design assessments, and track student progress
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Course creation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Content management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Assessment design
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Attendance tracking
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center text-2xl">
                  📈
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Manager</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Monitor institutional performance, generate reports, and analyze learning outcomes
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Performance analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Custom reports
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Institutional data
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Dashboard insights
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-2xl">
                  ⚙️
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Admin</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Manage system, users, roles, permissions, and generate comprehensive reports
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> User management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> System analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Role management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Reports generation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Ready to Revolutionize Learning?</h2>
          <p className="text-lg opacity-95 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of educators and students using EduHub to create meaningful learning experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push("/register")}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2026 EduHub. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition text-sm">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition text-sm">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition text-sm">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div >
  )
}
