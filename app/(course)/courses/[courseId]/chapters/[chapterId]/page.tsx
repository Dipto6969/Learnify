import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButon } from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    attachments,
    muxData,
    nextChapter,
    purchase,
    userProgress,
    course,
  } = await getChapter({
    chapterId: params.chapterId,
    userId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div className="pb-20">
      {userProgress?.isCompleted && (
        <Banner variant="success" label=" You already completed this chapter" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label=" You need to purchase the course to watch this chapter"
        />
      )}

      <div className="max-w-5xl mx-auto px-4 mt-6">
        {/* Video Section */}
        <div className="rounded-xl overflow-hidden shadow-md border">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            playbackId={muxData?.playbackId!}
          />
        </div>

        {/* Title + Progress/Enroll Button */}
        <div className="mt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButon
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={params.courseId} price={course.price!} />
            )}
          </div>

          

          {/* Free Chapter Highlight */}
          {chapter.isFree && !purchase && (
            <div className="mt-4 p-4 border border-emerald-300 bg-emerald-50 text-emerald-800 rounded-lg shadow-sm">
              <p className="font-medium flex items-center gap-2">
                <span className="text-xl">✅</span> This chapter is free to watch — no enrollment needed!
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-6">
          <Separator />
          <div className="mt-4 prose prose-sky dark:prose-invert">
            <Preview value={chapter.description!} />
          </div>
        </div>

        {isLocked && (
          <div className="mt-10 p-6 bg-yellow-50 border border-yellow-300 rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-semibold text-yellow-800">Unlock all course content!</h3>
            <p className="text-yellow-700 mt-2">
              Purchase the course to access this and all other premium chapters, resources, and videos.
            </p>
            <div className="mt-4">
              <CourseEnrollButton courseId={params.courseId} price={course.price!} />
            </div>
          </div>
        )}

        {/* Attachments */}
        {!!attachments.length && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="text-xl font-semibold mb-4 text-sky-800">📎 Attachments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    key={attachment.id}
                    target="_blank"
                    className="flex items-center gap-3 p-4 bg-sky-100 border border-sky-300 text-sky-800 rounded-lg hover:bg-sky-200 transition-colors"
                  >
                    <File className="w-5 h-5" />
                    <span className="truncate">{attachment.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterIdPage;
