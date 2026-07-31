import { prisma } from '@/lib/prisma'
import { PaymentRequestType } from '@/lib/generated/prisma'

// ── Admin: Global Payment Config ────────────────────────────────────────────

export interface UpdatePaymentConfigInput {
  instructionsAr?: string;
  instructionsEn?: string;
  shamCashQrImageUrl?: string;
  shamCashWhatsappNumber?: string;
  shamCashInstructionsAr?: string;
  shamCashInstructionsEn?: string;
}

export async function updatePaymentConfig(data: UpdatePaymentConfigInput) {
  return prisma.paymentConfig.update({
    where: { id: "global-payment-config" },
    data,
  });
}

// ── Admin: Teacher Payment Details ──────────────────────────────────────────

export interface UpsertMyTeacherPaymentDetailInput {
  teacherClerkId: string;
  detailsAr?: string;
  detailsEn?: string;
  whatsappNumber?: string;
  qrImageUrl?: string;
}

export async function upsertMyTeacherPaymentDetail(
  data: UpsertMyTeacherPaymentDetailInput
) {
  return prisma.teacherPaymentDetail.upsert({
    where: { teacherClerkId: data.teacherClerkId },
    update: {
      detailsAr: data.detailsAr,
      detailsEn: data.detailsEn,
      whatsappNumber: data.whatsappNumber,
      qrImageUrl: data.qrImageUrl,
    },
    create: { ...data, isVisibleToStudents: false },
  });
}

// Admin-only — flips visibility, never touches content
export async function setTeacherPaymentVisibility(teacherClerkId: string, visible: boolean) {
  return prisma.teacherPaymentDetail.update({
    where: { teacherClerkId },
    data: { isVisibleToStudents: visible },
  })
}

// ── Student: Submit Payment Request ─────────────────────────────────────────

export interface CreatePaymentRequestInput {
  profileId: string
  requestType: PaymentRequestType
  courseId?: string | null
  phoneNumber: string
  paymentReference: string
}

export async function createPaymentRequest(data: CreatePaymentRequestInput) {
  if (data.requestType === 'course' && !data.courseId) {
    throw new Error('courseId is required for course payment requests')
  }
  return prisma.paymentRequest.create({ data })
}

// ── Admin: Review (approve / reject) ────────────────────────────────────────

export async function approvePaymentRequest(requestId: string, adminNote?: string) {
  const request = await prisma.paymentRequest.findUniqueOrThrow({
    where: { id: requestId },
  })

  return prisma.$transaction(async (tx) => {
    // 1. Mark request approved
    await tx.paymentRequest.update({
      where: { id: requestId },
      data: {
        status: 'approved',
        adminNote: adminNote ?? null,
        reviewedAt: new Date(),
      },
    })

    // 2. Update access truthfully
    if (request.requestType === 'course' && request.courseId) {
      // Upsert enrollment for this course
      await tx.enrollment.upsert({
        where: {
          profileId_courseId: {
            profileId: request.profileId,
            courseId: request.courseId,
          },
        },
        update: { status: 'confirmed' },
        create: {
          profileId: request.profileId,
          courseId: request.courseId,
          status: 'confirmed',
        },
      })
    } else if (request.requestType === 'subscription') {
      // Mark profile as having an active subscription
      await tx.profile.update({
        where: { id: request.profileId },
        data: { hasActiveSubscription: true },
      })
    }
  })
}

export async function rejectPaymentRequest(requestId: string, adminNote?: string) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.paymentRequest.findUniqueOrThrow({
      where: { id: requestId },
    })

    await tx.paymentRequest.update({
      where: { id: requestId },
      data: {
        status: 'rejected',
        adminNote: adminNote ?? null,
        reviewedAt: new Date(),
      },
    })

    // If it was a course request, mark enrollment as rejected too
    if (request.requestType === 'course' && request.courseId) {
      await tx.enrollment.upsert({
        where: {
          profileId_courseId: {
            profileId: request.profileId,
            courseId: request.courseId,
          },
        },
        update: { status: 'rejected' },
        create: {
          profileId: request.profileId,
          courseId: request.courseId,
          status: 'rejected',
        },
      })
    }
  })
}