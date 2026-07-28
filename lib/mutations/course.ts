import { prisma } from "@/lib/prisma";
import type { CourseFormValues } from "@/lib/validations/course";

type CreateCourseInput = CourseFormValues & {
  teacherId: string;
};

type UpdateCourseInput = Partial<CourseFormValues> & {
  courseId: string;
  teacherId: string;
};

export async function createCourse(input: CreateCourseInput) {
  return prisma.course.create({
    data: {
      teacherId: input.teacherId,
      subjectId: input.subjectId,
      nameAr: input.nameAr,
      nameEn: input.nameEn || null,
      descriptionAr: input.descriptionAr || null,
      descriptionEn: input.descriptionEn || null,
      price: input.price ?? 0,
      isPublished: false,
    },
  });
}

export async function updateCourseBasics(input: UpdateCourseInput) {
  const course = await prisma.course.findFirst({
    where: {
      id: input.courseId,
      teacherId: input.teacherId,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw new Error("NOT_FOUND_OR_FORBIDDEN");
  }

  return prisma.course.update({
    where: {
      id: input.courseId,
    },
    data: {
      ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
      ...(input.nameAr !== undefined ? { nameAr: input.nameAr } : {}),
      ...(input.nameEn !== undefined ? { nameEn: input.nameEn || null } : {}),
      ...(input.descriptionAr !== undefined
        ? { descriptionAr: input.descriptionAr || null }
        : {}),
      ...(input.descriptionEn !== undefined
        ? { descriptionEn: input.descriptionEn || null }
        : {}),
      ...(input.price !== undefined ? { price: input.price } : {}),
    },
  });
}

export async function setCoursePublishState(params: {
  courseId: string;
  teacherId: string;
  isPublished: boolean;
}) {
  const course = await prisma.course.findFirst({
    where: {
      id: params.courseId,
      teacherId: params.teacherId,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw new Error("NOT_FOUND_OR_FORBIDDEN");
  }

  return prisma.course.update({
    where: {
      id: params.courseId,
    },
    data: {
      isPublished: params.isPublished,
    },
  });
}
