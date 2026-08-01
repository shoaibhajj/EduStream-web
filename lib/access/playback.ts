import { prisma } from "@/lib/prisma";
import type { Profile } from "@/lib/generated/prisma";
import { isAdmin, isApprovedTeacher } from "./roles";

interface PlaybackAuthResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Shared playback authorization check.
 * Usable from web Server Components, Server Actions, and API Route Handlers (mobile).
 *
 * Rules:
 * - Admin: always allowed
 * - Approved teacher who owns the course: allowed
 * - Student with confirmed enrollment: allowed
 * - Preview lesson: allowed for all signed-in users
 * - Everything else: denied
 */
export async function canAccessLesson(
  profile: Profile,
  lessonId: string
): Promise<PlaybackAuthResult> {
  // 1. Fetch lesson with parent course
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });

  if (!lesson || !lesson.isPublished) {
    return { allowed: false, reason: "lesson_not_found_or_unpublished" };
  }

  // 2. Admin always allowed
  if (isAdmin(profile)) return { allowed: true };

  // 3. Preview lessons: any signed-in user
  if (lesson.isPreview) return { allowed: true };

  // 4. Approved teacher who owns the course
  if (
    isApprovedTeacher(profile) &&
    lesson.course.teacherId === profile.clerkUserId
  ) {
    return { allowed: true };
  }

  // 5. Student with confirmed enrollment
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
