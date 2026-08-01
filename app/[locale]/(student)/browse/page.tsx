import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getActiveAcademicYears } from "@/lib/queries/browse";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";


export default async function BrowsePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Browse");

  let years: Awaited<ReturnType<typeof getActiveAcademicYears>> = [];
  let loadError = false;

  try {
    years = await getActiveAcademicYears();
  } catch {
    loadError = true;
  }

  return (
    <main className="px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">
        {t("yearsHeading")}
      </h1>

      {loadError && <ErrorState message={t("errorLoad")} />}

      {!loadError && years.length === 0 && (
        <EmptyState message={t("emptyYears")} />
      )}

      {!loadError && years.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {years.map((year) => (
            <li key={year.id}>
              <Link href={`/${locale}/browse/${year.id}`}>
                <SectionCard className="cursor-pointer hover:border-accent transition-colors p-5">
                  <p className="text-lg font-semibold text-text-primary">
                    {locale === "ar" ? year.nameAr : year.nameEn ?? year.nameAr}
                  </p>
                </SectionCard>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
