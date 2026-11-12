"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-xs font-sans font-semibold uppercase tracking-wider text-[#6B1C2A] hover:text-red-800 transition-colors flex items-center gap-1.5"
      title="Sign Out of Desk"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Sign Out</span>
    </button>
  );
}