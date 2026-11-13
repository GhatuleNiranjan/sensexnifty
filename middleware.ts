// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/admin/login",
    },
});

export const config = {
    matcher: ["/admin/:path*"], // Ensure this ONLY matches /admin pages
};