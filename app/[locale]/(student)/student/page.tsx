import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { SectionCard } from "@/components/shared/SectionCard";
import { requireStudent } from "@/lib/access/guards";

export default async function StudentPage() {
    await requireStudent();
  const user = await currentUser();
  const t = await getTranslations("StudentDashboard");

  const name = user?.firstName ?? t("defaultName");

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <SectionCard className="max-w-2xl">
        <p className="text-sm text-text-secondary mb-1">{t("brand")}</p>
        <h1 className="text-2xl font-semibold text-text-primary">
          {t("greeting", { name })}
        </h1>
      </SectionCard>
    </main>
  );
}
