import "server-only";
import { prisma } from "@/lib/prisma";

export async function getCourseDetail(courseId: string) {
  return prisma.course.findUnique({
    where: { id: courseId, isPublished: true },
    include: {
      subject: {
        include: {
          academicYear: true,
        },
      },
      lessons: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          titleAr: true,
          titleEn: true,
          isPreview: true,
          sortOrder: true,
        },
      },
    },
  });
}

export async function getStudentEnrollmentForCourse(
  profileId: string,
  courseId: string
) {
  return prisma.enrollment.findUnique({
    where: {
      profileId_courseId: { profileId, courseId },
    },
    select: {
      status: true,
    },
  });
}
