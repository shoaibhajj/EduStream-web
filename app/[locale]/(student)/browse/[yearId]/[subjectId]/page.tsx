import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  getPublishedCoursesBySubject,
  getSubjectsByYear,
  getActiveAcademicYears,
} from "@/lib/queries/browse";
import { notFound } from "next/navigation";

export default async function SubjectCoursesPage({
  params,
}: {
  params: Promise<{ locale: string; yearId: string; subjectId: string }>;
}) {
  const { locale, yearId, subjectId } = await params;
  const t = await getTranslations("Browse");

  // Validate both yearId and subjectId
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
    <main className="px-6 py-10" dir="auto">
      <Link
        href={`/${locale}/browse/${yearId}`}
        className="mb-6 inline-block text-sm text-muted-foreground hover:underline"
      >
        ← {t("backToSubjects")}
      </Link>

      <h1 className="mb-6 text-2xl font-bold">
        {subjectName} — {t("coursesHeading")}
      </h1>

      {loadError && <p className="text-red-600">{t("errorLoad")}</p>}

      {!loadError && courses.length === 0 && (
        <p className="text-muted-foreground">{t("emptyCourses")}</p>
      )}

      {!loadError && courses.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <li key={course.id} className="rounded-xl border p-5">
              {course.thumbnailUrl && (
                <img
                  src={course.thumbnailUrl}
                  alt=""
                  className="mb-3 w-full rounded-lg object-cover aspect-video"
                />
              )}
              <p className="text-lg font-semibold">
                {locale === "ar"
                  ? course.nameAr
                  : course.nameEn ?? course.nameAr}
              </p>
              {(locale === "ar"
                ? course.descriptionAr
                : course.descriptionEn ?? course.descriptionAr) && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {locale === "ar"
                    ? course.descriptionAr
                    : course.descriptionEn ?? course.descriptionAr}
                </p>
              )}
              <Link
                href={`/${locale}/course/${course.id}`}
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                {t("viewCourse")} →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
