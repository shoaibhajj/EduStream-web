import { prisma } from "@/lib/prisma";
import type { CreateLessonInput } from "@/lib/validations/lesson";
import { deleteLessonMedia } from "@/lib/mutations/media";
export async function createLessonForTeacher(
  input: CreateLessonInput,
  clerkUserId: string
) {
  const course = await prisma.course.findFirst({
    where: {
      id: input.courseId,
      teacherId: clerkUserId,
    },
    select: { id: true },
  });

  if (!course) {
    throw new Error("COURSE_NOT_FOUND");
  }

  return prisma.lesson.create({
    data: {
      courseId: input.courseId,
      titleAr: input.titleAr,
      titleEn: input.titleEn || null,
      description: input.description || null,
      isPreview: input.isPreview,
      isPublished: input.isPublished,
      sortOrder: input.sortOrder,
    },
  });
}


export async function updateLessonForTeacher(
  lessonId: string,
  courseId: string,
  clerkUserId: string,
  input: Omit<CreateLessonInput, "courseId">
) {
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId, course: { teacherId: clerkUserId } },
  });

  if (!lesson) throw new Error("LESSON_NOT_FOUND");

  return prisma.lesson.update({
    where: { id: lessonId },
    data: {
      titleAr: input.titleAr,
      titleEn: input.titleEn || null,
      description: input.description || null,
      isPreview: input.isPreview,
      isPublished: input.isPublished,
      sortOrder: input.sortOrder,
    },
  });
}



export async function deleteLessonForTeacher(
  lessonId: string,
  courseId: string,
  clerkUserId: string
) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      courseId,
      course: { teacherId: clerkUserId },
    },
  });

  if (!lesson) {
    throw new Error("LESSON_NOT_FOUND");
  }

  await deleteLessonMedia(lessonId);

  return prisma.lesson.delete({
    where: { id: lessonId },
  });
}