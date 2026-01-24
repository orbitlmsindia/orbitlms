import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Assessment from "@/models/Assessment";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = await params;
        const assessment = await Assessment.findById(id).populate("course", "title");

        if (!assessment) {
            return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: assessment });
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
        const assessment = await Assessment.findByIdAndUpdate(id, body, { new: true });

        if (!assessment) {
            return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: assessment });
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
        const assessment = await Assessment.findByIdAndDelete(id);

        if (!assessment) {
            return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Assessment deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
