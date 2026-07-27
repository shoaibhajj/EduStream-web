import { Show, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <p className="font-semibold">{t("brand")}</p>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              {t("signIn")}
            </Link>

            <Link
              href="/sign-up"
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              {t("signUp")}
            </Link>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-5xl flex-col justify-center gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>

        <p className="max-w-2xl text-base text-text-secondary">
          {t("description")}
        </p>

        <Show when="signed-out">
          <Link
            href="/sign-up"
            className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            {t("startNow")}
          </Link>
        </Show>
      </section>
    </main>
  );
}
