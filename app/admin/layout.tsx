import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { Settings } from "lucide-react";
import Providers from "@/components/Providers";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <Providers><div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A]">
            {session?.user && (
                <header className="bg-white border-b border-[#E0E0E0] sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/admin" className="group">
                                <span className="font-serif text-xl font-black tracking-tight group-hover:opacity-80 transition-opacity">
                                    SENSEXNIFTY
                                </span>
                                <span className="ml-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B6B6B]">
                                    Desk Admin
                                </span>
                            </Link>
                            <nav className="hidden md:flex items-center gap-4 text-xs font-sans font-semibold uppercase tracking-wider">
                                <Link href="/admin" className="text-[#1A1A1A] hover:text-[#1A3A5C] transition-colors">
                                    Articles
                                </Link>
                                <Link href="/admin/new" className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-3 py-1.5 transition-colors">
                                    + New Article
                                </Link>
                                <Link href="/" target="_blank" className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                                    View Live Site ↗
                                </Link>
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 border-r border-[#E0E0E0] pr-4">
                                <img
                                    src={session.user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                                    alt={session.user.name || "Author"}
                                    className="w-8 h-8 rounded-full object-cover border border-[#E0E0E0]"
                                />
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-sans font-bold text-[#1A1A1A] leading-tight">
                                        {session.user.name}
                                    </p>
                                    <Link href="/admin/profile" className="text-[10px] font-sans text-[#1A3A5C] hover:underline flex items-center gap-1 mt-0.5">
                                        <Settings className="w-3 h-3" /> Profile Settings
                                    </Link>
                                </div>
                            </div>
                            <AdminLogoutButton />
                        </div>
                    </div>
                </header>
            )}
            <main>{children}</main>
        </div></Providers>
    );
}
