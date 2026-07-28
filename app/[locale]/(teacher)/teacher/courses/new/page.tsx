import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { SectionCard } from "@/components/shared/SectionCard";
import { CourseForm } from "@/components/teacher/CourseForm";
import { getSubjectsForTeacherCourseForm } from "@/lib/queries/teacher";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function NewTeacherCoursePage({ params }: Props) {
  const { locale } = await params;
  const user = await currentUser();
  const t = await getTranslations("TeacherDashboard");

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const subjects = await getSubjectsForTeacherCourseForm();

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <Link
          href={`/${locale}/teacher`}
          className={buttonVariants({ variant: "ghost" })}
        >
          {t("backToDashboard")}
        </Link>

        <SectionCard>
          <div className="space-y-6">
            <h1 className="text-xl font-semibold text-text-primary">
              {t("createCourse")}
            </h1>
            <CourseForm mode="create" subjects={subjects} />
          </div>
        </SectionCard>
      </div>
      <div className="mx-auto w-full max-w-3xl">
        <SectionCard>
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-text-primary">
              {t("createCourse")}
            </h1>
          </div>

          <CourseForm mode="create" subjects={subjects} />
        </SectionCard>
      </div>
    </main>
  );
}
