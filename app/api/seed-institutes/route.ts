import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Institute from "@/models/Institute";

export async function GET() {
    try {
        await connectDB();

        const existing = await Institute.findOne({ code: 'ORBIT_INIT' });
        if (existing) {
            return NextResponse.json({ success: true, message: "Institute already exists", data: existing });
        }

        const institute = await Institute.create({
            name: "Orbit Institute of Technology",
            code: "ORBIT_INIT",
            address: "123 Tech Park, Mars",
            status: "active"
        });

        return NextResponse.json({ success: true, message: "Instituted created", data: institute });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
