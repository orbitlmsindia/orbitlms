import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import Assignment from "@/models/Assignment";
import Submission from "@/models/Submission";
import Assessment from "@/models/Assessment";
import AssessmentResult from "@/models/AssessmentResult";
import GamificationPoint from "@/models/GamificationPoint";
import Attendance from "@/models/Attendance";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await connectDB();

        // 1. Create a dummy student
        const hashedPassword = await bcrypt.hash("student123", 10);
        const student = await User.findOneAndUpdate(
            { email: "student@eduhub.com" },
            {
                name: "Alex Johnson",
                email: "student@eduhub.com",
                password: hashedPassword,
                role: "student",
                status: "active",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            },
            { upsert: true, new: true }
        );

        // 2. Fetch or create a teacher
        const teacher = await User.findOne({ role: "teacher" });
        if (!teacher) throw new Error("Please run institutional seed first (/api/seed)");

        // 3. Fetch courses
        const courses = await Course.find();
        if (courses.length === 0) throw new Error("No courses found. Run seed first.");

        // 4. Enroll student in courses and add progress
        for (let i = 0; i < courses.length; i++) {
            await Enrollment.findOneAndUpdate(
                { student: student._id, course: courses[i]._id },
                {
                    student: student._id,
                    course: courses[i]._id,
                    progress: 30 + (i * 15),
                    completed: false
                },
                { upsert: true }
            );

            // Add some assignments for these courses
            const assignment = await Assignment.findOneAndUpdate(
                { title: `Assignment 1 for ${courses[i].title}`, course: courses[i]._id },
                {
                    title: `Assignment 1 for ${courses[i].title}`,
                    description: "Please complete the task described in the lecture notes.",
                    course: courses[i]._id,
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                },
                { upsert: true, new: true }
            );

            // Add a submission for the first course
            if (i === 0) {
                await Submission.findOneAndUpdate(
                    { student: student._id, assignment: assignment._id },
                    {
                        student: student._id,
                        assignment: assignment._id,
                        content: "I have completed the work.",
                        status: "pending"
                    },
                    { upsert: true }
                );
            }

            // Create some attendance
            for (let d = 0; d < 5; d++) {
                const date = new Date();
                date.setDate(date.getDate() - d);
                await Attendance.findOneAndUpdate(
                    { student: student._id, course: courses[i]._id, date: { $gte: new Date(date.setHours(0, 0, 0, 0)), $lt: new Date(date.setHours(23, 59, 59, 999)) } },
                    {
                        student: student._id,
                        course: courses[i]._id,
                        date: date,
                        status: Math.random() > 0.1 ? 'present' : 'absent'
                    },
                    { upsert: true }
                );
            }

            // Add an assessment
            const assessment = await Assessment.findOneAndUpdate(
                { title: `Midterm Quiz - ${courses[i].category}`, course: courses[i]._id },
                {
                    title: `Midterm Quiz - ${courses[i].category}`,
                    course: courses[i]._id,
                    type: "quiz",
                    duration: 30,
                    questions: [
                        { text: "What is HTML?", options: ["Lang", "Style", "Script", "Data"], correctAnswer: 0 }
                    ]
                },
                { upsert: true, new: true }
            );

            // Add a result for one assessment
            if (i === 1) {
                await AssessmentResult.findOneAndUpdate(
                    { student: student._id, assessment: assessment._id },
                    {
                        student: student._id,
                        assessment: assessment._id,
                        score: 85,
                        totalMarks: 100,
                        status: "passed"
                    },
                    { upsert: true }
                );
            }
        }

        // 5. Add Gamification points
        await GamificationPoint.findOneAndUpdate(
            { student: student._id },
            {
                student: student._id,
                points: 2850,
                badges: [
                    { name: "Quick Learner", icon: "⚡" },
                    { name: "Perfect Score", icon: "💯" }
                ]
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: "Student data seeded successfully.",
            studentId: student._id,
            login: "student@eduhub.com / student123"
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
