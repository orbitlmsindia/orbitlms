import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Report from "@/models/Report";

export async function GET() {
    try {
        await connectDB();
        const reports = await Report.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: reports });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        const report = await Report.create({
            title: body.title || `System_Report_${new Date().toISOString().split('T')[0]}`,
            type: body.type || "PDF",
            generatedBy: body.generatedBy || "Admin",
            status: "Completed",
            url: "#", // In a real app, this would be the upload URL
        });

        return NextResponse.json({ success: true, data: report }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
