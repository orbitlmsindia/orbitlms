import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("[Auth] Missing credentials");
                    throw new Error("Invalid credentials");
                }

                await connectDB();
                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (!user || !user.password) {
                    console.log(`[Auth] User not found or no password for email: ${credentials.email}`);
                    throw new Error("User not found");
                }

                if (user.status !== 'active') {
                    console.log(`[Auth] User status is not active: ${user.status}`);
                    throw new Error(user.status === 'pending' ? "Account pending approval" : "Account is inactive/rejected");
                }

                const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordMatch) {
                    console.log(`[Auth] Password mismatch for user: ${credentials.email}`);
                    throw new Error("Incorrect password");
                }

                console.log(`[Auth] Login successful for: ${credentials.email}`);

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    instituteId: user.instituteId,
                    instituteName: user.instituteName,
                    status: user.status,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.instituteId = user.instituteId;
                token.instituteName = user.instituteName;
                token.status = user.status;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
                session.user.instituteId = token.instituteId;
                session.user.instituteName = token.instituteName;
                session.user.status = token.status;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
