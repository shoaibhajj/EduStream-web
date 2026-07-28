import { z } from "zod";

export const courseFormSchema = z.object({
  subjectId: z.string().min(1),
  nameAr: z.string().trim().min(1),
  nameEn: z.string().trim().optional().or(z.literal("")),
  descriptionAr: z.string().trim().optional().or(z.literal("")),
  descriptionEn: z.string().trim().optional().or(z.literal("")),
  price: z.coerce.number().int().min(0).default(0),
});

export const updateCourseFormSchema = courseFormSchema.extend({
  courseId: z.string().min(1),
});

export type CourseFormInput = z.input<typeof courseFormSchema>;
export type CourseFormValues = z.output<typeof courseFormSchema>;

export type UpdateCourseFormInput = z.input<typeof updateCourseFormSchema>;
export type UpdateCourseFormValues = z.output<typeof updateCourseFormSchema>;
