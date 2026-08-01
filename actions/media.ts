"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  saveCloudinaryMedia,
  saveExternalLinkMedia,
  deleteLessonMedia,
} from "@/lib/mutations/media";
import {
  saveCloudinaryMediaSchema,
  saveExternalLinkMediaSchema,
} from "@/lib/validations/media";
import { requireApprovedTeacher } from "@/lib/access/guards";

const actor = await requireApprovedTeacher();

export async function saveCloudinaryMediaAction(formData: FormData) {
  if (!actor.clerkUserId) return { error: "unauthorized" };

  const raw = {
    lessonId: formData.get("lessonId"),
    cloudinaryPublicId: formData.get("cloudinaryPublicId"),
    cloudinaryResourceType: formData.get("cloudinaryResourceType") ?? "video",
    durationSeconds: formData.get("durationSeconds")
      ? Number(formData.get("durationSeconds"))
      : undefined,
  };

  const parsed = saveCloudinaryMediaSchema.safeParse(raw);
  if (!parsed.success) return { error: "validation_failed" };

  try {
    await saveCloudinaryMedia(parsed.data);
    revalidatePath("/[locale]/(teacher)/course/[courseId]", "page");
    return { success: true };
  } catch (err) {
    console.error("[actions/media] saveCloudinaryMedia failed", err);
    return { error: "server_error" };
  }
}

export async function saveExternalLinkMediaAction(formData: FormData) {

  if (!actor.clerkUserId) return { error: "unauthorized" };

  const raw = {
    lessonId: formData.get("lessonId"),
    externalUrl: formData.get("externalUrl"),
  };

  const parsed = saveExternalLinkMediaSchema.safeParse(raw);
  if (!parsed.success) return { error: "validation_failed" };

  try {
    await saveExternalLinkMedia(parsed.data);
    revalidatePath("/[locale]/(teacher)/course/[courseId]", "page");
    return { success: true };
  } catch (err) {
    console.error("[actions/media] saveExternalLinkMedia failed", err);
    return { error: "server_error" };
  }
}

export async function deleteLessonMediaAction(lessonId: string) {
  if (!actor.clerkUserId) return { error: "unauthorized" };

  try {
    await deleteLessonMedia(lessonId);
    revalidatePath("/[locale]/(teacher)/course/[courseId]", "page");
    return { success: true };
  } catch (err) {
    console.error("[actions/media] deleteLessonMedia failed", err);
    return { error: "server_error" };
  }
}
