import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();
        const users = await User.find({}, 'name email role instituteId status');
        return NextResponse.json({ success: true, count: users.length, data: users });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
