"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  saveCloudinaryMedia,
  saveExternalLinkMedia,
  deleteLessonMedia,
} from "@/lib/mutations/media";
import { saveDailymotionMedia } from "@/lib/mutations/dailymotion";
import {
  saveCloudinaryMediaSchema,
  saveExternalLinkMediaSchema,
  saveDailymotionLinkSchema,
  saveDailymotionUploadSchema,
  saveCloudinaryLinkSchema,
} from "@/lib/validations/media";
import { requireApprovedTeacher } from "@/lib/access/guards";
import {
  classifyExternalUrl,
  extractDailymotionIdFromEmbed,
  extractCloudinaryPublicId,
} from "@/lib/providers/video/sourceClassifier";

// ── EXISTING: DO NOT CHANGE ──────────────────────────────────────────────────

export async function saveCloudinaryMediaAction(formData: FormData) {
  const actor = await requireApprovedTeacher();
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
  const actor = await requireApprovedTeacher();
  if (!actor.clerkUserId) return { error: "unauthorized" };

  const raw = {
    lessonId: formData.get("lessonId"),
    externalUrl: formData.get("externalUrl"),
  };

  const parsed = saveExternalLinkMediaSchema.safeParse(raw);
  if (!parsed.success) return { error: "validation_failed" };

  // Classify the URL — only allow direct media URLs here now
  const classification = classifyExternalUrl(parsed.data.externalUrl);
  if (classification.type !== "direct_media") {
    return { error: "unsupported_url" };
  }

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
  const actor = await requireApprovedTeacher();
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

// ── NEW: CLOUDINARY LINK/EMBED ────────────────────────────────────────────────

export async function saveCloudinaryLinkAction(formData: FormData) {
  const actor = await requireApprovedTeacher();
  if (!actor.clerkUserId) return { error: "unauthorized" };

  const rawInput = String(formData.get("rawInput") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");
  if (!lessonId || !rawInput) return { error: "validation_failed" };

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const publicId = extractCloudinaryPublicId(rawInput, cloudName);
  if (!publicId) return { error: "invalid_cloudinary_input" };

  const parsed = saveCloudinaryLinkSchema.safeParse({
    lessonId,
    cloudinaryPublicId: publicId,
  });
  if (!parsed.success) return { error: "validation_failed" };

  try {
    await saveCloudinaryMedia(parsed.data);
    revalidatePath("/[locale]/(teacher)/course/[courseId]", "page");
    return { success: true };
  } catch (err) {
    console.error("[actions/media] saveCloudinaryLink failed", err);
    return { error: "server_error" };
  }
}

// ── NEW: DAILYMOTION LINK/EMBED ───────────────────────────────────────────────

export async function saveDailymotionLinkAction(formData: FormData) {
  const actor = await requireApprovedTeacher();
  if (!actor.clerkUserId) return { error: "unauthorized" };

  const raw = {
    lessonId: formData.get("lessonId"),
    rawInput: formData.get("rawInput"),
  };

  const parsed = saveDailymotionLinkSchema.safeParse(raw);
  if (!parsed.success) return { error: "validation_failed" };

  const { rawInput, lessonId } = parsed.data;

  // Try URL classification first
  let videoId: string | null = null;
  const classification = classifyExternalUrl(rawInput);
  if (
    classification.type === "dailymotion_link" &&
    classification.dailymotionVideoId
  ) {
    videoId = classification.dailymotionVideoId;
  } else {
    // Try iframe snippet extraction
    videoId = extractDailymotionIdFromEmbed(rawInput);
  }

  if (!videoId) return { error: "invalid_dailymotion_input" };

  try {
  await saveDailymotionMedia({
    lessonId,
    dailymotionVideoId: videoId,
    isReady: true,
  });
    revalidatePath("/[locale]/(teacher)/course/[courseId]", "page");
    return { success: true };
  } catch (err) {
    console.error("[actions/media] saveDailymotionLink failed", err);
    return { error: "server_error" };
  }
}

// ── NEW: DAILYMOTION UPLOAD METADATA SAVE ────────────────────────────────────
// NOTE: The actual file bytes go through the Dailymotion upload Route Handler
// at app/api/dailymotion/upload/route.ts — NOT through this Server Action.
// This action only saves already-uploaded metadata, same pattern as Cloudinary.
export async function saveDailymotionUploadAction(formData: FormData) {
  const actor = await requireApprovedTeacher();
  if (!actor.clerkUserId) return { error: "unauthorized" };

  const raw = {
    lessonId: formData.get("lessonId"),
    dailymotionVideoId: formData.get("dailymotionVideoId"),
    dailymotionPrivateId:
      typeof formData.get("dailymotionPrivateId") === "string" &&
      String(formData.get("dailymotionPrivateId")).trim()
        ? String(formData.get("dailymotionPrivateId")).trim()
        : undefined,
    durationSeconds:
      typeof formData.get("durationSeconds") === "string" &&
      String(formData.get("durationSeconds")).trim()
        ? Number(formData.get("durationSeconds"))
        : undefined,
    isReady: String(formData.get("isReady") ?? "").toLowerCase() === "true",
  };

  const parsed = saveDailymotionUploadSchema.safeParse(raw);
  if (!parsed.success) return { error: "validation_failed" };

  try {
    await saveDailymotionMedia(parsed.data);
    revalidatePath("/[locale]/(teacher)/course/[courseId]", "page");
    revalidatePath("/[locale]/(student)/watch/[lessonId]", "page");
    return { success: true };
  } catch (err) {
    console.error("[actions/media] saveDailymotionUpload failed", err);
    return { error: "server_error" };
  }
}