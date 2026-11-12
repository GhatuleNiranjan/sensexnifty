"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WebP).");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload image");
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setError("");
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative aspect-[16/9] w-full border border-[#E0E0E0] bg-[#F8F8F8] overflow-hidden group">
          <Image
            src={value}
            alt="Uploaded cover preview"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 bg-[#6B1C2A] text-white p-2 hover:bg-red-800 transition-colors shadow-md flex items-center gap-1 text-xs font-sans font-bold uppercase tracking-wider"
          >
            <X className="w-4 h-4" /> Remove Image
          </button>
        </div>
      ) : (
        <label className="border-2 border-dashed border-[#E0E0E0] hover:border-[#1A1A1A] bg-[#F8F8F8] p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-[#6B6B6B]">
              <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
              <span className="text-xs font-sans font-bold uppercase tracking-wider">
                Uploading to Cloudinary...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white border border-[#E0E0E0] group-hover:border-[#1A1A1A] transition-colors">
                <Upload className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div>
                <p className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Click to select cover image
                </p>
                <p className="text-[10px] font-sans text-[#6B6B6B] mt-0.5">
                  High-resolution JPEG, PNG, or WebP recommended
                </p>
              </div>
            </div>
          )}
        </label>
      )}

      {error && (
        <p className="text-xs font-sans text-[#6B1C2A] font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}