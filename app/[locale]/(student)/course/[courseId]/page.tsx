import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  getCourseDetail,
  getStudentEnrollmentForCourse,
} from "@/lib/queries/course";
import { prisma } from "@/lib/prisma";
import { LessonRow } from "@/components/student/LessonRow";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {  requireStudent } from "@/lib/access/guards";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; courseId: string }>;
}) {

      await requireStudent();
  const { locale, courseId } = await params;
  const t = await getTranslations("CourseDetail");

  let course: Awaited<ReturnType<typeof getCourseDetail>> = null;
  let loadError = false;

  try {
    course = await getCourseDetail(courseId);
  } catch (error) {
    console.error("[CourseDetailPage] load error:", error);
    loadError = true;
  }

  if (!loadError && !course) notFound();

  const { userId: clerkUserId } = await auth();
  let enrollmentStatus = "none";
  if (clerkUserId && course) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { clerkUserId },
        select: { id: true },
      });
      if (profile) {
        const enrollment = await getStudentEnrollmentForCourse(
          profile.id,
          course.id
        );
        if (enrollment) {
          enrollmentStatus = enrollment.status as typeof enrollmentStatus;
        }
      }
    } catch (error) {
      console.error("[CourseDetailPage] enrollment check error:", error);
    }
  }

  const hasFullAccess = enrollmentStatus === "confirmed";

  const courseName =
    locale === "ar" ? course?.nameAr : course?.nameEn ?? course?.nameAr;
  const courseDescription =
    locale === "ar"
      ? course?.descriptionAr
      : course?.descriptionEn ?? course?.descriptionAr;

  return (
    <main className="px-6 py-10 max-w-3xl mx-auto">
      {loadError ? (
        <ErrorState message={t("errorLoad")} />
      ) : (
        <>
          {/* Back link */}
          <Link
            href={`/${locale}/browse`}
            className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            <ChevronRight size={14} className="rotate-180 rtl:rotate-0" />
            {t("backToCourses")}
          </Link>

          {/* Course header */}
          <SectionCard className="mb-6">
            {course!.thumbnailUrl && (
              <img
                src={course!.thumbnailUrl}
                alt=""
                className="mb-5 w-full rounded-lg object-cover aspect-video"
              />
            )}
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              {courseName}
            </h1>
            {courseDescription && (
              <p className="text-sm text-text-secondary">{courseDescription}</p>
            )}
          </SectionCard>

          {/* Enrollment / access status banner */}
          {!clerkUserId && (
            <SectionCard className="mb-6 flex flex-col gap-3">
              <p className="text-sm text-text-secondary">{t("enrollCta")}</p>
              <Link
                href={`/${locale}/sign-in`}
                className={cn(buttonVariants({ size: "sm" }), "w-fit")}
              >
                {t("enrollCta")}
              </Link>
            </SectionCard>
          )}

          {clerkUserId && enrollmentStatus === "none" && (
            <SectionCard className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-text-secondary">{t("enrollCta")}</p>
              {/* Enroll button — wired in Feature 10 */}
            </SectionCard>
          )}

          {clerkUserId && enrollmentStatus === "pending" && (
            <SectionCard className="mb-6 flex items-center gap-3">
              <StatusBadge variant="pending" label={t("pendingNote")} />
            </SectionCard>
          )}

          {clerkUserId && enrollmentStatus === "rejected" && (
            <SectionCard className="mb-6 flex items-center gap-3">
              <StatusBadge variant="rejected" label={t("rejectedNote")} />
            </SectionCard>
          )}

          {clerkUserId && enrollmentStatus === "confirmed" && (
            <SectionCard className="mb-6 flex items-center gap-3">
              <StatusBadge variant="confirmed" label={t("confirmedNote")} />
            </SectionCard>
          )}

          <Separator className="mb-6 bg-border" />

          {/* Lesson list */}
          <section>
            <h2 className="mb-4 text-base font-semibold text-text-primary">
              {t("lessonsHeading")}
            </h2>

            {course!.lessons.length === 0 ? (
              <EmptyState message={t("lessonsEmpty")} />
            ) : (
              <ul className="flex flex-col gap-2">
                {course!.lessons.map((lesson, index) => {
                  const accessState = lesson.isPreview
                    ? "preview"
                    : hasFullAccess
                    ? "accessible"
                    : "locked";

                  return (
                    <LessonRow
                      key={lesson.id}
                      titleAr={lesson.titleAr}
                      titleEn={lesson.titleEn}
                      accessState={accessState}
                      locale={locale}
                      sortOrder={index + 1}
                    />
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
