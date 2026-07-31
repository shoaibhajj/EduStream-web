import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMyTeacherPaymentDetail } from "@/lib/queries/payment";
import { TeacherPaymentForm } from "./TeacherPaymentForm";


export default async function TeacherPaymentPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const detail = await getMyTeacherPaymentDetail(userId);
  return <TeacherPaymentForm detail={detail} />;
}
