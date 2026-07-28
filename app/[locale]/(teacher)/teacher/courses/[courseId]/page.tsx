import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getTeacherCourseById } from "@/lib/queries/teacher";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  params: Promise<{
    locale: string;
    courseId: string;
  }>;
};

export default async function TeacherCourseDetailsPage({ params }: Props) {
  const { locale, courseId } = await params;
  const user = await currentUser();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const t = await getTranslations("TeacherDashboard");

  const course = await getTeacherCourseById(courseId, user.id);

  if (!course) {
    notFound();
  }

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
      <div className="mx-auto max-w-3xl space-y-4">
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
        </div>

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
      </div>
    </main>
  );
}
