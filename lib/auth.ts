import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as any,
    providers: [
        EmailProvider({
            server: {
                host: "smtp.resend.com",
                port: 465,
                auth: {
                    user: "resend",
                    pass: process.env.RESEND_API_KEY,
                },
            },
            from: "SensexNifty Admin <onboarding@resend.dev>",
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            // SECURITY: Only allow this exact email to log in
            if (user.email === process.env.ADMIN_EMAIL) {
                return true;
            }
            return false; // Blocks anyone else
        },
    },
    pages: {
        signIn: "/admin/login",
        verifyRequest: "/admin/verify",
        error: "/admin/login",
    },
    session: {
        strategy: "jwt",
    },
};