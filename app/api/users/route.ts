import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Institute from "@/models/Institute";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");
        const status = searchParams.get("status");

        const query: any = {};

        // SECURITY: If not admin, MUST have instituteId to see data
        if (session.user.role !== 'admin') {
            if (!session.user.instituteId) {
                // If user has no institute linked, they should see NOTHING, not everything.
                return NextResponse.json({ success: true, data: [] });
            }
            query.instituteId = session.user.instituteId;
        }

        if (role) query.role = role;
        if (status) query.status = status;

        const users = await User.find(query);
        return NextResponse.json({ success: true, data: users });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // Extract courses from body (deprecated for signup)
        const { courses, instituteId, ...userData } = body;

        console.log("Registration Attempt:", { email: userData.email, role: userData.role, instituteId });

        // Validate institute selection
        if (!instituteId || instituteId === "none" || instituteId.length !== 24) {
            console.error("Registration Failed: Invalid or missing instituteId", instituteId);
            return NextResponse.json({ success: false, error: "Please select a valid institute." }, { status: 400 });
        }

        // Fetch institute name
        const institute = await Institute.findById(instituteId);
        if (!institute) {
            return NextResponse.json({ success: false, error: "Invalid institute selected." }, { status: 400 });
        }

        // Set initial status
        if (userData.role === 'teacher') {
            userData.status = 'pending';
        } else {
            userData.status = 'active';
        }

        userData.instituteId = instituteId;
        userData.instituteName = institute.name;

        // Hash password if provided
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        const user = await User.create(userData);

        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error: any) {
        console.error("User Creation Error:", error);

        // Handle Duplicate Email
        if (error.code === 11000) {
            return NextResponse.json({ success: false, error: "This email is already registered." }, { status: 400 });
        }

        // Handle Mongoose Validation Errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            return NextResponse.json({ success: false, error: messages.join(', ') }, { status: 400 });
        }

        return NextResponse.json({ success: false, error: error.message || "Server Error" }, { status: 500 });
    }
}
