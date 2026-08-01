import { getTeachersWithPaymentDetails } from "@/lib/queries/payment";
import { TeacherVisibilityRow } from "./TeacherVisibilityRow";
import { requireAdmin } from "@/lib/access/guards";
import { forbidden } from "next/navigation";
import { getCurrentProfile } from "@/lib/access/guards";
import { isAdmin } from "@/lib/access/roles";


export default async function AdminTeacherPaymentsPage() {
   const profile = await getCurrentProfile();

   if (!profile || !isAdmin(profile)) {
     forbidden();
   }
  const teachers = await getTeachersWithPaymentDetails();
  return (
    <div className="space-y-4 p-6">
      {teachers.map((t) => (
        <TeacherVisibilityRow key={t.clerkUserId} teacher={t} />
      ))}
    </div>
  );
}
