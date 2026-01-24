import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        const totalCourses = await Course.countDocuments();
        const students = await User.countDocuments({ role: 'student' });
        const teachers = await User.countDocuments({ role: 'teacher' });

        return NextResponse.json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                totalCourses,
                totalStudents: students,
                totalTeachers: teachers,
                systemHealth: 99, // Dynamic health check can be implemented later
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
