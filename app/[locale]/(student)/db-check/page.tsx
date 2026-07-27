import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DbCheckPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);
console.log(locale);
  const t = await getTranslations("DbCheck");

  const years = await prisma.academicYear.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      subjects: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return (
    <main className="px-6 py-10">
      <h1 className="mb-4 text-2xl font-bold">{t("title")}</h1>
      <p className="mb-6 text-green-600">{t("success")}</p>

      {years.length === 0 ? (
        <p>{t("empty")}</p>
      ) : (
        <section>
          <h2 className="mb-4 text-xl font-semibold">{t("yearsHeading")}</h2>
          <ul className="space-y-4">
            {years.map((year) => {
              const yearLabel =
                locale === "ar" ? year.nameAr : year.nameEn || year.nameAr;

              return (
                <li key={year.id} className="rounded-lg border p-4">
                  <p className="font-semibold">{yearLabel}</p>

                  {year.subjects.length > 0 && (
                    <ul className="mt-2 list-disc ps-6">
                      {year.subjects.map((subject) => {
                        const subjectLabel =
                          locale === "ar"
                            ? subject.nameAr
                            : subject.nameEn || subject.nameAr;

                        return <li key={subject.id}>{subjectLabel}</li>;
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
