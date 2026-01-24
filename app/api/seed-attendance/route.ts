import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import Attendance from '@/models/Attendance';

export async function GET() {
    try {
        await connectDB();
        const debugLogs: string[] = [];

        // 1. Get Enrolled Students for each course
        const courses = await Course.find({});
        if (courses.length === 0) return NextResponse.json({ message: 'No courses found' });

        let totalRecords = 0;
        const statusOptions = ['present', 'present', 'present', 'absent']; // Weighted random

        for (const course of courses) {
            // Find students enrolled in this course
            const enrollments = await Enrollment.find({ course: course._id });
            debugLogs.push(`Course ${course.title} has ${enrollments.length} enrollments`);

            if (enrollments.length === 0) continue;

            const students = enrollments.map((e: any) => e.student);

            // Generate attendance for the last 7 days
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);

                for (const studentId of students) {
                    const exists = await Attendance.findOne({
                        student: studentId,
                        course: course._id,
                        date: date
                    });

                    if (!exists) {
                        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];

                        await Attendance.create({
                            student: studentId,
                            course: course._id,
                            date: date,
                            status: randomStatus
                        });
                        totalRecords++;
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Created ${totalRecords} attendance records for the last 7 days.`,
            debug: debugLogs
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
