import { z } from "zod";

export const createLessonSchema = z.object({
  courseId: z.string().min(1),
  titleAr: z.string().min(1),
  titleEn: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  isPreview: z.coerce.boolean().default(false),
  isPublished: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
