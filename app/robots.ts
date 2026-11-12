import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sensexnifty.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin", "/admin/", "/api/"],
            },
            {
                userAgent: "Googlebot",
                allow: "/",
                disallow: ["/admin", "/admin/", "/api/"],
            },
            {
                userAgent: "Googlebot-News",
                allow: "/",
                disallow: ["/admin", "/admin/", "/api/"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}