"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
    onChange: (urls?: string[]) => void; // Accept an array of URLs
    endpoint: keyof typeof ourFileRouter;
};

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                const urls = res?.map((file) => file.url); // Collect all file URLs
                onChange(urls); // Pass the array of URLs to the parent component
            }}
            onUploadError={(error: Error) => {
                toast.error(`${error?.message}`);
            }}
        />
    );
};
