import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/admin/login",
    },
});

export const config = {
    // Protect all /admin routes (except login pages) and API routes
    matcher: [
        "/admin",
        "/admin/new",
        "/admin/edit/:path*",
        "/api/posts/:path*",
        "/api/upload/:path*"
    ],
};