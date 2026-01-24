import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Assignment from "@/models/Assignment";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = await params;
        const assignment = await Assignment.findById(id).populate("course", "title");
        if (!assignment) {
            return NextResponse.json({ success: false, error: "Assignment not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: assignment });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const assignment = await Assignment.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!assignment) {
            return NextResponse.json({ success: false, error: "Assignment not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: assignment });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = await params;
        const assignment = await Assignment.findByIdAndDelete(id);

        if (!assignment) {
            return NextResponse.json({ success: false, error: "Assignment not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Assignment deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
