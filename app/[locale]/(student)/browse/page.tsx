import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getActiveAcademicYears } from "@/lib/queries/browse";

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
    <main className="px-6 py-10" dir="auto">
      <h1 className="mb-6 text-2xl font-bold">{t("yearsHeading")}</h1>

      {loadError && <p className="text-red-600">{t("errorLoad")}</p>}

      {!loadError && years.length === 0 && (
        <p className="text-muted-foreground">{t("emptyYears")}</p>
      )}

      {!loadError && years.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {years.map((year) => (
            <li key={year.id}>
              <Link
                href={`/${locale}/browse/${year.id}`}
                className="block rounded-xl border p-5 hover:bg-accent transition-colors"
              >
                <p className="text-lg font-semibold">
                  {locale === "ar" ? year.nameAr : year.nameEn ?? year.nameAr}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
