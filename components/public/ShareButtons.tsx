"use client";

import { useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";

interface ShareButtonsProps {
    url: string;
    title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <div className="flex items-center gap-2 pt-3">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B6B6B] mr-2">
                Share
            </span>

            {/* WhatsApp */}
            <a
                href={`https://wa.me/?text=${encodedTitle}%20-%20Read%20more%20at%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[#E0E0E0] flex items-center justify-center text-[#6B6B6B] hover:text-emerald-600 hover:border-emerald-600 bg-[#F8F8F8] transition-colors"
                title="Share on WhatsApp"
            >
                <svg
                    className="w-3.5 h-3.5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.549 4.11 1.512 5.842L0 24l6.328-1.48C8.016 23.468 9.96 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.817 0-3.522-.482-5.002-1.325l-.358-.203-3.722.871.988-3.627-.225-.369A9.948 9.948 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
                </svg>
            </a>

            {/* X / Twitter */}
            <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[#E0E0E0] flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] hover:border-[#1A1A1A] bg-[#F8F8F8] transition-colors"
                title="Share on X (Twitter)"
            >
                <svg
                    className="w-3.5 h-3.5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            </a>

            {/* LinkedIn */}
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[#E0E0E0] flex items-center justify-center text-[#6B6B6B] hover:text-[#0077b5] hover:border-[#0077b5] bg-[#F8F8F8] transition-colors"
                title="Share on LinkedIn"
            >
                <svg
                    className="w-3.5 h-3.5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M19 3a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
            </a>

            {/* Copy Link Button */}
            <button
                type="button"
                onClick={handleCopy}
                className={`w-8 h-8 rounded-full border flex items-center justify-center bg-[#F8F8F8] transition-colors ${copied
                        ? "border-emerald-600 text-emerald-600"
                        : "border-[#E0E0E0] text-[#6B6B6B] hover:text-[#1A1A1A] hover:border-[#1A1A1A]"
                    }`}
                title="Copy Link"
            >
                {copied ? (
                    <Check className="w-3.5 h-3.5" />
                ) : (
                    <LinkIcon className="w-3.5 h-3.5" />
                )}
            </button>
        </div>
    );
}