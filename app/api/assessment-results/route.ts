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

        // Check if this is a "Start Quiz" request (status: in-progress)
        if (body.status === 'in-progress') {
            // Check if already exists
            const existing = await AssessmentResult.findOne({
                student: body.student,
                assessment: body.assessment,
                status: 'in-progress'
            });

            if (existing) {
                return NextResponse.json({ success: true, data: existing });
            }

            const result = await AssessmentResult.create({
                student: body.student,
                assessment: body.assessment,
                status: 'in-progress',
                startedAt: new Date(),
                score: 0,
                totalMarks: 0 // Will be updated on submission
            });
            return NextResponse.json({ success: true, data: result }, { status: 201 });
        }

        if (!body.student || !body.assessment || body.score === undefined) {
            // If we are submitting (completed), we might be updating an existing in-progress one
            // But for now, let's see if we can handle update logic here or if we need a PUT.
            // The frontend 'handleSubmit' currently POSTs a new one. We should change that to PUT if it exists.
            // Or we can handle it here: check if exists, then update.

            // Let's modify this to Upsert or Update if specific ID provided or found
        }

        // Handle Submission (Update existing or Create new)
        let result = await AssessmentResult.findOne({
            student: body.student,
            assessment: body.assessment
        });

        if (result) {
            // Update
            result.score = body.score;
            result.totalMarks = body.totalMarks;
            result.status = body.status;
            result.answers = body.answers;
            result.completedAt = new Date();
            await result.save();
        } else {
            // Create (Fallback)
            result = await AssessmentResult.create({
                ...body,
                startedAt: new Date(),
                completedAt: new Date()
            });
        }

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
