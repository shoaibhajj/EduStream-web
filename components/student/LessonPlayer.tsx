"use client";

import { useTranslations } from "next-intl";
import { Lock, ExternalLink, AlertTriangle } from "lucide-react";
import type { PlaybackResponse } from "@/lib/queries/media";

interface LessonPlayerProps {
  result: PlaybackResponse;
  locale: string;
}

export function LessonPlayer({ result }: LessonPlayerProps) {
  const t = useTranslations("Playback");

  if (!result.allowed) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Lock size={40} className="text-text-muted" />
        <p className="text-sm text-text-secondary">
          {result.reason === "unauthenticated"
            ? t("lockedSignIn")
            : result.reason === "no_media"
            ? t("noMedia")
            : t("lockedNoAccess")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {result.type === "cloudinary" && (
        <video
          key={result.url}
          controls
          className="w-full rounded-lg aspect-video bg-black"
          src={result.url}
          controlsList="nodownload"
        />
      )}

      {result.type === "external_link" && (
        <div className="flex flex-col gap-3">
          <video
            key={result.url}
            controls
            className="w-full rounded-lg aspect-video bg-black"
            src={result.url}
          />
          {result.externalNotice && (
            <div className="flex items-start gap-2 rounded-md border border-border bg-muted/30 px-4 py-3 text-sm text-text-muted">
              <AlertTriangle
                size={16}
                className="mt-0.5 shrink-0 text-warning"
              />
              <span>{t("externalLinkNotice")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
