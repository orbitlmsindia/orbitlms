import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import Submission from "@/models/Submission";
import AssessmentResult from "@/models/AssessmentResult";
import Attendance from "@/models/Attendance";
import GamificationPoint from "@/models/GamificationPoint";
import Course from "@/models/Course";
import Assignment from "@/models/Assignment";
import Assessment from "@/models/Assessment";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const resolvedParams = await Promise.resolve(params);
    const studentId = resolvedParams.id;
    console.log(`[Dashboard API] Fetching data for student: ${studentId}`);

    try {
        await connectDB();
        console.log("[Dashboard API] DB connected");

        // Initialize robust data containers
        let student = null;
        let enrollments: any[] = [];
        let submissions: any[] = [];
        let assessmentResults: any[] = [];
        let attendance: any[] = [];
        let gamification = null;
        const debugLogs: string[] = [];

        // 1. Fetch Student Profile
        try {
            student = await User.findById(studentId).select("-password");
            if (!student) {
                return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
            }
            console.log("[Dashboard API] Student profile found");
        } catch (e: any) { debugLogs.push(`Profile Error: ${e.message}`); console.error(`[Dashboard API] Profile Error: ${e.message}`); }

        // 2. Fetch Enrolled Courses
        try {
            enrollments = await Enrollment.find({ student: studentId })
                .populate({
                    path: 'course',
                    populate: { path: 'instructor', select: 'name' }
                });
            console.log(`[Dashboard API] Enrollments fetched: ${enrollments.length}`);
        } catch (e: any) { debugLogs.push(`Enrollment Error: ${e.message}`); console.error(`[Dashboard API] Enrollment Error: ${e.message}`); }

        // 3. Fetch Assignments & Submissions
        try {
            submissions = await Submission.find({ student: studentId })
                .populate('assignment')
                .sort({ updatedAt: -1 });
            console.log(`[Dashboard API] Submissions fetched: ${submissions.length}`);
        } catch (e: any) { debugLogs.push(`Submission Error: ${e.message}`); console.error(`[Dashboard API] Submission Error: ${e.message}`); }

        // 4. Fetch Assessment Results
        try {
            assessmentResults = await AssessmentResult.find({ student: studentId })
                .sort({ attemptedAt: -1 });
            // Note: .populate('assessment') removed temporarily as AssessmentResult.assessment is String type in some versions, causing cast errors
            console.log(`[Dashboard API] Assessment Results fetched: ${assessmentResults.length}`);
        } catch (e: any) { debugLogs.push(`Results Error: ${e.message}`); console.error(`[Dashboard API] Results Error: ${e.message}`); }

        // 5. Fetch Attendance Summary
        try {
            attendance = await Attendance.find({ student: studentId });
        } catch (e: any) { debugLogs.push(`Attendance Error: ${e.message}`); console.error(`[Dashboard API] Attendance Error: ${e.message}`); }

        // 6. Fetch Gamification Data
        try {
            gamification = await GamificationPoint.findOne({ student: studentId });
        } catch (e: any) { debugLogs.push(`Gamification Error: ${e.message}`); console.error(`[Dashboard API] Gamification Error: ${e.message}`); }

        // 7. Calculate Stats & Lists
        const totalClasses = attendance.length;
        const presentClasses = attendance.filter(a => a.status === 'present').length;
        const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

        const validEnrollments = enrollments.filter(e => e.course);
        const avgProgress = validEnrollments.length > 0
            ? validEnrollments.reduce((acc, curr) => acc + curr.progress, 0) / validEnrollments.length
            : 0;

        // 8. Pending Tasks Calculation
        let pendingAssignmentsCount = 0;
        let pendingQuizzes: any[] = [];

        try {
            const enrolledCourseIds = validEnrollments.map(e => e.course._id);
            if (enrolledCourseIds.length > 0) {
                const allAssignments = await Assignment.find({ course: { $in: enrolledCourseIds } });
                const submittedAssignmentIds = submissions
                    .filter(s => s.assignment)
                    .map(s => s.assignment._id ? s.assignment._id.toString() : s.assignment.toString()); // Handle populated or unpopulated

                const pendingRefs = allAssignments.filter(a => !submittedAssignmentIds.includes(a._id.toString()));
                pendingAssignmentsCount = pendingRefs.length;

                // Pending Quizzes
                // Ensure we handle the type check for assessment references
                const attemptedAssessmentIds = assessmentResults.map(r => r.assessment.toString()); // Ensure string format

                pendingQuizzes = await Assessment.find({
                    course: { $in: enrolledCourseIds },
                    _id: { $nin: attemptedAssessmentIds }
                }).populate('course', 'title').limit(3);
            }
        } catch (e: any) {
            debugLogs.push(`Pending Calculation Error: ${e.message}`);
            console.error(`[Dashboard API] Pending Calculation Error: ${e.message}`);
        }

        return NextResponse.json({
            success: true,
            debug: debugLogs,
            data: {
                profile: student,
                stats: {
                    activeCourses: validEnrollments.length,
                    avgProgress: Math.round(avgProgress),
                    pendingTasks: pendingAssignmentsCount + pendingQuizzes.length,
                    attendancePercentage: Math.round(attendancePercentage),
                    totalPoints: gamification?.points || 0,
                    rank: 1,
                },
                courses: validEnrollments.map(e => ({
                    id: e.course._id,
                    title: e.course.title || "Untitled Course",
                    instructor: e.course.instructor?.name || "Unknown",
                    progress: e.progress,
                    image: e.course.image || "📚",
                    enrolled: e.enrolledAt,
                })),
                recentSubmissions: submissions.filter(s => s.assignment).slice(0, 5),
                assessmentResults: assessmentResults.slice(0, 5),
                gamification: {
                    points: gamification?.points || 0,
                    badges: gamification?.badges || [],
                },
                upcomingQuizzes: pendingQuizzes.map(q => ({
                    title: q.title,
                    course: (q.course as any)?.title || "General",
                    date: q.createdAt ? new Date(q.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "N/A"
                }))
            }
        });

    } catch (error: any) {
        console.error("Dashboard API Error CRITICAL:", error);
        console.error("Error Stack:", error.stack);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
