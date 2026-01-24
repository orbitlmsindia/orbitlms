import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // Check Institute Access
        if (session.user.instituteId && user.instituteId && session.user.instituteId !== user.instituteId.toString()) {
            return NextResponse.json({ success: false, error: "Unauthorized access to other institute data" }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // Authorization check
        if (session.user.instituteId && existingUser.instituteId && session.user.instituteId !== existingUser.instituteId.toString()) {
            return NextResponse.json({ success: false, error: "Unauthorized modification" }, { status: 403 });
        }

        const body = await request.json();

        // Hash password if provided in the update
        if (body.password && body.password !== "password123") {
            body.password = await bcrypt.hash(body.password, 10);
        } else {
            // Remove password from body if it's the placeholder "password123"
            delete body.password;
        }

        const user = await User.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).select("-password");

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // Authorization check
        if (session.user.instituteId && existingUser.instituteId && session.user.instituteId !== existingUser.instituteId.toString()) {
            return NextResponse.json({ success: false, error: "Unauthorized deletion" }, { status: 403 });
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
