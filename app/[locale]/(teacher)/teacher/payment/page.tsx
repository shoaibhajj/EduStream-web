import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMyTeacherPaymentDetail } from "@/lib/queries/payment";
import { TeacherPaymentForm } from "./TeacherPaymentForm";
import { requireApprovedTeacher } from "@/lib/access/guards";
import { forbidden } from "next/navigation";
import { getCurrentProfile } from "@/lib/access/guards";
import { isAdmin, isApprovedTeacher } from "@/lib/access/roles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherPaymentPage() {
const profile = await getCurrentProfile();

if (!profile || (!isApprovedTeacher(profile) && !isAdmin(profile))) {
  forbidden();
}
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const detail = await getMyTeacherPaymentDetail(userId);
  return <TeacherPaymentForm detail={detail} />;
}
