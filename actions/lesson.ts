"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createLessonSchema } from "@/lib/validations/lesson";
import { createLessonForTeacher, updateLessonForTeacher } from "@/lib/mutations/lesson";
import { deleteLessonForTeacher } from "@/lib/mutations/lesson";
export async function createLessonAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "unauthorized" };
  }

  const raw = {
    courseId: formData.get("courseId"),
    titleAr: formData.get("titleAr"),
    titleEn: formData.get("titleEn"),
    description: formData.get("description"),
    isPreview: formData.get("isPreview") === "true",
    isPublished: formData.get("isPublished") === "true",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };

  const parsed = createLessonSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: "validation_failed" };
  }

  let lessonId: string;

  try {
    const lesson = await createLessonForTeacher(parsed.data, userId);
    lessonId = lesson.id;
  } catch (error) {
    console.error("[actions/lesson] createLessonAction", error);
    return { error: "server_error" };
  }

  redirect(`/ar/teacher/courses/${parsed.data.courseId}/lessons/${lessonId}`);
}

export async function updateLessonAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "unauthorized" };

  const lessonId = String(formData.get("lessonId") ?? "");
  const raw = {
    courseId: formData.get("courseId"),
    titleAr: formData.get("titleAr"),
    titleEn: formData.get("titleEn"),
    description: formData.get("description"),
    isPreview: formData.get("isPreview") === "true",
    isPublished: formData.get("isPublished") === "true",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };

  const parsed = createLessonSchema.safeParse(raw);
  if (!parsed.success) return { error: "validation_failed" };

  try {
    await updateLessonForTeacher(
      lessonId,
      parsed.data.courseId,
      userId,
      parsed.data
    );
  } catch (error) {
    console.error("[actions/lesson] updateLessonAction", error);
    return { error: "server_error" };
  }

  redirect(`/ar/teacher/courses/${parsed.data.courseId}/lessons/${lessonId}`);
}



export async function deleteLessonAction(formData: FormData): Promise<void> {
  const { userId } = await auth();

  const lessonId = String(formData.get("lessonId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");

  if (!userId || !lessonId || !courseId) {
    redirect(`/ar/teacher/courses/${courseId}?deleteError=validation_failed`);
  }

  try {
    await deleteLessonForTeacher(lessonId, courseId, userId);
  } catch (error) {
    console.error("[actions/lesson] deleteLessonAction", error);
    redirect(`/ar/teacher/courses/${courseId}?deleteError=server_error`);
  }

  redirect(`/ar/teacher/courses/${courseId}`);
}