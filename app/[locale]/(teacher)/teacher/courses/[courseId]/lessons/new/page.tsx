import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getTeacherCourseById } from "@/lib/queries/teacher";
import { TeacherLessonForm } from "@/components/teacher/TeacherLessonForm";
import { SectionCard } from "@/components/shared/SectionCard";
import { buttonVariants } from "@/components/ui/button";
import { requireApprovedTeacher } from "@/lib/access/guards";
import { forbidden } from "next/navigation";
import { getCurrentProfile } from "@/lib/access/guards";
import { isAdmin, isApprovedTeacher } from "@/lib/access/roles";
type Props = {
  params: Promise<{
    locale: string;
    courseId: string;
  }>;
};

export default async function NewTeacherLessonPage({ params }: Props) {
  const profile = await getCurrentProfile();

  if (!profile || (!isApprovedTeacher(profile) && !isAdmin(profile))) {
    forbidden();
  }
  const { locale, courseId } = await params;
  const user = await currentUser();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const t = await getTranslations("TeacherLessons");
  const course = await getTeacherCourseById(courseId, user.id);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <Link
          href={`/${locale}/teacher/courses/${courseId}`}
          className={buttonVariants({ variant: "ghost" })}
        >
          {t("backToCourse")}
        </Link>

        <SectionCard>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">
                {t("pageTitle")}
              </h1>
            </div>

            <TeacherLessonForm courseId={courseId} />
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
