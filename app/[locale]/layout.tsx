import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <ClerkProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div dir={locale === "ar" ? "rtl" : "ltr"}>{children}</div>
        <Toaster richColors position="top-center" />
      </NextIntlClientProvider>
    </ClerkProvider>
  );
}
