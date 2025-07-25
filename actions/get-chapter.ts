import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
    chapterId: string;
    userId: string;
    courseId: string;
}
export const getChapter = async ({
    chapterId,
    userId,
    courseId,
}: GetChapterProps) => {
    try {
     const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
    });
    
    const course = await db.course.findUnique({
        where: {
            isPublished: true,
            id: courseId,
        },
        select: {
            price: true,
        },
    });


    const chapter = await db.chapter.findUnique({
        where: {
            isPublished: true,
            id: chapterId,
        }
    });

    if (!chapter || !course) {
        throw new Error("Chapter or Course not found");
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter = null;

    if (purchase) {
        attachments = await db.attachment.findMany({
            where: {
                courseId: courseId,
            }
        });
    }

    if ( chapter.isFree || purchase) {
        muxData = await db.muxData.findUnique({
            where: {
                chapterId: chapterId,
            },
        });
        nextChapter = await db.chapter.findFirst({
            where: {
                courseId: courseId,
                isPublished: true,
                position: {
                    gt: chapter.position,
                },
            },
            orderBy: {
                position: "asc",
            },
        });
    }


    const userProgress = await db.userProgress.findUnique({
        where: {
            userId_chapterId: {
                userId,
                chapterId,
            },
        },
    });

    return {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    };



    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchased: null,
        }
    }
}