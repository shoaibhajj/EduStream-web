import { prisma } from "@/lib/prisma";
import type { Profile } from "@/lib/generated/prisma";
import { isAdmin, isApprovedTeacher } from "./roles";

export type PlaybackDeniedReason =
  | "lesson_not_found_or_unpublished"
  | "unauthenticated"
  | "no_confirmed_enrollment"
  | "no_media";

export interface PlaybackAuthResult {
  allowed: boolean;
  reason?: PlaybackDeniedReason | string;
}

/**
 * Shared playback authorization check.
 * Pass profile=null for unauthenticated visitors.
 * Usable from Server Components, Server Actions, and Route Handlers (mobile).
 *
 * Rules (in priority order):
 * 1. Lesson must exist and be published
 * 2. Admin → always allowed
 * 3. Preview lesson → allowed for everyone including unauthenticated
 * 4. Approved teacher who owns the course → allowed
 * 5. Student with hasActiveSubscription → allowed
 * 6. Student with confirmed course enrollment → allowed
 * 7. Otherwise → denied
 */
export async function canAccessLesson(
  profile: Profile | null,
  lessonId: string
): Promise<PlaybackAuthResult> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });

  if (!lesson || !lesson.isPublished) {
    return { allowed: false, reason: "lesson_not_found_or_unpublished" };
  }

  // Preview: open to everyone including unauthenticated visitors
  if (lesson.isPreview) return { allowed: true };

  // From here on, a profile is required
  if (!profile) {
    return { allowed: false, reason: "unauthenticated" };
  }

  if (isAdmin(profile)) return { allowed: true };

  if (
    isApprovedTeacher(profile) &&
    lesson.course.teacherId === profile.clerkUserId
  ) {
    return { allowed: true };
  }

  // All-platform subscription
  if (profile.hasActiveSubscription) return { allowed: true };

  // Course-specific confirmed enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      profileId_courseId: {
        profileId: profile.id,
        courseId: lesson.courseId,
      },
    },
  });

  if (enrollment?.status === "confirmed") return { allowed: true };

  return { allowed: false, reason: "no_confirmed_enrollment" };
}
