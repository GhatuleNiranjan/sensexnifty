"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CATEGORIES } from "@/lib/constants";

interface CategoryNavProps {
  activeCategory?: string;
}

export default function CategoryNav({ activeCategory }: CategoryNavProps) {
  const pathname = usePathname();

  return (
    <nav className="border-y border-[#E0E0E0] bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-6 xl:flex-wrap xl:justify-center xl:gap-x-6 xl:gap-y-3 overflow-x-auto py-2.5 text-xs font-sans font-bold uppercase tracking-widest no-scrollbar">
          {CATEGORIES.map((cat) => {
            const href = `/${cat.slug}`;
            const isActive = activeCategory
  ? activeCategory.toLowerCase() === cat.slug
  : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={cat.slug} className="shrink-0">
                <Link
                  href={href}
                  className={`transition-colors py-1 ${isActive
                      ? "text-[#1A3A5C] border-b-2 border-[#1A3A5C]"
                      : "text-[#1A1A1A] hover:text-[#1A3A5C]"
                    }`}
                >
                  {cat.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
