import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        // 1. Basic Counts
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCourses = await Course.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments();

        // 2. Completion Stats
        const completedEnrollmentsCount = await Enrollment.countDocuments({ completed: true });
        const completionRate = totalEnrollments > 0 ? ((completedEnrollmentsCount / totalEnrollments) * 100).toFixed(1) : 0;

        // 3. Department/Course Performance (Average Progress per Course)
        // Aggregate progress by course
        const coursePerformance = await Enrollment.aggregate([
            {
                $group: {
                    _id: "$course",
                    avgProgress: { $avg: "$progress" },
                    totalStudents: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            {
                $unwind: "$courseDetails"
            },
            {
                $project: {
                    courseName: "$courseDetails.title",
                    avgProgress: { $round: ["$avgProgress", 0] },
                    totalStudents: 1
                }
            },
            { $sort: { avgProgress: -1 } },
            { $limit: 5 }
        ]);

        // 4. Recent Certifications (Completed Enrollments)
        const recentCertificates = await Enrollment.find({ completed: true })
            .sort({ updatedAt: -1 })
            .limit(10)
            .populate('student', 'name email')
            .populate('course', 'title');

        const formattedCertificates = recentCertificates.map(cert => ({
            id: cert._id.toString().slice(-6).toUpperCase(),
            name: cert.student?.name || "Unknown",
            course: cert.course?.title || "Unknown Course",
            date: new Date(cert.updatedAt).toLocaleDateString(),
            action: "Validate"
        }));

        // 5. Monthly Enrollment Trends (Mock for now or agg if createdAt exists)
        // Let's do a simple aggregation for last 6 months check
        // Skipping for speed, will use static trend data mixed with real total

        return NextResponse.json({
            success: true,
            data: {
                totalStudents,
                totalCourses,
                totalEnrollments,
                completedEnrollments: completedEnrollmentsCount,
                completionRate,
                coursePerformance,
                certificates: formattedCertificates
            }
        });

    } catch (error: any) {
        console.error("Manager Analytics API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
