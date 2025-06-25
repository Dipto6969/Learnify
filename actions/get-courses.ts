import { Category, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
  isPurchased: boolean; // Add purchase status
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
          mode: "insensitive",
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        const isPurchased = course.purchases.length > 0;

        if (!isPurchased) {
          return {
            ...course,
            progress: null,
            isPurchased,
          };
        }

        const progressPercentage = await getProgress(userId, course.id);

        return {
          ...course,
          progress: progressPercentage,
          isPurchased,
        };
      })
    );

    // Sort: unpurchased courses first
    const sortedCourses = coursesWithProgress.sort((a, b) => {
      if (!a.isPurchased && b.isPurchased) return -1;
      if (a.isPurchased && !b.isPurchased) return 1;
      return 0;
    });

    return sortedCourses;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
