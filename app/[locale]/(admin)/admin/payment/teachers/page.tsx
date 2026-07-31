import { getTeachersWithPaymentDetails } from "@/lib/queries/payment";
import { TeacherVisibilityRow } from "./TeacherVisibilityRow";


export default async function AdminTeacherPaymentsPage() {
  const teachers = await getTeachersWithPaymentDetails();
  return (
    <div className="space-y-4 p-6">
      {teachers.map((t) => (
        <TeacherVisibilityRow key={t.clerkUserId} teacher={t} />
      ))}
    </div>
  );
}
