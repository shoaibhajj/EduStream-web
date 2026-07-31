import { prisma } from "@/lib/prisma";

/** Read the single global payment config. */
export async function getGlobalPaymentConfig() {
  return prisma.paymentConfig.findUnique({
    where: { id: "global-payment-config" },
  });
}

/** Read teacher-specific payment details for a given Clerk user ID. */
export async function getTeacherPaymentDetail(teacherClerkId: string) {
  return prisma.teacherPaymentDetail.findUnique({
    where: { teacherClerkId },
  });
}

/** All teacher payment details — admin only. */
export async function getAllTeacherPaymentDetails() {
  return prisma.teacherPaymentDetail.findMany({
    orderBy: { createdAt: "asc" },
  });
}

/** Payment config + optionally teacher detail, merged for student view.
 *  Returns teacherDetail only when admin has enabled showTeacherDetailsToStudents
 *  AND a teacherClerkId is provided (i.e. course has a teacher). */
export async function getStudentPaymentInstructions(
  teacherClerkId?: string | null
) {
  const config = await getGlobalPaymentConfig();

  let teacherDetail = null;
  if (teacherClerkId) {
    const detail = await prisma.teacherPaymentDetail.findUnique({
      where: { teacherClerkId },
    });
    if (detail?.isVisibleToStudents) teacherDetail = detail;
  }

  return { config, teacherDetail };
}

/** Admin: list all teachers with a profile, plus their payment detail if submitted. */
export async function getTeachersWithPaymentDetails() {
  const teachers = await prisma.profile.findMany({
    where: { role: "teacher" },
    select: {
      clerkUserId: true,
      displayName: true,
    },
    orderBy: { displayName: "asc" },
  });

  const details = await prisma.teacherPaymentDetail.findMany();
  const detailMap = new Map(details.map((d) => [d.teacherClerkId, d]));

  return teachers.map((t) => ({
    ...t,
    paymentDetail: detailMap.get(t.clerkUserId) ?? null,
  }));
}

/** Teacher: read their own payment detail. */
export async function getMyTeacherPaymentDetail(teacherClerkId: string) {
  return prisma.teacherPaymentDetail.findUnique({ where: { teacherClerkId } });
}

/** All payment requests — admin view, newest first. */
export async function getAllPaymentRequests() {
  return prisma.paymentRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      profile: { select: { displayName: true, clerkUserId: true } },
      course: { select: { nameAr: true, nameEn: true } },
    },
  });
}

/** Payment requests for one student. */
export async function getStudentPaymentRequests(profileId: string) {
  return prisma.paymentRequest.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
    include: {
      course: { select: { nameAr: true, nameEn: true } },
    },
  });
}
