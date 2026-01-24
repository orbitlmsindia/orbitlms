import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import User from "@/models/User";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get("studentId");

        console.log(`[DEBUG] Enrollments GET: studentId=${studentId}, Requester=${session.user.id}`);

        if (!studentId) {
            return NextResponse.json({ success: false, error: "Student ID is required" }, { status: 400 });
        }

        // Access Control
        if (session.user.role === 'student' && session.user.id !== studentId) {
            return NextResponse.json({ success: false, error: "Unauthorized access to other student's enrollments" }, { status: 403 });
        }

        if (session.user.role !== 'student') {
            // Verify institute match
            const student = await User.findById(studentId);
            if (!student) {
                return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
            }
            if (session.user.instituteId && student.instituteId && session.user.instituteId !== student.instituteId.toString()) {
                return NextResponse.json({ success: false, error: "Unauthorized access to other institute's student" }, { status: 403 });
            }
        }

        const enrollments = await Enrollment.find({ student: studentId })
            .populate({
                path: 'course',
                populate: {
                    path: 'instructor',
                    select: 'name email'
                }
            })
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: enrollments });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        const { courseId } = body;

        if (!courseId) {
            return NextResponse.json({ success: false, error: "Course ID is required" }, { status: 400 });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
        }

        // Strictly Enforce Institute Check
        if (session.user.role !== 'admin') {
            if (!session.user.instituteId) {
                return NextResponse.json({ success: false, error: "User not linked to any institute" }, { status: 403 });
            }
            if (course.instituteId.toString() !== session.user.instituteId) {
                return NextResponse.json({ success: false, error: "Cannot enroll in course from another institute" }, { status: 403 });
            }
        }

        // Check availability/status if needed (e.g. published)

        // Check existing enrollment
        const existing = await Enrollment.findOne({ student: session.user.id, course: courseId });
        if (existing) {
            return NextResponse.json({ success: false, error: "Already enrolled" }, { status: 400 });
        }

        const enrollment = await Enrollment.create({
            student: session.user.id,
            course: courseId,
            progress: 0,
            enrolledAt: new Date()
        });

        // Update Course students array
        await Course.findByIdAndUpdate(courseId, { $addToSet: { students: session.user.id } });

        return NextResponse.json({ success: true, data: enrollment }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
