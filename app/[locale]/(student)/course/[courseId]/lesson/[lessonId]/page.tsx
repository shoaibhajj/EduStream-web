import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCurrentProfile } from "@/lib/access/guards";
import { resolvePlaybackAccess } from "@/lib/queries/media";
import { prisma } from "@/lib/prisma";
import { LessonPlayer } from "@/components/student/LessonPlayer";
import { SectionCard } from "@/components/shared/SectionCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function LessonWatchPage({
  params,
}: {
  params: Promise<{ locale: string; courseId: string; lessonId: string }>;
}) {
  const { locale, courseId, lessonId } = await params;
  const t = await getTranslations("Playback");

  const profile = await getCurrentProfile();
  const result = await resolvePlaybackAccess(profile, lessonId);

  // Fetch lesson for title display only (no media here — already resolved above)
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { titleAr: true, titleEn: true, isPublished: true },
  });

  if (!lesson || !lesson.isPublished) notFound();

  const title =
    locale === "ar" ? lesson.titleAr : lesson.titleEn ?? lesson.titleAr;

  return (
    <main className="px-6 py-10 max-w-3xl mx-auto">
      <Link
        href={`/${locale}/course/${courseId}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary transition-colors"
      >
        <ChevronRight size={14} className="rotate-180 rtl:rotate-0" />
        {t("backToCourse")}
      </Link>

      <h1 className="text-xl font-bold text-text-primary mb-6">{title}</h1>

      <SectionCard>
        <LessonPlayer result={result} locale={locale} />
      </SectionCard>
    </main>
  );
}
