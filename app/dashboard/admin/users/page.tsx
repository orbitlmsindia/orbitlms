"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Filter, MoreVertical, Edit, Trash2, Mail, Shield } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/admin", icon: "🏠" },
    { title: "Users", href: "/dashboard/admin/users", icon: "👥" },
    { title: "Courses", href: "/dashboard/admin/courses", icon: "📚" },
    { title: "Reports", href: "/dashboard/admin/reports", icon: "📊" },
    { title: "Settings", href: "/dashboard/admin/settings", icon: "⚙️" },
    { title: "Analytics", href: "/dashboard/admin/analytics", icon: "📈" },
]

interface User {
    id: string
    name: string
    email: string
    role: "student" | "teacher" | "manager" | "admin"
    status: "active" | "inactive"
    joinedDate: string
}

const mockUsers: User[] = [
    { id: "1", name: "Alex Johnson", email: "alex@example.com", role: "student", status: "active", joinedDate: "2024-01-15" },
    { id: "2", name: "Dr. Sarah Johnson", email: "sarah@example.com", role: "teacher", status: "active", joinedDate: "2024-01-10" },
    { id: "3", name: "Michael Brown", email: "michael@example.com", role: "student", status: "inactive", joinedDate: "2024-02-01" },
    { id: "4", name: "Prof. James Wilson", email: "james@example.com", role: "teacher", status: "active", joinedDate: "2024-01-20" },
    { id: "5", name: "Emily Chen", email: "emily@example.com", role: "manager", status: "active", joinedDate: "2024-01-25" },
    { id: "6", name: "David Miller", email: "david@example.com", role: "student", status: "active", joinedDate: "2024-02-05" },
    { id: "7", name: "Linda Garcia", email: "linda@example.com", role: "teacher", status: "active", joinedDate: "2024-02-10" },
    { id: "8", name: "Kevin Smith", email: "kevin@example.com", role: "student", status: "active", joinedDate: "2024-02-12" },
]

