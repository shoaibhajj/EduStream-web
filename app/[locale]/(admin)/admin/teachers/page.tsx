import { requireAdmin } from "@/lib/access/guards";
import { getAllTeachers } from "@/lib/queries/profile";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeacherRow } from "@/components/admin/TeacherRow";
import type { Profile } from "@/lib/generated/prisma";
import { forbidden } from "next/navigation";
import { getCurrentProfile } from "@/lib/access/guards";
import { isAdmin } from "@/lib/access/roles";

export default async function AdminTeachersPage() {
   const profile = await getCurrentProfile();

   if (!profile || !isAdmin(profile)) {
     forbidden();
   }
  const t = await getTranslations("Admin.Teachers");
  const teachers = await getAllTeachers();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold text-text-primary">{t("title")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("allTeachersHeading")}</CardTitle>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <p className="text-text-muted text-sm">{t("emptyState")}</p>
          ) : (
            <ul className="divide-y divide-border">
              {teachers.map((p: Profile
                
              ) => (
                <TeacherRow key={p.id} profile={p} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
