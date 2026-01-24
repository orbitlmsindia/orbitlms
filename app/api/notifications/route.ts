import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, error: "UserId required" }, { status: 400 });
        }

        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(20);

        return NextResponse.json({ success: true, data: notifications });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { ids } = body; // Array of IDs to mark read

        if (ids && Array.isArray(ids)) {
            await Notification.updateMany(
                { _id: { $in: ids } },
                { $set: { isRead: true } }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const notification = await Notification.create(body);
        return NextResponse.json({ success: true, data: notification });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
