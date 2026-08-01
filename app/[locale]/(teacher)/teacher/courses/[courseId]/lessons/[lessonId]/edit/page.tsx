import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { SectionCard } from "@/components/shared/SectionCard";
import { TeacherLessonForm } from "@/components/teacher/TeacherLessonForm";
import { requireApprovedTeacher } from "@/lib/access/guards";
import { forbidden } from "next/navigation";
import { getCurrentProfile } from "@/lib/access/guards";
import { isAdmin, isApprovedTeacher } from "@/lib/access/roles";
type Props = {
  params: Promise<{ locale: string; courseId: string; lessonId: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditTeacherLessonPage({ params }: Props) {
   const profile = await getCurrentProfile();

   if (!profile || (!isApprovedTeacher(profile) && !isAdmin(profile))) {
     forbidden();
   }
  const { locale, courseId, lessonId } = await params;
  const user = await currentUser();
  if (!user) redirect(`/${locale}/sign-in`);

  const t = await getTranslations("TeacherLessons");

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId, course: { teacherId: user.id } },
  });

  if (!lesson) notFound();

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <SectionCard>
          <h1 className="text-xl font-semibold text-text-primary mb-4">
            {t("editLesson")}
          </h1>
          <TeacherLessonForm
            courseId={courseId}
            mode="edit"
            lessonId={lesson.id}
            defaultValues={{
              titleAr: lesson.titleAr,
              titleEn: lesson.titleEn,
              description: lesson.description,
              sortOrder: lesson.sortOrder,
              isPreview: lesson.isPreview,
              isPublished: lesson.isPublished,
            }}
          />
        </SectionCard>
      </div>
    </main>
  );
}
