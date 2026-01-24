import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Course from "@/models/Course";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const query: any = {};

        // Enforce Institute Scoping for Non-Admins
        if (session.user.role !== 'admin') {
            if (!session.user.instituteId) {
                // If a non-admin user somehow has no instituteId, they shouldn't see any data
                return NextResponse.json({ success: true, data: [] });
            }
            query.instituteId = session.user.instituteId;
        } else if (session.user.instituteId) {
            // Admin with instituteId (e.g. Institute Admin) sees only their institute
            query.instituteId = session.user.instituteId;
        }

        // Role-based filtering
        if (session.user.role === 'student') {
            query.status = 'published';
        } else if (session.user.role === 'teacher') {
            query.instructor = session.user.id;
        }

        const courses = await Course.find(query).populate('instructor', 'name email');
        return NextResponse.json({ success: true, data: courses });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        if (!session.user.instituteId) {
            return NextResponse.json({ success: false, error: "User is not linked to an institute" }, { status: 403 });
        }

        await connectDB();
        const body = await req.json();

        // Enforce institute details
        body.instituteId = session.user.instituteId;
        body.instituteName = session.user.instituteName;
        body.instructor = session.user.id;

        const course = await Course.create(body);
        return NextResponse.json({ success: true, data: course }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
