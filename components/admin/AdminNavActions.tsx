"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminNavActions({ email }: { email: string }) {
    return (
        <div className="flex items-center space-x-4 text-xs font-sans">
            <span className="text-[#A0A0A0] hidden sm:inline">{email}</span>
            <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center space-x-1 bg-[#2A2A2A] hover:bg-[#333333] text-white px-3 py-1.5 border border-[#444444] transition-colors uppercase font-bold text-[10px] tracking-wider cursor-pointer"
            >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
            </button>
        </div>
    );
}