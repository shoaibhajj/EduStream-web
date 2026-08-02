import { auth } from "@clerk/nextjs/server";
import { Show, UserButton } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// replace this import with your real Prisma client path/export
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const { userId } = await auth();

  if (userId) {
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId: userId },
      select: { role: true },
    });

    if (profile?.role === "teacher") {
      redirect({ href: "/teacher", locale });
    }

    if (profile?.role === "admin") {
      redirect({ href: "/admin", locale });
    }

    redirect({ href: "/browse", locale });
  }

  const t = await getTranslations("HomePage");

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
        <p className="font-semibold text-text-primary">{t("brand")}</p>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {t("signIn")}
            </Link>

            <Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
              {t("signUp")}
            </Link>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-4xl flex-col justify-center gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold text-text-primary">
          {t("title")}
        </h1>

        <p className="max-w-2xl text-base text-text-secondary">
          {t("description")}
        </p>

        <Show when="signed-out">
          <Link href="/sign-up" className={cn(buttonVariants(), "w-fit")}>
            {t("startNow")}
          </Link>
        </Show>
      </section>
    </main>
  );
}
