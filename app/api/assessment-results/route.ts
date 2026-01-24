import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AssessmentResult from "@/models/AssessmentResult";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get("studentId");
        const assessmentId = searchParams.get("assessmentId");

        const filter: any = {};
        if (studentId) filter.student = studentId;
        if (assessmentId) filter.assessment = assessmentId;

        const results = await AssessmentResult.find(filter)
            // .populate("assessment") // Removed because assessment is now a static ID string
            .populate("student", "name email");

        return NextResponse.json({ success: true, data: results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        if (!body.student || !body.assessment || body.score === undefined) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const result = await AssessmentResult.create(body);
        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
