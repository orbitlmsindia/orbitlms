import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Attendance from '@/models/Attendance';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch students for a specific course/date
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');
        const date = searchParams.get('date');

        if (!courseId) {
            return NextResponse.json(
                { error: 'Course ID is required' },
                { status: 400 }
            );
        }

        // Verify Institute Access (Teacher/Manager)
        if (session.user.role !== 'student' && session.user.instituteId) {
            const course = await Course.findById(courseId);
            if (course && course.instituteId && course.instituteId.toString() !== session.user.instituteId) {
                return NextResponse.json({ success: false, error: "Unauthorized access to course" }, { status: 403 });
            }
        }

        // Get all students enrolled in this course
        const enrollments = await Enrollment.find({ course: courseId })
            .populate('student', 'name email _id')
            .lean();

        if (!enrollments || enrollments.length === 0) {
            return NextResponse.json({
                students: [],
                message: 'No students enrolled in this course'
            });
        }

        // If date is provided, get attendance for that date
        let attendanceRecords: any[] = [];
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            attendanceRecords = await Attendance.find({
                course: courseId,
                date: { $gte: startOfDay, $lte: endOfDay }
            }).lean();
        }

        // Map students with their attendance status
        const students = enrollments
            .filter((enrollment: any) => {
                if (!enrollment.student) return false;
                return true;
            })
            .map((enrollment: any) => {
                const student = enrollment.student;
                const attendanceRecord = attendanceRecords.find(
                    (record: any) => record.student.toString() === student._id.toString()
                );

                return {
                    id: student._id.toString(),
                    name: student.name || "Unknown Name",
                    email: student.email,
                    rollNo: student._id.toString().slice(-6).toUpperCase(), // Generate roll number from ID
                    status: attendanceRecord ? attendanceRecord.status : 'pending'
                };
            });

        return NextResponse.json({ students });

    } catch (error: any) {
        console.error('Error fetching students:', error);
        return NextResponse.json(
            { error: 'Failed to fetch students', details: error.message },
            { status: 500 }
        );
    }
}

// POST: Mark attendance for students
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role === 'student') {
            return NextResponse.json({ success: false, error: "Students cannot mark attendance" }, { status: 403 });
        }

        await connectDB();

        const body = await request.json();
        const { courseId, date, students } = body;

        if (!courseId || !date || !students || !Array.isArray(students)) {
            return NextResponse.json(
                { error: 'Course ID, date, and students array are required' },
                { status: 400 }
            );
        }

        // Verify Institute Access
        if (session.user.instituteId) {
            const course = await Course.findById(courseId);
            if (course && course.instituteId && course.instituteId.toString() !== session.user.instituteId) {
                return NextResponse.json({ success: false, error: "Unauthorized access to course" }, { status: 403 });
            }
        }

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        // Update or create attendance records
        const results = await Promise.all(
            students.map(async (student: any) => {
                if (student.status === 'pending') {
                    return null; // Skip pending status
                }

                return await Attendance.findOneAndUpdate(
                    {
                        student: student.id,
                        course: courseId,
                        date: attendanceDate
                    },
                    {
                        status: student.status,
                        student: student.id,
                        course: courseId,
                        date: attendanceDate,
                        instituteId: session.user.instituteId // Add institute scope if not in schema (Wait, schema HAS instituteId)
                    },
                    {
                        upsert: true,
                        new: true
                    }
                );
            })
        );

        const savedRecords = results.filter(r => r !== null);

        return NextResponse.json({
            success: true,
            message: `Attendance marked for ${savedRecords.length} students`,
            count: savedRecords.length
        });

    } catch (error: any) {
        console.error('Error marking attendance:', error);
        return NextResponse.json(
            { error: 'Failed to mark attendance', details: error.message },
            { status: 500 }
        );
    }
}
