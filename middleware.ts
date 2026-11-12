import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Exclude /admin/login from protection
                if (req.nextUrl.pathname === "/admin/login") {
                    return true;
                }
                // Protect all other /admin routes
                return !!token;
            },
        },
        pages: {
            signIn: "/admin/login",
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};