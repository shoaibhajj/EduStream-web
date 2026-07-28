import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { getTeacherCourses } from "@/lib/queries/teacher";
import { TeacherCourseList } from "@/components/teacher/TeacherCourseList";
import { EmptyState } from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/button";

export default async function TeacherPage() {
  const user = await currentUser();
  const locale = await getLocale();
  const t = await getTranslations("TeacherDashboard");

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const courses = await getTeacherCourses(user.id);

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-text-secondary">Moallem Academy</p>
            <h1 className="mt-2 text-2xl font-semibold text-text-primary">
              {t("pageTitle")}
            </h1>
          </div>

          <Link
            href={`/${locale}/teacher/courses/new`}
            className={buttonVariants({ variant: "default" })}
          >
            {t("createCourse")}
          </Link>
        </div>

        {courses.length === 0 ? (
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptyDescription")}
          />
        ) : (
          <TeacherCourseList locale={locale} courses={courses} />
        )}
      </div>
    </main>
  );
}
