import { prisma } from "@/lib/prisma";

export async function getTeacherCourses(clerkUserId: string) {
  return prisma.course.findMany({
    where: {
      teacherId: clerkUserId,
    },
    include: {
      subject: {
        include: {
          academicYear: true,
        },
      },
      _count: {
        select: {
          lessons: true,
          enrollments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTeacherCourseById(
  courseId: string,
  clerkUserId: string
) {
  return prisma.course.findFirst({
    where: {
      id: courseId,
      teacherId: clerkUserId,
    },
    include: {
      subject: {
        include: {
          academicYear: true,
        },
      },
    },
  });
}

export async function getSubjectsForTeacherCourseForm() {
  return prisma.subject.findMany({
    where: {
      isActive: true,
      academicYear: {
        isActive: true,
      },
    },
    include: {
      academicYear: true,
    },
    orderBy: [
      {
        academicYear: {
          sortOrder: "asc",
        },
      },
      {
        sortOrder: "asc",
      },
    ],
  });
}

// export async function getLessonsWithMediaForCourse(courseId: string) {
//   return prisma.lesson.findMany({
//     where: { courseId },
//     include: { media: true },
//     orderBy: { sortOrder: "asc" },
//   });
// }


export async function getLessonsWithMediaForCourse(
  courseId: string,
  clerkUserId: string
) {
  // Ownership check: only fetch if this teacher owns the course
  const course = await prisma.course.findFirst({
    where: { id: courseId, teacherId: clerkUserId },
    select: { id: true },
  });
  if (!course) return null;

  return prisma.lesson.findMany({
    where: { courseId },
    include: { media: true },
    orderBy: { sortOrder: "asc" },
  });
}
