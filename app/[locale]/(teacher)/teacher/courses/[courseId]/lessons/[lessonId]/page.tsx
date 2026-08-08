import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { SectionCard } from "@/components/shared/SectionCard";
import { buttonVariants } from "@/components/ui/button";
import { LessonMediaManager } from "@/components/teacher/LessonMediaManager";
import { getMediaPreviewUrl } from "@/lib/queries/media";
import { requireApprovedTeacher } from "@/lib/access/guards";
import { forbidden } from "next/navigation";
import { getCurrentProfile } from "@/lib/access/guards";
import { isAdmin, isApprovedTeacher } from "@/lib/access/roles";
type Props = {
  params: Promise<{ locale: string; courseId: string; lessonId: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherLessonDetailsPage({ params }: Props) {
 const profile = await getCurrentProfile();

 if (!profile || (!isApprovedTeacher(profile) && !isAdmin(profile))) {
   forbidden();
 }
  const { locale, courseId, lessonId } = await params;
  const user = await currentUser();
  if (!user) redirect(`/${locale}/sign-in`);

  const t = await getTranslations("TeacherLessons");
  const tMedia = await getTranslations("LessonMedia");

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      courseId,
      course: { teacherId: user.id },
    },
    include: { media: true },
  });

  if (!lesson) notFound();

  const previewUrl = lesson.media ? await getMediaPreviewUrl(lesson.id) : null;

  const teacherPreviewUrl =
    previewUrl?.strategy === "cloudinary"
      ? previewUrl.url
      : previewUrl?.strategy === "native_video"
      ? previewUrl.url
      : previewUrl?.strategy === "dailymotion_embed"
      ? process.env.NEXT_PUBLIC_DAILYMOTION_PLAYER_ID
        ? `https://geo.dailymotion.com/player/${process.env.NEXT_PUBLIC_DAILYMOTION_PLAYER_ID}.html?video=${previewUrl.videoId}`
        : `https://www.dailymotion.com/embed/video/${previewUrl.videoId}`
      : null;
  const lessonTitle =
    locale === "ar" ? lesson.titleAr : lesson.titleEn ?? lesson.titleAr;

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
          <div className="space-y-4">
            <h1 className="text-xl font-semibold text-text-primary">
              {lessonTitle}
            </h1>

            {!lesson.media && (
              <p className="text-sm text-warning">{tMedia("noMediaTitle")}</p>
            )}

            <LessonMediaManager
              lessonId={lesson.id}
              courseId={courseId}
              locale={locale}
              existingMedia={lesson.media ?? null}
              previewUrl={teacherPreviewUrl}
            />
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
