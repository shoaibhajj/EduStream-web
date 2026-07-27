import { PrismaClient } from "../lib/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const year = await prisma.academicYear.upsert({
    where: { id: "foundation-year-2025" },
    update: {},
    create: {
      id: "foundation-year-2025",
      nameAr: "الصف التأسيسي",
      nameEn: "Foundation Year",
      sortOrder: 1,
      isActive: true,
    },
  });

  const subject = await prisma.subject.upsert({
    where: { id: "foundation-math" },
    update: {},
    create: {
      id: "foundation-math",
      academicYearId: year.id,
      nameAr: "الرياضيات",
      nameEn: "Mathematics",
      sortOrder: 1,
      isActive: true,
    },
  });

  await prisma.course.upsert({
    where: { id: "foundation-math-course-01" },
    update: {},
    create: {
      id: "foundation-math-course-01",
      subjectId: subject.id,
      nameAr: "الرياضيات الأساسية",
      nameEn: "Core Mathematics",
      descriptionAr: "كورس شامل في أساسيات الرياضيات للمرحلة التأسيسية.",
      descriptionEn:
        "A comprehensive course covering core mathematics for the foundation year.",
      isPublished: true,
      sortOrder: 1,
    },
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
