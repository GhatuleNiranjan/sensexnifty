import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/admin/login",
    },
});

export const config = {
    matcher: [
        // Protect /admin dashboard and sub-pages, but EXCLUDE /admin/login
        "/admin/((?!login$).*)",
    ],
};