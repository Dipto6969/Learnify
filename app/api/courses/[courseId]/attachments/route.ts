import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { urls } = await req.json(); // Expecting an array of URLs

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if the course belongs to the current user
        const courseOwner = await db.course.findFirst({
            where: {
                id: params.courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Validate that 'urls' is an array and not empty
        if (!Array.isArray(urls) || urls.length === 0) {
            return new NextResponse("Invalid request payload", { status: 400 });
        }

        // Create multiple attachments
        const attachments = await Promise.all(
            urls.map((url: string) => {
                const name = url.split("/").pop() || "unknown"; // Extract the file name
                return db.attachment.create({
                    data: {
                        url,
                        name,
                        courseId: params.courseId,
                    },
                });
            })
        );

        return NextResponse.json(attachments);
    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
