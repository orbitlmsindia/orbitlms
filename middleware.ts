import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Generic dashboard entry redirect
        if (path === "/dashboard") {
            let rolePath = "student";
            if (token?.role === "admin") rolePath = "admin";
            else if (token?.role === "teacher") rolePath = "teacher";
            else if (token?.role === "manager") rolePath = "manager";

            return NextResponse.redirect(new URL(`/dashboard/${rolePath}`, req.url));
        }

        // Rule: Only admins can access /dashboard/admin
        if (path.startsWith("/dashboard/admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Rule: Teachers can access /dashboard/teacher
        if (path.startsWith("/dashboard/teacher") && token?.role !== "teacher" && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Rule: Managers can access /dashboard/manager
        if (path.startsWith("/dashboard/manager") && token?.role !== "manager" && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Rule: Students can access /dashboard/student
        if (path.startsWith("/dashboard/student") && token?.role !== "student" && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard", "/dashboard/:path*"],
};
