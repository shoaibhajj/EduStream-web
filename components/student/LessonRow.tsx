import { useTranslations } from "next-intl";
import { Lock, PlayCircle, Eye } from "lucide-react";

type LessonAccessState = "preview" | "accessible" | "locked";

interface LessonRowProps {
  titleAr: string;
  titleEn: string | null;
  accessState: LessonAccessState;
  locale: string;
  sortOrder: number;
}

export function LessonRow({
  titleAr,
  titleEn,
  accessState,
  locale,
  sortOrder,
}: LessonRowProps) {
  const t = useTranslations("CourseDetail");

  const title = locale === "ar" ? titleAr : titleEn ?? titleAr;

  const badgeConfig = {
    preview: {
      label: t("previewBadge"),
      className: "bg-success-light text-success",
      icon: <Eye size={14} />,
    },
    accessible: {
      label: t("accessibleBadge"),
      className: "bg-accent-light text-accent",
      icon: <PlayCircle size={14} />,
    },
    locked: {
      label: t("lockedBadge"),
      className: "bg-surface-secondary text-locked",
      icon: <Lock size={14} />,
    },
  } as const;

  const badge = badgeConfig[accessState];

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3">
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
      <span
        className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
      >
        {badge.icon}
        {badge.label}
      </span>
    </li>
  );
}
