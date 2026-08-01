import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PaymentRequestForm } from "./PaymentRequestForm";
import { requireStudent } from "@/lib/access/guards";

export default async function PaymentRequestPage() {
    await requireStudent();
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Fetch published courses for the course dropdown
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    select: { id: true, nameAr: true, nameEn: true },
    orderBy: { nameAr: "asc" },
  });

  return <PaymentRequestForm courses={courses} />;
}
