"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  updatePaymentConfig,
  createPaymentRequest,
  approvePaymentRequest,
  rejectPaymentRequest,
  upsertMyTeacherPaymentDetail,
  setTeacherPaymentVisibility,
} from "@/lib/mutations/payment";
import {
  updatePaymentConfigSchema,
  upsertTeacherPaymentDetailSchema,
  createPaymentRequestSchema,
  reviewPaymentRequestSchema,
} from "@/lib/validations/payment";
import { prisma } from "@/lib/prisma";

// ── Admin: Update global payment config ─────────────────────────────────────

export async function updatePaymentConfigAction(formData: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: userId },
  });
  if (profile?.role !== "admin") throw new Error("Forbidden");

  const parsed = updatePaymentConfigSchema.safeParse(formData);
  if (!parsed.success) throw new Error("Invalid input");

  await updatePaymentConfig(parsed.data);
  revalidatePath("/admin/payment");
}

// ── Student: Submit a payment request ───────────────────────────────────────

export async function createPaymentRequestAction(formData: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: userId },
  });
  if (!profile) throw new Error("Profile not found");

  const parsed = createPaymentRequestSchema.safeParse(formData);
  if (!parsed.success) throw new Error("Invalid input");

  await createPaymentRequest({ ...parsed.data, profileId: profile.id });
  revalidatePath("/payment/request");
}

// ── Admin: Approve or reject a request ──────────────────────────────────────

export async function reviewPaymentRequestAction(formData: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: userId },
  });
  if (profile?.role !== "admin") throw new Error("Forbidden");

  const parsed = reviewPaymentRequestSchema.safeParse(formData);
  if (!parsed.success) throw new Error("Invalid input");

  const { requestId, action, adminNote } = parsed.data;
  if (action === "approve") {
    await approvePaymentRequest(requestId, adminNote);
  } else {
    await rejectPaymentRequest(requestId, adminNote);
  }
  revalidatePath("/admin/payment/requests");
}

// Teacher self-service — teacher can only write their OWN record
export async function upsertMyTeacherPaymentDetailAction(formData: {
  detailsAr?: string
  detailsEn?: string
  whatsappNumber?: string
  qrImageUrl?: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await upsertMyTeacherPaymentDetail({ teacherClerkId: userId, ...formData })
  revalidatePath('/teacher/payment')
}

// Admin-only — toggle visibility for a specific teacher
export async function setTeacherPaymentVisibilityAction(input: {
  teacherClerkId: string
  visible: boolean
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } })
  if (profile?.role !== 'admin') throw new Error('Forbidden')

  await setTeacherPaymentVisibility(input.teacherClerkId, input.visible)
  revalidatePath('/admin/payment')
}