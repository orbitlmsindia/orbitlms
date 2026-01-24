import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Submission from "@/models/Submission";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get("studentId");
        const assignmentId = searchParams.get("assignmentId");

        const filter: any = {};
        if (studentId) filter.student = studentId;
        if (assignmentId) filter.assignment = assignmentId;

        const submissions = await Submission.find(filter)
            .populate("student", "name email")
            .populate("assignment", "title dueDate");

        return NextResponse.json({ success: true, data: submissions });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        if (!body.assignment || !body.student) {
            return NextResponse.json({ success: false, error: "Assignment and Student ID are required" }, { status: 400 });
        }

        // Check if a submission already exists for this assignment and student
        const existingSubmission = await Submission.findOne({
            assignment: body.assignment,
            student: body.student
        });

        let submission;
        if (existingSubmission) {
            // Update existing submission
            submission = await Submission.findByIdAndUpdate(existingSubmission._id, body, { new: true });
        } else {
            // Create new submission
            submission = await Submission.create(body);
        }

        return NextResponse.json({ success: true, data: submission }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
