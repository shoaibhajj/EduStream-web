import { SignUp } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignUpPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("auth");

  return (
    <AuthShell
      brand={t("shell.brand")}
      tagline={t("shell.tagline")}
      title={t("signUp.title")}
      description={t("signUp.description")}
    >
      <SignUp
        appearance={clerkAppearance}
        path={`/${locale}/sign-up`}
        routing="path"
        signInUrl={`/${locale}/sign-in`}
      />
    </AuthShell>
  );
}
