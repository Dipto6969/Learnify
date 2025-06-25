import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    completedCourses,
    coursesInProgress,
  } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      {/* Info Summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>

      {/* In Progress Courses */}
      {coursesInProgress.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">In Progress</h2>
          <CoursesList items={coursesInProgress} />
        </div>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <div className="space-y-2 pt-6">
          <h2 className="text-xl font-semibold text-muted-foreground">Completed</h2>
          <CoursesList items={completedCourses} />
        </div>
      )}
    </div>
  );
}
