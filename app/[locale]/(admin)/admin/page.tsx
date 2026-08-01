import { requireAdmin } from "@/lib/access/guards";
import { currentUser } from "@clerk/nextjs/server";
import { forbidden } from "next/navigation";
import { getCurrentProfile } from "@/lib/access/guards";
import { isAdmin } from "@/lib/access/roles";

export default async function AdminPage() {
   const profile = await getCurrentProfile();

   if (!profile || !isAdmin(profile)) {
     forbidden();
   }
  const user = await currentUser();
  return (
    <main className="min-h-screen bg-background p-8">
      <p className="text-sm text-text-secondary">أكاديمية المعلم</p>
      <h1 className="mt-2 text-2xl font-semibold">لوحة الإدارة</h1>
      <p className="mt-1 text-text-secondary">
        {user?.emailAddresses[0]?.emailAddress}
      </p>
    </main>
  );
}
