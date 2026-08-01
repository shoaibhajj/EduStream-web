import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect, forbidden } from "next/navigation";
import { getTranslations } from "next-intl/server";

import {
  getTeacherCourseById,
  getLessonsWithMediaForCourse,
} from "@/lib/queries/teacher";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
// import { deleteLessonAction } from "@/actions/lesson";
import { getCurrentProfile } from "@/lib/access/guards";
import { isAdmin, isApprovedTeacher } from "@/lib/access/roles";
import { DeleteLessonButton } from "@/components/teacher/DeleteLessonButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;
type Props = {
  params: Promise<{ locale: string; courseId: string }>;
  searchParams: Promise<{ deleteError?: string }>;
};

export default async function TeacherCourseDetailsPage({
  params,
  searchParams,
}: Props) {
  const profile = await getCurrentProfile();

  if (!profile || (!isApprovedTeacher(profile) && !isAdmin(profile))) {
    forbidden();
  }
  const { locale, courseId } = await params;
  const { deleteError } = await searchParams;
  const user = await currentUser();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const t = await getTranslations("TeacherDashboard");
  const tMedia = await getTranslations("LessonMedia");
  const tLessons = await getTranslations("TeacherLessons");

  const course = await getTeacherCourseById(courseId, user.id);
  if (!course) notFound();

  const lessons = await getLessonsWithMediaForCourse(courseId, user.id);

  const courseName =
    locale === "ar" ? course.nameAr : course.nameEn ?? course.nameAr;
  const subjectName =
    locale === "ar"
      ? course.subject.nameAr
      : course.subject.nameEn ?? course.subject.nameAr;
  const yearName =
    locale === "ar"
      ? course.subject.academicYear.nameAr
      : course.subject.academicYear.nameEn ??
        course.subject.academicYear.nameAr;

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Navigation */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/${locale}/teacher`}
            className={buttonVariants({ variant: "ghost" })}
          >
            {t("backToDashboard")}
          </Link>
          <Link
            href={`/${locale}/teacher/courses/${course.id}/edit`}
            className={buttonVariants({ variant: "outline" })}
          >
            {t("editCourse")}
          </Link>
          <Link
            href={`/${locale}/teacher/courses/${course.id}/lessons/new`}
            className={buttonVariants({ variant: "outline" })}
          >
            {tLessons("createLesson")}
          </Link>
        </div>

        {deleteError && (
          <p className="text-sm text-destructive">{tLessons("deleteFailed")}</p>
        )}

        {/* Course info card — unchanged from Feature 08 */}
        <SectionCard>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-text-primary">
                {courseName}
              </h1>
              <StatusBadge
                label={course.isPublished ? t("published") : t("draft")}
                variant={course.isPublished ? "success" : "secondary"}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-text-muted">
                  {t("academicYearLabel")}
                </p>
                <p className="text-sm font-medium text-text-primary">
                  {yearName}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">{t("subjectLabel")}</p>
                <p className="text-sm font-medium text-text-primary">
                  {subjectName}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">{t("priceLabel")}</p>
                <p className="text-sm font-medium text-text-primary">
                  {course.price === 0 ? t("freeLabel") : course.price}
                </p>
              </div>
            </div>

            {course.descriptionAr ? (
              <div>
                <p className="text-xs text-text-muted">AR</p>
                <p className="text-sm text-text-primary">
                  {course.descriptionAr}
                </p>
              </div>
            ) : null}

            {course.descriptionEn ? (
              <div>
                <p className="text-xs text-text-muted">EN</p>
                <p className="text-sm text-text-primary">
                  {course.descriptionEn}
                </p>
              </div>
            ) : null}
          </div>
        </SectionCard>

        {/* Lessons + media section */}
        {lessons && lessons.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-text-primary">
              {t("lessonsCount", { count: lessons.length })}
            </h2>
            {lessons.map((lesson) => (
              <SectionCard key={lesson.id}>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-text-primary">
                    {locale === "ar"
                      ? lesson.titleAr
                      : lesson.titleEn ?? lesson.titleAr}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/${locale}/teacher/courses/${courseId}/lessons/${lesson.id}`}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      {tLessons("manageVideo")}
                    </Link>

                    <Link
                      href={`/${locale}/teacher/courses/${courseId}/lessons/${lesson.id}/edit`}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      {tLessons("editLesson")}
                    </Link>

                    <DeleteLessonButton
                      locale={locale}
                      courseId={courseId}
                      lessonId={lesson.id}
                      label={tLessons("deleteLesson")}
                      confirmMessage={tLessons("confirmDeleteLesson")}
                    />
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
        ) : (
          <SectionCard>
            <p className="text-sm text-text-muted text-center py-4">
              {tMedia("noMediaTitle")}
            </p>
          </SectionCard>
        )}
      </div>
    </main>
  );
}
