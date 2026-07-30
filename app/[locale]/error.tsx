"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";

import { SectionCard } from "@/components/shared/SectionCard";
import { Button, buttonVariants } from "@/components/ui/button";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Errors");
  const params = useParams();
  const locale = params?.locale as string;

  useEffect(() => {
    console.error("[app-error-boundary]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <SectionCard className="max-w-md w-full text-center space-y-4">
        <h1 className="text-lg font-semibold text-text-primary">
          {t("title")}
        </h1>
        <p className="text-sm text-text-secondary">{t("description")}</p>

        <div className="flex justify-center gap-3 pt-2">
          <Button onClick={() => reset()}>{t("retry")}</Button>
          <Link
            href={`/${locale}`}
            className={buttonVariants({ variant: "outline" })}
          >
            {t("backHome")}
          </Link>
        </div>
      </SectionCard>
    </main>
  );
}
