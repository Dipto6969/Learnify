import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
    const { userId } = auth();
    const isAuthorized = isTeacher(userId);
    if (!userId || !isAuthorized) throw new Error("Unauthorized");
    return { userId };
}


export const ourFileRouter = {

    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
    
    /*
    courseAttachment: f(["text", "pdf", "video", "audio", "image"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
    */
    /* If you want to add different limits for different file types, you can do it like this: */
    courseAttachment: f({
        text: { maxFileSize: "1GB", maxFileCount: 10 },
        pdf: { maxFileSize: "1GB", maxFileCount: 10 },
        video: { maxFileSize: "1GB", maxFileCount: 5 }, // Set a limit for videos here
        audio: { maxFileSize: "1GB", maxFileCount: 5 },
        image: { maxFileSize: "1GB", maxFileCount: 10 }
    })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
    
    chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
  
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
