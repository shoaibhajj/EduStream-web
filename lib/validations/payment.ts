import { z } from "zod";

export const updatePaymentConfigSchema = z.object({
  instructionsAr: z.string().optional(),
  instructionsEn: z.string().optional(),
  shamCashQrImageUrl: z.string().url().optional().or(z.literal("")),
  shamCashWhatsappNumber: z.string().optional(),
  shamCashInstructionsAr: z.string().optional(),
  shamCashInstructionsEn: z.string().optional(),
  showTeacherDetailsToStudents: z.boolean().optional(),
});

export const upsertTeacherPaymentDetailSchema = z.object({
  teacherClerkId: z.string().min(1),
  detailsAr: z.string().optional(),
  detailsEn: z.string().optional(),
  whatsappNumber: z.string().optional(),
});

export const createPaymentRequestSchema = z.object({
  requestType: z.enum(["course", "subscription"]),
  courseId: z.string().optional().nullable(),
  phoneNumber: z.string().min(7, "phone_required"),
  paymentReference: z.string().min(3, "reference_required"),
});

export const reviewPaymentRequestSchema = z.object({
  requestId: z.string().min(1),
  action: z.enum(["approve", "reject"]),
  adminNote: z.string().optional(),
});
