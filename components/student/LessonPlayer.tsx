"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Lock, AlertTriangle } from "lucide-react";
import { DailymotionPlayer } from "@/components/student/DailymotionPlayer";
import type { PlaybackResponse } from "@/lib/queries/media";

interface LessonPlayerProps {
  result: PlaybackResponse;
}

export function LessonPlayer({ result }: LessonPlayerProps) {
  const t = useTranslations("Playback");
  const DM_PLAYER_ID = process.env.NEXT_PUBLIC_DM_PLAYER_ID || "x1lwfu";
  // Weak deterrent: block right-click and common download shortcuts
  // These are cosmetic — they do not prevent downloads.
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["s", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  

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

  const { resolved } = result;

  if (!resolved || resolved.strategy === "unsupported") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <AlertTriangle size={40} className="text-warning" />
        <p className="text-sm text-text-secondary">{t("unsupportedSource")}</p>
      </div>
    );
  }

  // ── Cloudinary protected video ────────────────────────────────────────────
  if (resolved.strategy === "cloudinary") {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video
          key={resolved.url}
          controls
          controlsList="nodownload"
          className="w-full h-full"
          src={resolved.url}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    );
  }

  // ── Dailymotion embed ─────────────────────────────────────────────────────
if (resolved.strategy === "dailymotion_embed") {
  return (
    <DailymotionPlayer
      videoId={resolved.videoId}
      replayLabel={t("replayVideo")}
      endedLabel={t("videoEnded")}
    />
  );
}

  // ── Direct native video (.mp4 / .webm) ────────────────────────────────────
  if (resolved.strategy === "native_video") {
    return (
      <div className="flex flex-col gap-3">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video
            key={resolved.url}
            controls
            className="w-full h-full"
            src={resolved.url}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
        <div className="flex items-start gap-2 rounded-md border border-border bg-muted/30 px-4 py-3 text-sm text-text-muted">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
          <span>{t("externalLinkNotice")}</span>
        </div>
      </div>
    );
  }

  return null;
}