export default function UserManagementPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [isAddUserOpen, setIsAddUserOpen] = useState(false)
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "student" })
    const [isEditUserOpen, setIsEditUserOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const filteredUsers = mockUsers.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const handleAction = (action: string, data: any) => {
        if (typeof data === 'object' && data !== null && 'name' in data) {
            const user = data as User;
            setSelectedUser(user)
            if (action === 'Edit Profile') {
                setNewUser({ name: user.name, email: user.email, role: user.role })
                setIsEditUserOpen(true)
            } else if (action === 'Delete') {
                setIsDeleteOpen(true)
            } else {
                toast.success(`${action} for ${user.name}`, {
                    description: "This communication feature has been simulated.",
                })
            }
        } else {
            toast.success(`${action}: ${data}`, {
                description: "Action has been successfully simulated.",
            })
        }
    }

    const handleUpdateUser = () => {
        setIsEditUserOpen(false)
        toast.success("Profile Updated", {
            description: `Identity records for ${newUser.name} have been synchronized.`,
        })
    }

    const handleDeleteConfirm = () => {
        setIsDeleteOpen(false)
        toast.error("Account Terminated", {
            description: "User access has been permanently revoked from the system.",
        })
    }

    const handleCreateUser = () => {
        if (!newUser.name || !newUser.email) {
            toast.error("Required Fields Missing", {
                description: "Please enter both name and email to proceed.",
            })
            return
        }
        setIsAddUserOpen(false)
        toast.success("User Created", {
            description: `${newUser.name} has been added to the system.`,
        })
        setNewUser({ name: "", email: "", role: "student" })
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Premium Sidebar with Glassmorphism */}
            <aside className="hidden lg:flex flex-col w-72 border-r border-border/40 bg-sidebar/30 backdrop-blur-xl">
                <div className="flex items-center gap-4 px-10 py-12 border-b border-sidebar-border/40 group cursor-pointer" onClick={() => router.push("/")}>
                    <span className="text-2xl font-black tracking-tighter text-sidebar-foreground group-hover:text-primary transition-colors italic">EduHub</span>
                </div>
                <SidebarNav items={sidebarItems} onLogout={() => router.push("/login")} />
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <HeaderNav userName="Admin User" userRole="Administrator" onLogout={() => router.push("/login")} />

                <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-primary/[0.02] to-background">
                    <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto space-y-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div>
                                <h1 className="text-5xl font-black text-foreground tracking-tighter mb-3">User Management</h1>
                                <p className="text-lg text-muted-foreground font-medium">Control institutional access and define administrative roles.</p>
                            </div>
                            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                                <DialogTrigger asChild>
                                    <Button className="h-14 px-8 rounded-2xl bg-primary shadow-[0_10px_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_15px_30px_rgba(var(--primary-rgb),0.4)] hover:scale-105 transition-all font-black text-sm gap-3">
                                        <UserPlus className="w-5 h-5" /> Add Professional
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-[2rem] border-border/40 bg-card/95 backdrop-blur-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black tracking-tight">Access Control</DialogTitle>
                                        <DialogDescription className="font-medium">Define credentials for a new institutional user.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-6 py-8">
                                        <div className="space-y-3">
                                            <Label className="uppercase tracking-widest text-[10px] font-black text-muted-foreground ml-1">Full Name</Label>
                                            <Input placeholder="John Doe" className="h-12 bg-muted/30 border-none rounded-xl" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="uppercase tracking-widest text-[10px] font-black text-muted-foreground ml-1">Academic Email</Label>
                                            <Input type="email" placeholder="john@example.com" className="h-12 bg-muted/30 border-none rounded-xl" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="uppercase tracking-widest text-[10px] font-black text-muted-foreground ml-1">System Role</Label>
                                            <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                                                <SelectTrigger className="h-12 bg-muted/30 border-none rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="student">Student</SelectItem>
                                                    <SelectItem value="teacher">Teacher</SelectItem>
                                                    <SelectItem value="manager">Manager</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                                        <Button className="rounded-xl font-black px-8 bg-primary" onClick={handleCreateUser}>Authorize Account</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Card className="mb-12 border-border/40 bg-card/30 backdrop-blur-md rounded-[2rem] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="relative flex-1 group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            placeholder="Find accounts by name or academic email..."
                                            className="pl-12 h-14 bg-muted/20 border-none rounded-2xl text-base font-medium"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                                            <SelectTrigger className="w-[200px] h-14 border-border/40 rounded-2xl bg-card font-bold">
                                                <Filter className="w-5 h-5 mr-3 text-primary" />
                                                <SelectValue placeholder="All Categories" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl">
                                                <SelectItem value="all">All Profiles</SelectItem>
                                                <SelectItem value="student">Students</SelectItem>
                                                <SelectItem value="teacher">Instructors</SelectItem>
                                                <SelectItem value="manager">Coordinators</SelectItem>
                                                <SelectItem value="admin">System Admins</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline" onClick={() => handleAction('Export', 'CSV Data')} className="h-14 px-8 rounded-2xl font-black border-border/40 hover:bg-primary/5 hover:text-primary transition-all">
                                            Export Vault
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50 border-b">
                                            <th className="p-4 font-semibold text-sm">User</th>
                                            <th className="p-4 font-semibold text-sm">Role</th>
                                            <th className="p-4 font-semibold text-sm">Status</th>
                                            <th className="p-4 font-semibold text-sm">Joined Date</th>
                                            <th className="p-4 font-semibold text-sm text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{user.name}</p>
                                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="secondary" className="capitalize text-xs">
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <Badge
                                                        variant={user.status === "active" ? "default" : "destructive"}
                                                        className={`capitalize text-xs ${user.status === "active" ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""}`}
                                                    >
                                                        {user.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    {user.joinedDate}
                                                </td>
                                                <td className="p-6 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                                                <MoreVertical className="w-5 h-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-[1.5rem] border-border/40 shadow-2xl backdrop-blur-xl bg-card/90">
                                                            <DropdownMenuLabel className="font-black tracking-widest text-[10px] uppercase text-muted-foreground mb-1 px-3">Direct Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleAction('Edit Profile', user)} className="rounded-xl py-3 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors font-bold gap-3">
                                                                <Edit className="w-4 h-4" /> Edit Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('Send Email', user)} className="rounded-xl py-3 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors font-bold gap-3">
                                                                <Mail className="w-4 h-4" /> Send Email
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('Role Change', user)} className="rounded-xl py-3 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors font-bold gap-3">
                                                                <Shield className="w-4 h-4" /> Change Role
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-border/40" />
                                                            <DropdownMenuItem onClick={() => handleAction('Delete', user)} className="rounded-xl py-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center mt-1 font-bold gap-3">
                                                                <Trash2 className="w-4 h-4" /> Terminate Account
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredUsers.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground">
                                    No users found matching your criteria.
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Edit User Dialog */}
            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                <DialogContent className="rounded-[2rem] border-border/40 bg-card/95 backdrop-blur-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">Edit Identity</DialogTitle>
                        <DialogDescription className="font-medium">Modify institutional records for {selectedUser?.name}.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-8">
                        <div className="space-y-3">
                            <Label className="uppercase tracking-widest text-[10px] font-black text-muted-foreground ml-1">Full Name</Label>
                            <Input placeholder="John Doe" className="h-12 bg-muted/30 border-none rounded-xl" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                        </div>
                        <div className="space-y-3">
                            <Label className="uppercase tracking-widest text-[10px] font-black text-muted-foreground ml-1">Academic Email</Label>
                            <Input type="email" placeholder="john@example.com" className="h-12 bg-muted/30 border-none rounded-xl" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                        </div>
                        <div className="space-y-3">
                            <Label className="uppercase tracking-widest text-[10px] font-black text-muted-foreground ml-1">System Role</Label>
                            <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                                <SelectTrigger className="h-12 bg-muted/30 border-none rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
                        <Button className="rounded-xl font-black px-8 bg-primary" onClick={handleUpdateUser}>Apply Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="rounded-[2rem] border-border/40 bg-card/95 backdrop-blur-2xl max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight text-destructive">Danger Zone</DialogTitle>
                        <DialogDescription className="font-bold">Are you absolutely sure you want to terminate this account? This action is irreversible.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-4 sm:justify-center mt-6">
                        <Button variant="outline" className="rounded-xl font-bold flex-1" onClick={() => setIsDeleteOpen(false)}>Keep Access</Button>
                        <Button variant="destructive" className="rounded-xl font-bold flex-1" onClick={handleDeleteConfirm}>Terminate</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
            {children}
        </label>
    )
}
