import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentPaymentInstructions } from "@/lib/queries/payment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function PaymentInstructionsPage({
  searchParams,
}: {
  searchParams: { teacherClerkId?: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const t = await getTranslations("Payment");
  const { config, teacherDetail } = await getStudentPaymentInstructions(
    searchParams.teacherClerkId
  );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">{t("globalInstructions")}</h1>

      {config?.instructionsAr && (
        <Card>
          <CardContent className="pt-4 whitespace-pre-wrap" dir="rtl">
            {config.instructionsAr}
          </CardContent>
        </Card>
      )}

      {/* Sham Cash block */}
      {(config?.shamCashQrImageUrl || config?.shamCashInstructionsAr) && (
        <Card>
          <CardHeader>
            <CardTitle>{t("shamCash")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {config.shamCashQrImageUrl && (
              <div className="flex justify-center">
                <Image
                  src={config.shamCashQrImageUrl}
                  alt={t("shamCashQr")}
                  width={200}
                  height={200}
                  className="rounded-lg border"
                />
              </div>
            )}
            {config.shamCashWhatsappNumber && (
              <p className="text-sm">
                {t("shamCashWhatsapp")}:{" "}
                <strong>{config.shamCashWhatsappNumber}</strong>
              </p>
            )}
            {config.shamCashInstructionsAr && (
              <p className="text-sm" dir="rtl">
                {config.shamCashInstructionsAr}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Teacher-specific details (only when admin enabled) */}
      {teacherDetail && (
        <Card>
          <CardHeader>
            <CardTitle>{t("teacherPaymentDetails")}</CardTitle>
          </CardHeader>
          <CardContent dir="rtl" className="whitespace-pre-wrap text-sm">
            {teacherDetail.detailsAr}
          </CardContent>
        </Card>
      )}

      <Link href="/payment/request" className={buttonVariants()}>
        {t("requestTitle")}
      </Link>
    </div>
  );
}
