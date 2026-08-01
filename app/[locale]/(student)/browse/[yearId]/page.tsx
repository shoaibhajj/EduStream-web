import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  getSubjectsByYear,
  getActiveAcademicYears,
} from "@/lib/queries/browse";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ChevronRight } from "lucide-react";
import { requireStudent } from "@/lib/access/guards";

export default async function YearPage({
  params,
}: {
  params: Promise<{ locale: string; yearId: string }>;
}) {
    await requireStudent();
  const { locale, yearId } = await params;
  const t = await getTranslations("Browse");

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
    <main className="px-6 py-10">
      <Link
        href={`/${locale}/browse`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary transition-colors"
      >
        <ChevronRight size={14} className="rotate-180 rtl:rotate-0" />
        {t("backToYears")}
      </Link>

      <h1 className="mb-6 text-2xl font-semibold text-text-primary">
        {yearName} — {t("subjectsHeading")}
      </h1>

      {loadError && <ErrorState message={t("errorLoad")} />}

      {!loadError && subjects.length === 0 && (
        <EmptyState message={t("emptySubjects")} />
      )}

      {!loadError && subjects.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <li key={subject.id}>
              <Link href={`/${locale}/browse/${yearId}/${subject.id}`}>
                <SectionCard className="cursor-pointer hover:border-accent transition-colors p-5">
                  <p className="text-lg font-semibold text-text-primary">
                    {locale === "ar"
                      ? subject.nameAr
                      : subject.nameEn ?? subject.nameAr}
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
