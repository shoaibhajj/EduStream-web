import "server-only";
import { prisma } from "@/lib/prisma";

export async function getActiveAcademicYears() {
  return prisma.academicYear.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getSubjectsByYear(academicYearId: string) {
  return prisma.subject.findMany({
    where: { academicYearId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPublishedCoursesBySubject(subjectId: string) {
  return prisma.course.findMany({
    where: { subjectId, isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}
