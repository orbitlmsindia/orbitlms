import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Institute from "@/models/Institute";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        // BYPASS SESSION FOR REPAIR
        await connectDB();

        // TARGET SPECIFIC USER
        // instituteId taken from the teacher record found in debug: 6970a418a8320f38d214db82
        const INSTITUTE_ID = "6970a418a8320f38d214db82";
        const TARGET_EMAIL = "orchid@gmail.com";

        // Find default institute details
        const institute = await Institute.findById(INSTITUTE_ID);
        if (!institute) {
            return NextResponse.json({ error: "Target institute not found." }, { status: 404 });
        }

        // Update User
        const user = await User.findOneAndUpdate(
            { email: TARGET_EMAIL },
            {
                instituteId: institute._id,
                instituteName: institute.name
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "Manager user not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "REPAIR SUCCESSFUL: Manager linked to Institute",
            user: { name: user.name, institute: user.instituteName }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
