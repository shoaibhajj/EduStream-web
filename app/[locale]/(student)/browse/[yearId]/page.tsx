import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  getSubjectsByYear,
  getActiveAcademicYears,
} from "@/lib/queries/browse";
import { notFound } from "next/navigation";

export default async function YearPage({
  params,
}: {
  params: Promise<{ locale: string; yearId: string }>;
}) {
  const { locale, yearId } = await params;
  const t = await getTranslations("Browse");

  // Validate the yearId exists
  const years = await getActiveAcademicYears();
  const year = years.find((y) => y.id === yearId);
  if (!year) notFound();

  let subjects: Awaited<ReturnType<typeof getSubjectsByYear>> = [];
  let loadError = false;

  try {
    subjects = await getSubjectsByYear(yearId);
  } catch {
    loadError = true;
  }

  const yearName = locale === "ar" ? year.nameAr : year.nameEn ?? year.nameAr;

  return (
    <main className="px-6 py-10" dir="auto">
      <Link
        href={`/${locale}/browse`}
        className="mb-6 inline-block text-sm text-muted-foreground hover:underline"
      >
        ← {t("backToYears")}
      </Link>

      <h1 className="mb-6 text-2xl font-bold">
        {yearName} — {t("subjectsHeading")}
      </h1>

      {loadError && <p className="text-red-600">{t("errorLoad")}</p>}

      {!loadError && subjects.length === 0 && (
        <p className="text-muted-foreground">{t("emptySubjects")}</p>
      )}

      {!loadError && subjects.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <li key={subject.id}>
              <Link
                href={`/${locale}/browse/${yearId}/${subject.id}`}
                className="block rounded-xl border p-5 hover:bg-accent transition-colors"
              >
                <p className="text-lg font-semibold">
                  {locale === "ar"
                    ? subject.nameAr
                    : subject.nameEn ?? subject.nameAr}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
