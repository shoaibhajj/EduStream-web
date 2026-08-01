import { prisma } from "@/lib/prisma";
import { AppRole, TeacherApprovalStatus } from "@/lib/generated/prisma";

export async function getProfileByClerkId(clerkUserId: string) {
  return prisma.profile.findUnique({
    where: { clerkUserId },
  });
}

export async function getAllTeachers() {
  return prisma.profile.findMany({
    where: {
      role: AppRole.teacher,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getPendingTeachers() {
  return prisma.profile.findMany({
    where: {
      role: AppRole.teacher,
      teacherApprovalStatus: TeacherApprovalStatus.pending,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
