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

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; courseId: string }>;
}) {
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

  // Resolve student enrollment state
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
      // Non-fatal — fall through to "none" state
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
    <main className="px-6 py-10 max-w-3xl mx-auto" dir="auto">
      {loadError ? (
        <p className="text-error">{t("errorLoad")}</p>
      ) : (
        <>
          {/* Back link */}
          <Link
            href={`/${locale}/browse`}
            className="mb-6 inline-block text-sm text-text-muted hover:underline"
          >
            ← {t("backToCourses")}
          </Link>

          {/* Course header */}
          <div className="mb-8">
            {course!.thumbnailUrl && (
              <img
                src={course!.thumbnailUrl}
                alt=""
                className="mb-5 w-full rounded-xl object-cover aspect-video"
              />
            )}
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              {courseName}
            </h1>
            {courseDescription && (
              <p className="text-sm text-text-secondary">{courseDescription}</p>
            )}
          </div>

          {/* Enrollment / access status banner */}
          {!clerkUserId && (
            <div className="mb-6 rounded-xl border border-border bg-surface-secondary px-5 py-4">
              <p className="text-sm text-text-secondary mb-3">
                {t("enrollCta")}
              </p>
              <Link
                href={`/${locale}/sign-in`}
                className="inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
              >
                {t("enrollCta")}
              </Link>
            </div>
          )}

          {clerkUserId && enrollmentStatus === "none" && (
            <div className="mb-6 rounded-xl border border-border bg-surface-secondary px-5 py-4">
              <p className="text-sm text-text-secondary">{t("enrollCta")}</p>
              {/* Enroll button — wired in Feature 09 */}
            </div>
          )}

          {clerkUserId && enrollmentStatus === "pending" && (
            <div className="mb-6 rounded-xl border border-warning bg-surface-secondary px-5 py-4">
              <p className="text-sm text-warning font-medium">
                {t("pendingNote")}
              </p>
            </div>
          )}

          {clerkUserId && enrollmentStatus === "rejected" && (
            <div className="mb-6 rounded-xl border border-error bg-surface-secondary px-5 py-4">
              <p className="text-sm text-error font-medium">
                {t("rejectedNote")}
              </p>
            </div>
          )}

          {clerkUserId && enrollmentStatus === "confirmed" && (
            <div className="mb-6 rounded-xl border border-success bg-success-light px-5 py-4">
              <p className="text-sm text-success font-medium">
                {t("confirmedNote")}
              </p>
            </div>
          )}

          {/* Lesson list */}
          <section>
            <h2 className="mb-4 text-base font-semibold text-text-primary">
              {t("lessonsHeading")}
            </h2>

            {course!.lessons.length === 0 ? (
              <p className="text-sm text-text-muted">{t("lessonsEmpty")}</p>
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
