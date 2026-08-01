import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { canAccessLesson, PlaybackAuthResult } from "@/lib/access/playback";
import type { Profile } from "@/lib/generated/prisma";


export async function getLessonMediaByLessonId(lessonId: string) {
  return prisma.lessonMedia.findUnique({ where: { lessonId } });
}

/**
 * Returns a playback-safe media response for a lesson.
 * For Cloudinary assets: generates a signed delivery URL (short-lived).
 * For external links: returns the URL directly (lower trust, not owned).
 * Returns null if no media is attached.
 *
 * This is the ONLY function web/mobile should call before rendering a player.
 * Backend authorization (enrollment check) must happen BEFORE calling this.
 */
export async function getProtectedPlaybackUrl(lessonId: string): Promise<{
  type: "cloudinary" | "external_link";
  url: string;
  isOwned: boolean;
} | null> {
  const media = await prisma.lessonMedia.findUnique({ where: { lessonId } });
  if (!media || !media.isReady) return null;

  if (media.provider === "cloudinary" && media.cloudinaryPublicId) {
    // Generate a signed, time-limited URL (600 seconds = 10 min window)
   const url = cloudinary.url(media.cloudinaryPublicId, {
     resource_type:
       (media.cloudinaryResourceType as "video" | "image" | "raw") ?? "video",
     sign_url: true,
     expires_at: Math.round(Date.now() / 1000) + 600,
     type: "authenticated",
     format: "mp4",
   });
    return { type: "cloudinary", url, isOwned: true };
  }

  if (media.provider === "external_link" && media.externalUrl) {
    return { type: "external_link", url: media.externalUrl, isOwned: false };
  }

  return null;
}

export async function getMediaPreviewUrl(lessonId: string) {
  return getProtectedPlaybackUrl(lessonId);
}





export type PlaybackResponse =
  | {
      allowed: true;
      type: "cloudinary" | "external_link";
      url: string;
      isOwned: boolean;
      externalNotice: boolean;
    }
  | { allowed: false; reason: string };

/**
 * The single shared function for resolving lesson playback.
 * Checks access first, then returns media URL only if authorized.
 * Call this from both web Server Components AND Route Handlers (mobile).
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

  const media = await getProtectedPlaybackUrl(lessonId);
  if (!media) {
    return { allowed: false, reason: "no_media" };
  }

  return {
    allowed: true,
    type: media.type,
    url: media.url,
    isOwned: media.isOwned,
    externalNotice: !media.isOwned, // true for external links — UI should show honest notice
  };
}