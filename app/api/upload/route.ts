import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const cloudName =
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            process.env.CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        // Direct Cloudinary Unsigned Upload fallback if preset exists
        if (cloudName && uploadPreset) {
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append("file", file);
            cloudinaryFormData.append("upload_preset", uploadPreset);

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: cloudinaryFormData,
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error?.message || "Cloudinary upload failed");
            }

            const data = await res.json();
            return NextResponse.json({ url: data.secure_url });
        }

        // Signed SDK upload if API Key and Secret are configured
        if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            const uploadResult = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ folder: "sensexnifty" }, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    })
                    .end(buffer);
            });

            return NextResponse.json({ url: uploadResult.secure_url });
        }

        return NextResponse.json(
            { error: "Cloudinary credentials missing in environment variables." },
            { status: 500 }
        );
    } catch (error: any) {
        console.error("Upload API error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload image" },
            { status: 500 }
        );
    }
}