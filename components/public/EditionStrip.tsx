"use client";

import { useEffect, useState } from "react";

export default function EditionStrip() {
    const [formattedDate, setFormattedDate] = useState<string>("");

    useEffect(() => {
        setFormattedDate(
            new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
    }, []);

    return (
        <div className="border-b border-[#E0E0E0] py-2 px-4 bg-white text-[10px] sm:text-[11px] font-sans text-[#6B6B6B] uppercase tracking-wider">
            <div className="max-w-7xl mx-auto flex justify-between items-center min-h-[18px]">
                <span>
                    {formattedDate ? `${formattedDate} · GLOBAL FINANCIAL EDITION` : "GLOBAL FINANCIAL EDITION"}
                </span>
                <span className="hidden sm:inline">UPDATED THROUGHOUT THE DAY</span>
            </div>
        </div>
    );
}