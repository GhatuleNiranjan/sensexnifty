export const SITE_CONFIG = {
    name: "SensexNifty",
    tagline: "News Behind The Numbers",
    slogan1: "INDEPENDENT FINANCIAL JOURNALISM",
    slogan2: "FACTS FIRST. CONTEXT ALWAYS.",
    adminEmail: "sensexnifty501@gmail.com",
};

export const CATEGORIES = [
    { name: "USA", slug: "usa" },
    { name: "EUROPE", slug: "europe" },
    { name: "RUSSIA", slug: "russia" },
    { name: "TECHNOLOGY", slug: "technology" },
    { name: "OPINION", slug: "opinion" },
    { name: "FINANCE", slug: "finance" },
    { name: "CHINA", slug: "china" },
    { name: "INDIAN STOCK", slug: "indian-stock" },
    { name: "RUSSIA-UKRAINE", slug: "russia-ukraine" },
    { name: "NATO", slug: "nato" },
    { name: "BROKERAGE REPORTS", slug: "brokerage-reports" },
    { name: "INDIA NEWS", slug: "india-news" },
] as const;

export function categoryName(value: string): string {
    return CATEGORIES.find(category => category.slug === value.toLowerCase())?.name || value;
}
