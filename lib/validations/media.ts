import { z } from "zod";

export const saveCloudinaryMediaSchema = z.object({
  lessonId: z.string().min(1),
  cloudinaryPublicId: z.string().min(1),
  cloudinaryResourceType: z.string().default("video"),
  durationSeconds: z.number().int().positive().optional(),
});

export const saveExternalLinkMediaSchema = z.object({
  lessonId: z.string().min(1),
  externalUrl: z.string().url(),
});

export type SaveCloudinaryMediaInput = z.infer<
  typeof saveCloudinaryMediaSchema
>;
export type SaveExternalLinkMediaInput = z.infer<
  typeof saveExternalLinkMediaSchema
>;
