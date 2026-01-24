import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { courseId, lessonId } = await req.json();

        if (!courseId || !lessonId) {
            return NextResponse.json({ success: false, error: "Missing courseId or lessonId" }, { status: 400 });
        }

        // Find enrollment
        const enrollment = await Enrollment.findOne({
            student: session.user.id,
            course: courseId
        });

        if (!enrollment) {
            // [DEV] Auto-enroll if missing for seamless testing, OR return error. 
            // For now, let's return error as they should be enrolled.
            return NextResponse.json({ success: false, error: "Not enrolled in this course" }, { status: 404 });
        }

        // Add lesson to completedLessons if unique
        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
        } else {
            // If already completed, success but no change
            return NextResponse.json({ success: true, progress: enrollment.progress, completed: enrollment.completed });
        }

        // Recalculate Progress
        // 1. Get Course to count totals
        const course = await Course.findById(courseId);
        if (course) {
            let totalLessons = 0;
            // Iterate chapters to count lessons
            if (course.chapters && course.chapters.length > 0) {
                course.chapters.forEach((ch: any) => {
                    if (ch.lessons) totalLessons += ch.lessons.length;
                });
            }

            if (totalLessons > 0) {
                const completedCount = enrollment.completedLessons.length;
                let newProgress = (completedCount / totalLessons) * 100;
                if (newProgress > 100) newProgress = 100; // Cap at 100

                enrollment.progress = Math.round(newProgress);

                if (enrollment.progress === 100) {
                    enrollment.completed = true;
                }
            }
        }

        await enrollment.save();

        return NextResponse.json({
            success: true,
            progress: enrollment.progress,
            completed: enrollment.completed,
            completedLessons: enrollment.completedLessons
        });

    } catch (error: any) {
        console.error("Progress Update Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
