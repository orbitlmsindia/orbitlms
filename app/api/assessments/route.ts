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
        body.instituteId = session.user.instituteId;
        body.instituteName = session.user.instituteName;

        const assessment = await Assessment.create(body);
        return NextResponse.json({ success: true, data: assessment }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
