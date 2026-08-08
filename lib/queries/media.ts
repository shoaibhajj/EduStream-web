import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { canAccessLesson, PlaybackAuthResult } from "@/lib/access/playback";
import type { Profile } from "@/lib/generated/prisma";

export async function getLessonMediaByLessonId(lessonId: string) {
  return prisma.lessonMedia.findUnique({ where: { lessonId } });
}
export type ResolvedPlayback =
  | { strategy: "cloudinary"; url: string }
  | {
      strategy: "dailymotion_embed";
      videoId: string;
      durationSeconds?: number | null;
    }
  | { strategy: "native_video"; url: string }
  | { strategy: "unsupported"; reason: string }
  | null;
/**
 * Resolves a stored LessonMedia record into a concrete playback strategy.
 * This is the ONLY function that should produce playback data.
 * Authorization must be checked BEFORE calling this.
 */
export async function getProtectedPlaybackUrl(
  lessonId: string
): Promise<ResolvedPlayback> {
  const media = await prisma.lessonMedia.findUnique({ where: { lessonId } });
  if (!media || !media.isReady) return null;


  // ── Cloudinary uploaded video ─────────────────────────────────────────────
  if (media.provider === "cloudinary" && media.cloudinaryPublicId) {
    const url = cloudinary.url(media.cloudinaryPublicId, {
      resource_type:
        (media.cloudinaryResourceType as "video" | "image" | "raw") ?? "video",
      sign_url: true,
      expires_at: Math.round(Date.now() / 1000) + 600,
      type: "authenticated",
      format: "mp4",
    });

    return { strategy: "cloudinary", url };
  }

  // ── Dailymotion uploaded or linked video ──────────────────────────────────
if (media.provider === "dailymotion") {
  const playbackId =
    media.dailymotionPrivateId?.trim() || media.dailymotionVideoId?.trim();

  if (!playbackId) {
    return { strategy: "unsupported", reason: "no_media" };
  }

  return {
    strategy: "dailymotion_embed",
    videoId: playbackId,
    durationSeconds: media.durationSeconds ?? null,
  };
}
  // ── Direct external media URL (.mp4 / .webm / .m3u8) ─────────────────────
  if (media.provider === "external_link" && media.externalUrl) {
    return { strategy: "native_video", url: media.externalUrl };
  }

  return { strategy: "unsupported", reason: "unresolvable_source" };
}

export async function getMediaPreviewUrl(lessonId: string) {
  return getProtectedPlaybackUrl(lessonId);
}

export type PlaybackResponse =
  | {
      allowed: true;
      resolved: ResolvedPlayback;
    }
  | { allowed: false; reason: string };

/**
 * The single shared function for resolving lesson playback.
 * Checks access first, then returns resolved playback only if authorized.
 */
export async function resolvePlaybackAccess(
  profile: Profile | null,
  lessonId: string
): Promise<PlaybackResponse> {
  const authResult: PlaybackAuthResult = await canAccessLesson(
    profile,
    lessonId
  );

  if (!authResult.allowed) {
    return { allowed: false, reason: authResult.reason ?? "denied" };
  }

  const resolved = await getProtectedPlaybackUrl(lessonId);
  if (!resolved) {
    return { allowed: false, reason: "no_media" };
  }

  return { allowed: true, resolved };
}
