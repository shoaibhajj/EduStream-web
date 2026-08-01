import { AppRole, TeacherApprovalStatus } from "@/lib/generated/prisma";
import type { Profile } from "@/lib/generated/prisma";

/** True if the profile belongs to an admin. */
export function isAdmin(profile: Profile): boolean {
  return profile.role === AppRole.admin;
}

/** True if the profile is an approved teacher. */
export function isApprovedTeacher(profile: Profile): boolean {
  return (
    profile.role === AppRole.teacher &&
    profile.teacherApprovalStatus === TeacherApprovalStatus.approved
  );
}

/** True if the profile is a teacher pending approval. */
export function isPendingTeacher(profile: Profile): boolean {
  return (
    profile.role === AppRole.teacher &&
    profile.teacherApprovalStatus === TeacherApprovalStatus.pending
  );
}

/** True if the profile is an active student. */
export function isStudent(profile: Profile): boolean {
  return profile.role === AppRole.student;
}
