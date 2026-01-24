import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();

        // Force update admin user
        const admin = await User.findOneAndUpdate(
            { email: "admin@example.com" },
            {
                role: "admin"
            },
            { new: true }
        );

        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "User admin@example.com not found. Please run the seed script first."
            });
        }

        return NextResponse.json({
            success: true,
            message: "Fixed successfully",
            user: {
                email: admin.email,
                role: admin.role,
                name: admin.name
            }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
