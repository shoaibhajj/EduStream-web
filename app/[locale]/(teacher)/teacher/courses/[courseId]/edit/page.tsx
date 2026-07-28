import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { SectionCard } from "@/components/shared/SectionCard";
import { CourseForm } from "@/components/teacher/CourseForm";
import {
  getSubjectsForTeacherCourseForm,
  getTeacherCourseById,
} from "@/lib/queries/teacher";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
type Props = {
  params: Promise<{
    locale: string;
    courseId: string;
  }>;
};

export default async function EditTeacherCoursePage({ params }: Props) {
  const { locale, courseId } = await params;
  const user = await currentUser();
  const t = await getTranslations("TeacherDashboard");

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const [course, subjects] = await Promise.all([
    getTeacherCourseById(courseId, user.id),
    getSubjectsForTeacherCourseForm(),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href={`/${locale}/teacher`}
          className={buttonVariants({ variant: "ghost" })}
        >
          {t("backToDashboard")}
        </Link>

        <SectionCard>
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-text-primary">
              {t("editCourse")}
            </h1>
          </div>

          <CourseForm
            mode="edit"
            courseId={course.id}
            subjects={subjects}
            defaultValues={{
              subjectId: course.subjectId,
              nameAr: course.nameAr,
              nameEn: course.nameEn ?? "",
              descriptionAr: course.descriptionAr ?? "",
              descriptionEn: course.descriptionEn ?? "",
              price: course.price,
            }}
          />
        </SectionCard>
      </div>
    </main>
  );
}
