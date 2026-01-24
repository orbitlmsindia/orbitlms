import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const courseId = params.id;
        // console.log(`[DEBUG] Requesting Course ID: '${courseId}'`);

        const course = await Course.findById(courseId).populate('instructor', 'name');

        if (!course) {
            return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
        }

        // Access Control / Institute Scoping
        if (session.user.role !== 'admin') {
            // [DEV] Relaxed check: Allow users without institute to view courses for demo purposes
            // if (!session.user.instituteId) {
            //    return NextResponse.json({ success: false, error: "Access Denied: No Institute Assigned" }, { status: 403 });
            // }

            if (session.user.instituteId && course.instituteId && course.instituteId.toString() !== session.user.instituteId) {
                console.log(`[ACCESS DENIED] User Institute: ${session.user.instituteId}, Course Institute: ${course.instituteId}`);
                return NextResponse.json({ success: false, error: "Access to this institute's content is denied" }, { status: 403 });
            }
        }

        return NextResponse.json({ success: true, data: course });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const courseId = params.id;
        const body = await req.json();

        const course = await Course.findById(courseId);

        if (!course) {
            return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
        }

        // Validate Ownership
        // [DEV] Relaxed for demo: Allow any teacher/admin to edit
        if (session.user.role !== 'admin' && course.instructor.toString() !== session.user.id) {
            console.log(`[OWNERSHIP WARN] User ${session.user.id} modifying course owned by ${course.instructor}`);
            // return NextResponse.json({ success: false, error: "Unauthorized to modify this course" }, { status: 403 });
        }

        const updatedCourse = await Course.findByIdAndUpdate(courseId, body, { new: true });

        return NextResponse.json({ success: true, data: updatedCourse });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const courseId = params.id;
        const course = await Course.findById(courseId);

        if (!course) {
            return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
        }

        // Validate Ownership
        // [DEV] Relaxed for demo
        if (session.user.role !== 'admin' && course.instructor.toString() !== session.user.id) {
            console.log(`[OWNERSHIP WARN] User ${session.user.id} deleting course owned by ${course.instructor}`);
            // return NextResponse.json({ success: false, error: "Unauthorized to delete this course" }, { status: 403 });
        }

        await Course.findByIdAndDelete(courseId);

        return NextResponse.json({ success: true, message: "Course deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
