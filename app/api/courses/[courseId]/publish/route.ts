import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
       
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", {
                status: 401,
            });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                }
            }

        });

        if(!course) {
            return new NextResponse("Not found", {
                status: 404,
            });
        }

        const haPublishedChapters = course.chapters.some(chapter => chapter.isPublished);

        if( !course.title || !course.description || !course.imageUrl || !course.categoryId || !haPublishedChapters) {
            return new NextResponse("Missing required fields", {
                status: 400,
            });
        }

        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: true,
            },
        });

        return NextResponse.json(publishedCourse);

    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal error", {
            status: 500,
        });

}
}