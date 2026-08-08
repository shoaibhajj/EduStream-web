import {
  PrismaClient,
  AppRole,
  TeacherApprovalStatus,
  EnrollmentStatus,
  MediaProvider,
} from "../lib/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminClerkUserId = "seed_admin_clerk_id";
  const teacherClerkUserId = "seed_teacher_clerk_id";
  const studentClerkUserId = "seed_student_clerk_id";

  const admin = await prisma.profile.upsert({
    where: { clerkUserId: adminClerkUserId },
    update: {
      role: AppRole.admin,
      displayName: "Seed Admin",
      email: "admin@moallem.test",
      teacherApprovalStatus: TeacherApprovalStatus.not_applicable,
      hasActiveSubscription: false,
    },
    create: {
      clerkUserId: adminClerkUserId,
      role: AppRole.admin,
      displayName: "Seed Admin",
      email: "admin@moallem.test",
      teacherApprovalStatus: TeacherApprovalStatus.not_applicable,
      hasActiveSubscription: false,
    },
  });

  const teacher = await prisma.profile.upsert({
    where: { clerkUserId: teacherClerkUserId },
    update: {
      role: AppRole.teacher,
      displayName: "Seed Teacher",
      email: "teacher@moallem.test",
      teacherApprovalStatus: TeacherApprovalStatus.approved,
      hasActiveSubscription: false,
    },
    create: {
      clerkUserId: teacherClerkUserId,
      role: AppRole.teacher,
      displayName: "Seed Teacher",
      email: "teacher@moallem.test",
      teacherApprovalStatus: TeacherApprovalStatus.approved,
      hasActiveSubscription: false,
    },
  });

  const student = await prisma.profile.upsert({
    where: { clerkUserId: studentClerkUserId },
    update: {
      role: AppRole.student,
      displayName: "Seed Student",
      email: "student@moallem.test",
      teacherApprovalStatus: TeacherApprovalStatus.not_applicable,
      hasActiveSubscription: false,
    },
    create: {
      clerkUserId: studentClerkUserId,
      role: AppRole.student,
      displayName: "Seed Student",
      email: "student@moallem.test",
      teacherApprovalStatus: TeacherApprovalStatus.not_applicable,
      hasActiveSubscription: false,
    },
  });

  let academicYear = await prisma.academicYear.findFirst({
    where: { nameAr: "الصف الأول" },
  });

  if (!academicYear) {
    academicYear = await prisma.academicYear.create({
      data: {
        nameAr: "الصف الأول",
        nameEn: "Grade 1",
        sortOrder: 1,
        isActive: true,
      },
    });
  }

  let subject = await prisma.subject.findFirst({
    where: {
      academicYearId: academicYear.id,
      nameAr: "الرياضيات",
    },
  });

  if (!subject) {
    subject = await prisma.subject.create({
      data: {
        academicYearId: academicYear.id,
        nameAr: "الرياضيات",
        nameEn: "Mathematics",
        sortOrder: 1,
        isActive: true,
      },
    });
  }

  let course = await prisma.course.findFirst({
    where: {
      subjectId: subject.id,
      teacherId: teacher.clerkUserId,
      nameAr: "أساسيات الرياضيات",
    },
  });

  if (!course) {
    course = await prisma.course.create({
      data: {
        subjectId: subject.id,
        teacherId: teacher.clerkUserId,
        nameAr: "أساسيات الرياضيات",
        nameEn: "Math Basics",
        descriptionAr: "دورة تجريبية لاختبار التطبيق.",
        descriptionEn: "A seed course for app testing.",
        thumbnailUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        price: 100,
        isPublished: true,
        sortOrder: 1,
      },
    });
  } else {
    course = await prisma.course.update({
      where: { id: course.id },
      data: {
        isPublished: true,
        price: 100,
      },
    });
  }

  let lesson = await prisma.lesson.findFirst({
    where: {
      courseId: course.id,
      sortOrder: 1,
    },
  });

  if (!lesson) {
    lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        titleAr: "الدرس الأول",
        titleEn: "Lesson One",
        description: "درس تجريبي / Seed lesson",
        isPreview: true,
        isPublished: true,
        sortOrder: 1,
      },
    });
  } else {
    lesson = await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        isPreview: true,
        isPublished: true,
      },
    });
  }

  await prisma.lessonMedia.upsert({
    where: { lessonId: lesson.id },
    update: {
      provider: MediaProvider.external_link,
      externalUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      cloudinaryPublicId: null,
      cloudinaryResourceType: "video",
      durationSeconds: 10,
      isReady: true,
    },
    create: {
      lessonId: lesson.id,
      provider: MediaProvider.external_link,
      externalUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      cloudinaryResourceType: "video",
      durationSeconds: 10,
      isReady: true,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      profileId_courseId: {
        profileId: student.id,
        courseId: course.id,
      },
    },
    update: {
      status: EnrollmentStatus.confirmed,
    },
    create: {
      profileId: student.id,
      courseId: course.id,
      status: EnrollmentStatus.confirmed,
    },
  });

  console.log({
    adminClerkUserId: admin.clerkUserId,
    teacherClerkUserId: teacher.clerkUserId,
    studentClerkUserId: student.clerkUserId,
    courseId: course.id,
    lessonId: lesson.id,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
