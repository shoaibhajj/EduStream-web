import { z } from "zod";

export const saveCloudinaryMediaSchema = z.object({
  lessonId: z.string().min(1),
  cloudinaryPublicId: z.string().min(1),
  cloudinaryResourceType: z.string().default("video"),
  durationSeconds: z.number().int().positive().optional(),
});

export const saveCloudinaryLinkSchema = z.object({
  lessonId: z.string().min(1),
  cloudinaryPublicId: z.string().min(1),
  cloudinaryResourceType: z.string().default("video"),
});

export const saveExternalLinkMediaSchema = z.object({
  lessonId: z.string().min(1),
  externalUrl: z.string().url(),
  // Must be a direct media URL — validation enforced at action level
});

export const saveDailymotionLinkSchema = z.object({
  lessonId: z.string().min(1),
  rawInput: z.string().min(1),
  // rawInput may be a URL or iframe snippet — normalized server-side
});

export const saveDailymotionUploadSchema = z.object({
  lessonId: z.string().min(1),
  dailymotionVideoId: z.string().min(1),
  dailymotionPrivateId: z.string().min(1).optional(),
  durationSeconds: z.number().int().positive().optional(),
  isReady: z.boolean(),
});

export type SaveCloudinaryMediaInput = z.infer<
  typeof saveCloudinaryMediaSchema
>;
export type SaveCloudinaryLinkInput = z.infer<typeof saveCloudinaryLinkSchema>;
export type SaveExternalLinkMediaInput = z.infer<
  typeof saveExternalLinkMediaSchema
>;
export type SaveDailymotionLinkInput = z.infer<
  typeof saveDailymotionLinkSchema
>;
export type SaveDailymotionUploadInput = z.infer<
  typeof saveDailymotionUploadSchema
>;
