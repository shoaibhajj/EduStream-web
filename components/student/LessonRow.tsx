import Link from "next/link";
import { useTranslations } from "next-intl";
import { Lock, PlayCircle, Eye } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

type LessonAccessState = "preview" | "accessible" | "locked";

interface LessonRowProps {
  lessonId: string;
  courseId: string;
  titleAr: string;
  titleEn: string | null;
  accessState: LessonAccessState;
  locale: string;
  sortOrder: number;
}

export function LessonRow({
  lessonId,
  courseId,
  titleAr,
  titleEn,
  accessState,
  locale,
  sortOrder,
}: LessonRowProps) {
  const t = useTranslations("CourseDetail");

  const title = locale === "ar" ? titleAr : titleEn ?? titleAr;

  const badgeConfig: Record<
    LessonAccessState,
    { label: string; icon: React.ReactNode }
  > = {
    preview: { label: t("previewBadge"), icon: <Eye size={14} /> },
    accessible: { label: t("accessibleBadge"), icon: <PlayCircle size={14} /> },
    locked: { label: t("lockedBadge"), icon: <Lock size={14} /> },
  };

  const badge = badgeConfig[accessState];
  const isPlayable = accessState === "preview" || accessState === "accessible";
  const href = `/${locale}/course/${courseId}/lesson/${lessonId}`;

  const inner = (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 w-full">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm text-text-muted w-6 shrink-0 text-center">
          {sortOrder}
        </span>
        <span
          className={`truncate text-sm font-medium ${
            accessState === "locked" ? "text-text-muted" : "text-text-primary"
          }`}
        >
          {title}
        </span>
      </div>
      <StatusBadge
        variant={accessState}
        label={badge.label}
        icon={badge.icon}
      />
    </div>
  );

  if (isPlayable) {
    return (
      <li>
        <Link href={href} className="block hover:opacity-90 transition-opacity">
          {inner}
        </Link>
      </li>
    );
  }

  return <li>{inner}</li>;
}
