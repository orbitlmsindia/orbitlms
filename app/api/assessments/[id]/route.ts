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

        // Handle Custom Course Logic (Shared with POST logic strictly speaking, but implemented here for robustness)
        // If body.course is present and not an ID, find/create course.
        if (body.course) {
            const isObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
            if (!isObjectId(body.course)) {
                const Course = (await import("@/models/Course")).default;
                // We need session context if we create a course... but PUT implies authenticated context usually.
                // Ideally we should get session here too to set instructor/institute if creating new.
                // For now, let's assume if editing, we might restrict 'Creating New Custom Course' to only if it's found, 
                // OR we grab session. 
                const { getServerSession } = await import("next-auth");
                const { authOptions } = await import("@/lib/auth");
                const session = await getServerSession(authOptions);

                if (session?.user) {
                    let courseDoc = await Course.findOne({
                        title: body.course,
                        instituteId: session.user.instituteId
                    });

                    if (!courseDoc) {
                        courseDoc = await Course.create({
                            title: body.course,
                            instructor: session.user.id,
                            instituteId: session.user.instituteId,
                            instituteName: session.user.instituteName,
                            type: 'custom',
                            status: 'published',
                            category: 'Custom Subject'
                        });
                    }
                    body.course = courseDoc._id;
                }
            }
        }

        // Ensure timeLimit sync
        if (body.timeLimit) {
            body.duration = body.timeLimit;
        } else if (body.duration) {
            body.timeLimit = body.duration;
        }

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
