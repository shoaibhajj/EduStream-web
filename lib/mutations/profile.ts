import { prisma } from "@/lib/prisma";
import { AppRole, TeacherApprovalStatus } from "@/lib/generated/prisma";

interface ClerkProfileData {
  clerkUserId: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}

/**
 * Upsert a Profile row from Clerk identity data.
 * Called by the Clerk webhook on user.created and user.updated.
 * Idempotent: safe to call multiple times for the same clerkUserId.
 * Does NOT change role or approval state — those are app-managed.
 */
export async function upsertProfileFromClerk(data: ClerkProfileData) {
  return prisma.profile.upsert({
    where: { clerkUserId: data.clerkUserId },
    create: {
      clerkUserId: data.clerkUserId,
      email: data.email,
      displayName: data.displayName,
      avatarUrl: data.avatarUrl,
      role: AppRole.student,
      teacherApprovalStatus: TeacherApprovalStatus.not_applicable,
    },
    update: {
      email: data.email,
      displayName: data.displayName,
      avatarUrl: data.avatarUrl,
      // deliberately NOT updating role or teacherApprovalStatus
    },
  });
}

/** Delete profile when Clerk user is deleted. */
export async function deleteProfileByClerkId(clerkUserId: string) {
  return prisma.profile.deleteMany({ where: { clerkUserId } });
}

/** Admin: change a user's role. */
export async function setProfileRole(
  clerkUserId: string,
  role: AppRole
): Promise<void> {
  const approvalStatus =
    role === AppRole.teacher
      ? TeacherApprovalStatus.pending
      : TeacherApprovalStatus.not_applicable;

  await prisma.profile.update({
    where: { clerkUserId },
    data: { role, teacherApprovalStatus: approvalStatus },
  });
}

/** Admin: approve a teacher. */
export async function approveTeacher(clerkUserId: string): Promise<void> {
  await prisma.profile.update({
    where: { clerkUserId },
    data: { teacherApprovalStatus: TeacherApprovalStatus.approved },
  });
}

/** Admin: reject a teacher. */
export async function rejectTeacher(clerkUserId: string): Promise<void> {
  await prisma.profile.update({
    where: { clerkUserId },
    data: { teacherApprovalStatus: TeacherApprovalStatus.rejected },
  });
}
