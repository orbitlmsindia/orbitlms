import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            instituteId: string
            instituteName: string
            status: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role: string
        instituteId: string
        instituteName: string
        status: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
        instituteId: string
        instituteName: string
        status: string
    }
}
