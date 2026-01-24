import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await connectDB();

        // 1. Clear existing data (Optional, handle with care)
        // await User.deleteMany({});
        // await Course.deleteMany({});

        // 2. Create Admin
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const admin = await User.findOneAndUpdate(
            { email: "admin@eduhub.com" },
            {
                name: "Super Admin",
                email: "admin@eduhub.com",
                password: hashedPassword,
                role: "admin",
                status: "active"
            },
            { upsert: true, new: true }
        );

        // 3. Create Teacher
        // 3. Create Teacher
        const teacherPassword = await bcrypt.hash("teacher123", 10);
        const teacher = await User.findOneAndUpdate(
            { email: "sarah@eduhub.com" },
            {
                name: "Dr. Sarah Johnson",
                email: "sarah@eduhub.com",
                password: teacherPassword,
                role: "teacher",
                status: "active"
            },
            { upsert: true, new: true }
        );

        // 3.1 Create Example Users (Matching Login Page)
        const demoPassword = await bcrypt.hash("demo123", 10);

        // Admin
        await User.findOneAndUpdate(
            { email: "admin@example.com" },
            {
                name: "Admin User",
                email: "admin@example.com",
                password: demoPassword,
                role: "admin",
                status: "active"
            },
            { upsert: true, new: true }
        );

        // Manager
        await User.findOneAndUpdate(
            { email: "manager@example.com" },
            {
                name: "Manager User",
                email: "manager@example.com",
                password: demoPassword,
                role: "manager",
                status: "active"
            },
            { upsert: true, new: true }
        );

        // Teacher
        await User.findOneAndUpdate(
            { email: "teacher@example.com" },
            {
                name: "Teacher User",
                email: "teacher@example.com",
                password: demoPassword,
                role: "teacher",
                status: "active"
            },
            { upsert: true, new: true }
        );

        // Student
        await User.findOneAndUpdate(
            { email: "student@example.com" },
            {
                name: "Student User",
                email: "student@example.com",
                password: demoPassword,
                role: "student",
                status: "active"
            },
            { upsert: true, new: true }
        );

        // 4. Create some Courses
        const courses = [
            {
                title: "Full Stack Web Development",
                description: "Master Modern Web Dev",
                category: "Development",
                instructor: teacher._id,
                status: "published",
                rating: 4.8
            },
            {
                title: "Advanced UX Design",
                description: "User Experience Patterns",
                category: "Design",
                instructor: teacher._id,
                status: "published",
                rating: 4.5
            }
        ];

        for (const c of courses) {
            await Course.findOneAndUpdate({ title: c.title }, c, { upsert: true });
        }

        return NextResponse.json({ success: true, message: "Institutional data and Example users seeded successfully. Try logging in with admin@example.com / demo123" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
