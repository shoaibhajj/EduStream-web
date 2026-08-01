import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  getPublishedCoursesBySubject,
  getSubjectsByYear,
  getActiveAcademicYears,
} from "@/lib/queries/browse";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function SubjectCoursesPage({
  params,
}: {
  params: Promise<{ locale: string; yearId: string; subjectId: string }>;
}) {
  const { locale, yearId, subjectId } = await params;
  const t = await getTranslations("Browse");

  const years = await getActiveAcademicYears();
  const year = years.find((y) => y.id === yearId);
  if (!year) notFound();

  const subjects = await getSubjectsByYear(yearId);
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) notFound();

  let courses: Awaited<ReturnType<typeof getPublishedCoursesBySubject>> = [];
  let loadError = false;

  try {
    courses = await getPublishedCoursesBySubject(subjectId);
  } catch (error) {
    console.error("Failed to load courses:", error);
    loadError = true;
  }

  const subjectName =
    locale === "ar" ? subject.nameAr : subject.nameEn ?? subject.nameAr;

  return (
    <main className="px-6 py-10">
      <Link
        href={`/${locale}/browse/${yearId}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary transition-colors"
      >
        <ChevronRight size={14} className="rotate-180 rtl:rotate-0" />
        {t("backToSubjects")}
      </Link>

      <h1 className="mb-6 text-2xl font-semibold text-text-primary">
        {subjectName} — {t("coursesHeading")}
      </h1>

      {loadError && <ErrorState message={t("errorLoad")} />}

      {!loadError && courses.length === 0 && (
        <EmptyState message={t("emptyCourses")} />
      )}

      {!loadError && courses.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <li key={course.id}>
              <SectionCard className="flex flex-col gap-3 p-5 h-full">
                {course.thumbnailUrl && (
                  <img
                    src={course.thumbnailUrl}
                    alt=""
                    className="w-full rounded-lg object-cover aspect-video"
                  />
                )}
                <div className="flex-1 flex flex-col gap-2">
                  <p className="text-base font-semibold text-text-primary">
                    {locale === "ar"
                      ? course.nameAr
                      : course.nameEn ?? course.nameAr}
                  </p>
                  {(locale === "ar"
                    ? course.descriptionAr
                    : course.descriptionEn ?? course.descriptionAr) && (
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {locale === "ar"
                        ? course.descriptionAr
                        : course.descriptionEn ?? course.descriptionAr}
                    </p>
                  )}
                </div>
                <Link
                  href={`/${locale}/course/${course.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mt-auto w-fit"
                  )}
                >
                  {t("viewCourse")}
                </Link>
              </SectionCard>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
