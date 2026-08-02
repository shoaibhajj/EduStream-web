import { SignIn } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignInPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("auth");

  return (
    <AuthShell
      brand={t("shell.brand")}
      tagline={t("shell.tagline")}
      title={t("signIn.title")}
      description={t("signIn.description")}
    >
      <SignIn
        appearance={clerkAppearance}
        path={`/${locale}/sign-in`}
        routing="path"
        signUpUrl={`/${locale}/sign-up`}
        fallbackRedirectUrl={`/${locale}`}
      />
    </AuthShell>
  );
}
