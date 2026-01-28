import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Assessment from "@/models/Assessment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get("courseId");

        const filter: any = {};
        if (courseId) filter.course = courseId;

        // Enforce Institute Scoping
        if (session.user.role !== 'admin') {
            if (!session.user.instituteId) {
                return NextResponse.json({ success: true, data: [] });
            }
            filter.instituteId = session.user.instituteId;

            // If Student, only show Published assessments
            // (Assuming 'student' role string check - adjust if role is 'Student')
            if (session.user.role.toLowerCase() === 'student') {
                filter.status = 'published';
            }
        } else if (session.user.instituteId) {
            filter.instituteId = session.user.instituteId;
        }

        const assessments = await Assessment.find(filter).populate("course", "title");

        return NextResponse.json({ success: true, data: assessments });
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

        if (!session.user.instituteId) {
            return NextResponse.json({ success: false, error: "User is not linked to an institute" }, { status: 403 });
        }

        await connectDB();
        const body = await req.json();

        if (!body.title || !body.course) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // Enforce institute details
        // Enforce institute details
        body.instituteId = session.user.instituteId;
        body.instituteName = session.user.instituteName;
        body.status = 'published'; // Default to published for now as per requirement "Ensure default is published"
        body.teacher = session.user.id; // Ensure teacherId is saved as requested

        // Ensure timeLimit is handled (if passed as timeLimit or duration)
        if (body.timeLimit) {
            body.duration = body.timeLimit; // Sync for legacy property
        } else if (body.duration) {
            body.timeLimit = body.duration;
        }

        // Handle Custom Course Logic
        // 1. Check if body.course is a valid ObjectId
        // We need mongoose import but it's not at top level in snippet view... 
        // Assuming mongoose is implicitly available via models or I should use string check.
        // Actually, importing mongoose at top of file is better.
        // I will trust that mongoose is available as the models use it, but I'll use simple check.
        // Or I can add `import mongoose from 'mongoose';` at the top? It's not imported in line 1-6.
        // Wait, line 3 imports `Assessment`. 
        // I will use regex for ObjectId check to avoid needing mongoose import mid-function.

        const isObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

        let courseId = body.course;
        // If it's NOT a valid ID, assume it's a Title
        if (!isObjectId(courseId)) {
            // Find or Create Course by Title
            const Course = (await import("@/models/Course")).default;

            let courseDoc = await Course.findOne({
                title: body.course,
                instituteId: session.user.instituteId
            });

            if (!courseDoc) {
                courseDoc = await Course.create({
                    title: body.course,
                    instructor: session.user.id,
                    instituteId: session.user.instituteId,
                    instituteName: session.user.instituteName,
                    type: 'custom',
                    status: 'published',
                    category: 'Custom Subject'
                });
            }
            body.course = courseDoc._id;
        }

        const assessment = await Assessment.create(body);
        return NextResponse.json({ success: true, data: assessment }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
