import Mux from "@mux/mux-node";//
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";


const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
const Video = video;


export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", {
                status: 401,
            });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if(!ownCourse) {
            return new NextResponse("Unauthorized", {
                status: 401,
            });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
        });

        if(!chapter) {
            return new NextResponse("Not found", {
                status: 404,
            });
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId,
            },
        });

        

        if(chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                },
            });

            if(existingMuxData) {
                await Video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }
        }

        // const deletedChapter = await db.chapter.delete({
        //     where: {
        //         id: params.chapterId,
        //     },
        // });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            },
        });

        if(!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                },
            });
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]", error);
        return new NextResponse("Internal error", {
            status: 500,
        });
    }
}




export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
  ) {
    try {
      const { userId } = auth();
      const { isPublished, ...values } = await req.json();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const ownCourse = await db.course.findUnique({
        where: {
          id: params.courseId,
          userId,
        },
      });
  
      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      // Fetch existing video data
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      });
  
      // 1. If there's a new video URL, delete the old asset
      let newAsset = null;
      if (values.videoUrl && values.videoUrl !== "") {
        if (existingMuxData) {
          try {
            await Video.assets.delete(existingMuxData.assetId);
          } catch (muxError: any) {
            if (muxError.status === 404) {
              console.warn(`[MUX_ASSET_DELETE_WARNING] Already deleted: ${existingMuxData.assetId}`);
            } else {
              console.error(`[MUX_ASSET_DELETE_ERROR]`, muxError);
            }
          } finally {
            await db.muxData.delete({
              where: { id: existingMuxData.id },
            });
          }
        }
  
        // 2. Create new asset only if new URL provided
        try {
          newAsset = await Video.assets.create({
            input: values.videoUrl,
            playback_policy: ["public"],
            test: true,
          });
        } catch (muxError) {
          console.error("[MUX_ASSET_CREATE_ERROR]", muxError);
          return new NextResponse("Failed to create Mux asset", { status: 500 });
        }
      }
  
      // 3. Update the chapter with the new values
      const chapter = await db.chapter.update({
        where: {
          id: params.chapterId,
          courseId: params.courseId,
        },
        data: {
          ...values,
        },
      });
  
      // 4. Save new muxData if needed
      if (newAsset) {
        await db.muxData.create({
          data: {
            assetId: newAsset.id,
            playbackId: newAsset.playback_ids?.[0]?.id,
            chapterId: params.chapterId,
          },
        });
      }
  
      return NextResponse.json(chapter);
    } catch (error) {
      console.error("[CHAPTER_PATCH_ERROR]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
  