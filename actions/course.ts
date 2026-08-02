"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCourse,
  setCoursePublishState,
  updateCourseBasics,
} from "@/lib/mutations/course";
import {
  courseFormSchema,
  updateCourseFormSchema,
} from "@/lib/validations/course";
import { requireApprovedTeacher } from "@/lib/access/guards";



function toOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "";
  return value;
}

export async function createCourseAction(formData: FormData) {
const actor = await requireApprovedTeacher();

  if (!actor.clerkUserId) {
    return {
      success: false,
      error: "UNAUTHORIZED",
    };
  }

  const parsed = courseFormSchema.safeParse({
    subjectId: toOptionalString(formData.get("subjectId")),
    nameAr: toOptionalString(formData.get("nameAr")),
    nameEn: toOptionalString(formData.get("nameEn")),
    descriptionAr: toOptionalString(formData.get("descriptionAr")),
    descriptionEn: toOptionalString(formData.get("descriptionEn")),
    price: toOptionalString(formData.get("price")),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "VALIDATION_ERROR",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const course = await createCourse({
    teacherId: actor.clerkUserId,
    ...parsed.data,
  });

  revalidatePath("/ar/teacher");
  revalidatePath("/en/teacher");
  redirect(`/${formData.get("locale")}/teacher`);
}

export async function updateCourseAction(formData: FormData) {
const actor = await requireApprovedTeacher();

  if (!actor.clerkUserId) {
    return {
      success: false,
      error: "UNAUTHORIZED",
    };
  }

  const parsed = updateCourseFormSchema.safeParse({
    courseId: toOptionalString(formData.get("courseId")),
    subjectId: toOptionalString(formData.get("subjectId")),
    nameAr: toOptionalString(formData.get("nameAr")),
    nameEn: toOptionalString(formData.get("nameEn")),
    descriptionAr: toOptionalString(formData.get("descriptionAr")),
    descriptionEn: toOptionalString(formData.get("descriptionEn")),
    price: toOptionalString(formData.get("price")),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "VALIDATION_ERROR",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await updateCourseBasics({
    teacherId: actor.clerkUserId,
    ...parsed.data,
  });

  revalidatePath("/ar/teacher");
  revalidatePath("/en/teacher");
  revalidatePath(`/ar/teacher/courses/${parsed.data.courseId}/edit`);
  revalidatePath(`/en/teacher/courses/${parsed.data.courseId}/edit`);
  redirect(`/${formData.get("locale")}/teacher`);
}

export async function setCoursePublishStateAction(input: {
  courseId: string;
  isPublished: boolean;
}) {

const actor = await requireApprovedTeacher();
  if (!actor.clerkUserId) {
    return {
      success: false,
      error: "UNAUTHORIZED",
    };
  }

  await setCoursePublishState({
    courseId: input.courseId,
    teacherId: actor.clerkUserId,
    isPublished: input.isPublished,
  });

  revalidatePath("/ar/teacher");
  revalidatePath("/en/teacher");

  return {
    success: true,
  };
}
