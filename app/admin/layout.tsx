import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminNavActions from "../../components/admin/AdminNavActions";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-[#F8F8F8] font-sans">
            {/* Admin Top Header */}
            <header className="bg-[#1A1A1A] text-white py-3 px-6 flex justify-between items-center border-b border-[#333333]">
                <div className="flex items-center space-x-6">
                    <Link href="/admin" className="font-masthead text-xl font-bold uppercase tracking-wider text-white">
                        SensexNifty <span className="text-xs font-sans text-[#A0A0A0] uppercase ml-2">Desk</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-4 text-xs font-semibold uppercase tracking-wider text-[#A0A0A0]">
                        <Link href="/admin" className="hover:text-white transition-colors">All Posts</Link>
                        <Link href="/admin/new" className="hover:text-white transition-colors text-[#64B5F6]">+ New Post</Link>
                        <Link href="/" target="_blank" className="hover:text-white transition-colors">Live Site ↗</Link>
                    </nav>
                </div>

                {session?.user && (
                    <AdminNavActions email={session.user.email || "Editor"} />
                )}
            </header>

            {/* Main Admin Body */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}