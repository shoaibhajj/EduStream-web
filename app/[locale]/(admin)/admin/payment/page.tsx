import { getTranslations } from "next-intl/server";
import {
  getGlobalPaymentConfig,
  getAllTeacherPaymentDetails,
} from "@/lib/queries/payment";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentConfigForm } from "./PaymentConfigForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminPaymentPage() {
  const t = await getTranslations("Payment");
  const config = await getGlobalPaymentConfig();
  const teacherDetails = await getAllTeacherPaymentDetails();

  return (
    <div className="space-y-6 p-6">
      <PageHeader title={t("adminConfig")} />
      <Card>
        <CardHeader>
          <CardTitle>{t("adminConfig")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentConfigForm config={config} teacherDetails={teacherDetails} />
        </CardContent>
      </Card>
    </div>
  );
}
