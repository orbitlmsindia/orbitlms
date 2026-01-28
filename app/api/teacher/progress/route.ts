import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import Attendance from "@/models/Attendance";
import Submission from "@/models/Submission";
import Assignment from "@/models/Assignment";
import AssessmentResult from "@/models/AssessmentResult";
import Assessment from "@/models/Assessment";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('courseId');

        if (!courseId) {
            return NextResponse.json({ success: false, error: "Course ID is required" }, { status: 400 });
        }

        // 1. Get Enrollments for this course
        const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email _id image');

        if (!enrollments || enrollments.length === 0) {
            return NextResponse.json({ success: true, data: [] });
        }

        // 2. Get Course Context Data (Total Assignments, Total Assessments)
        const totalAssignmentsCount = await Assignment.countDocuments({ course: courseId, status: 'Published' });
        // const totalAssessmentsCount = await Assessment.countDocuments({ course: courseId, status: 'Published' });

        // 3. Calculate Stats for each student
        const studentProgressData = await Promise.all(enrollments.map(async (enrollment: any) => {
            const student = enrollment.student;
            if (!student) return null;

            // A. Course Completion (Direct from enrollment)
            const courseCompletion = enrollment.progress || 0;

            // B. Attendance
            // Get all attendance records for this student in this course
            const attendanceRecords = await Attendance.find({ student: student._id, course: courseId });
            const totalClasses = attendanceRecords.length;
            const presentClasses = attendanceRecords.filter((r: any) => r.status === 'present').length;
            const attendancePct = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0; // Default to 0 or 100? Using 0 if no classes recorded.

            // C. Assignments & Submissions
            // Submissions by this student for assignments in this course
            // We need to find submissions where the related assignment belongs to this course.
            // Optimized: Find assignments for course first (done above logically), then check submissions.
            // Getting submissions is a bit complex efficiently without deep populate or aggregation.
            // Let's iterate: find submissions for this student, populate assignment, check if assignment.course == courseId
            // Better: Find assignments for this course -> get IDs -> find submissions for this student AND assignment in IDs
            const courseAssignmentIds = await Assignment.find({ course: courseId }).distinct('_id');
            const submittedCount = await Submission.countDocuments({
                student: student._id,
                assignment: { $in: courseAssignmentIds }
            });

            // D. Overall Score (Average of Quizzes/Assessments)
            // Similar logic: Get assessments for course -> get results for student
            const courseAssessmentIds = await Assessment.find({ course: courseId }).distinct('_id');
            const assessmentResults = await AssessmentResult.find({
                student: student._id,
                assessment: { $in: courseAssessmentIds }
            });

            let totalScorePct = 0;
            let resultCount = 0;

            assessmentResults.forEach((res: any) => {
                if (res.totalMarks > 0) {
                    totalScorePct += (res.score / res.totalMarks) * 100;
                    resultCount++;
                }
            });

            const overallScore = resultCount > 0 ? Math.round(totalScorePct / resultCount) : 0;

            // E. Determine Status
            let status = 'Average';
            if (overallScore >= 80 && attendancePct >= 80) status = 'Excellent';
            else if (overallScore >= 60 && attendancePct >= 70) status = 'Good';
            else if (overallScore < 40 || attendancePct < 50) status = 'At Risk';

            return {
                id: student._id,
                name: student.name,
                email: student.email,
                avatar: student.image || student.name.charAt(0).toUpperCase(),
                courseCompletion,
                attendance: attendancePct,
                assignmentsSubmitted: submittedCount,
                totalAssignments: totalAssignmentsCount,
                overallScore,
                status
            };
        }));

        // Filter out nulls (if any student was missing from enrollment population)
        const validData = studentProgressData.filter(Boolean);

        return NextResponse.json({ success: true, data: validData });

    } catch (error: any) {
        console.error("Progress API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
