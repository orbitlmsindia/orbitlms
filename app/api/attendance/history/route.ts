import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Attendance from '@/models/Attendance';
import Course from '@/models/Course';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch attendance history and statistics
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');
        const studentId = searchParams.get('studentId');

        // Access Control
        if (session.user.role === 'student') {
            // Student can only view their own stats
            if (studentId && session.user.id !== studentId) {
                return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 403 });
            }
            // If no studentId provided, default to session user
            if (!studentId) {
                // But wait, the query logic below uses matchQuery.
                // We should enforce it in matchQuery
            }
        }

        const matchQuery: any = {};
        if (courseId) matchQuery.course = new mongoose.Types.ObjectId(courseId);

        if (session.user.role === 'student') {
            matchQuery.student = new mongoose.Types.ObjectId(session.user.id);
        } else if (studentId) {
            matchQuery.student = new mongoose.Types.ObjectId(studentId);
        }

        // If teacher/manager, we SHOULD ideally check if the course belongs to their institute.
        if (session.user.role !== 'student' && session.user.instituteId) {
            // If courseId provided, check its institute
            if (courseId) {
                const course = await Course.findById(courseId);
                if (course && course.instituteId && course.instituteId.toString() !== session.user.instituteId) {
                    return NextResponse.json({ success: false, error: "Unauthorized access to course" }, { status: 403 });
                }
            }
        }

        // Fetch attendance history grouped by date
        // matchQuery is already defined above

        // Fetch detailed attendance history
        const records = await Attendance.find(matchQuery)
            .sort({ date: -1 })
            .limit(50)
            .populate('student', 'name email rollNo')
            .populate('course', 'title');

        const history = records.map((record: any) => ({
            _id: record._id,
            date: record.date,
            course: record.course?.title || 'Unknown Course',
            studentName: record.student?.name || 'Unknown Student',
            studentEmail: record.student?.email,
            status: record.status,
        }));

        // Calculate overall statistics
        const stats = await Attendance.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalPresent: {
                        $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
                    },
                    totalAbsent: {
                        $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
                    },
                    totalLate: {
                        $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
                    },
                    totalRecords: { $sum: 1 }
                }
            }
        ]);

        const statistics = stats[0] || {
            totalPresent: 0,
            totalAbsent: 0,
            totalLate: 0,
            totalRecords: 0
        };

        return NextResponse.json({
            history,
            statistics: {
                ...statistics,
                attendancePercentage: statistics.totalRecords > 0
                    ? Math.round((statistics.totalPresent / statistics.totalRecords) * 100)
                    : 0
            }
        });

    } catch (error: any) {
        console.error('Error fetching attendance history:', error);
        return NextResponse.json(
            { error: 'Failed to fetch attendance history', details: error.message },
            { status: 500 }
        );
    }
}
