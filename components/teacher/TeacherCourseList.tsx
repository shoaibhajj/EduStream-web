import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TogglePublishButton } from "@/components/teacher/TogglePublishButton";

type TeacherCourseListProps = {
  locale: string;
  courses: Array<{
    id: string;
    nameAr: string;
    nameEn: string | null;
    isPublished: boolean;
    price: number;
    subject: {
      nameAr: string;
      nameEn: string | null;
      academicYear: {
        nameAr: string;
        nameEn: string | null;
      };
    };
    _count: {
      lessons: number;
      enrollments: number;
    };
  }>;
};

export async function TeacherCourseList({
  locale,
  courses,
}: TeacherCourseListProps) {
  const t = await getTranslations("TeacherDashboard");

  return (
    <div className="grid gap-4">
      {courses.map((course) => {
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
          <Card key={course.id} className="transition-shadow hover:shadow-sm">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Link
                    href={`/${locale}/teacher/courses/${course.id}`}
                    className="block"
                  >
                    <CardTitle className="text-base hover:underline">
                      {courseName}
                    </CardTitle>
                  </Link>

                  <StatusBadge
                    label={course.isPublished ? t("published") : t("draft")}
                    variant={course.isPublished ? "success" : "secondary"}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/${locale}/teacher/courses/${course.id}`}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    {t("viewDetails")}
                  </Link>

                  <Link
                    href={`/${locale}/teacher/courses/${course.id}/edit`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    {t("editCourse")}
                  </Link>

                  <TogglePublishButton
                    courseId={course.id}
                    isPublished={course.isPublished}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-3 text-sm text-text-secondary sm:grid-cols-2">
              <div>
                <span className="text-xs text-text-muted">
                  {t("academicYearLabel")}
                </span>
                <p className="font-medium text-text-primary">{yearName}</p>
              </div>

              <div>
                <span className="text-xs text-text-muted">
                  {t("subjectLabel")}
                </span>
                <p className="font-medium text-text-primary">{subjectName}</p>
              </div>

              <div>
                <span className="text-xs text-text-muted">
                  {t("priceLabel")}
                </span>
                <p className="font-medium text-text-primary">
                  {course.price === 0 ? t("freeLabel") : course.price}
                </p>
              </div>

              <div>
                <span className="text-xs text-text-muted">
                  {t("lessonsCount", { count: course._count.lessons })}
                </span>
                <p className="font-medium text-text-primary">
                  {t("enrollmentsCount", { count: course._count.enrollments })}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
