import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Institute from "@/models/Institute";

export async function GET() {
    try {
        await connectDB();
        const institutes = await Institute.find({ status: 'active' }).select('name _id code');
        return NextResponse.json({ success: true, data: institutes });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // Basic validation
        if (!body.name) {
            return NextResponse.json({ success: false, error: "Institute name is required" }, { status: 400 });
        }

        const institute = await Institute.create(body);
        return NextResponse.json({ success: true, data: institute }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
