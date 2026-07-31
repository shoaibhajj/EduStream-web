import { getTranslations } from "next-intl/server";
import { getAllPaymentRequests } from "@/lib/queries/payment";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { RequestReviewRow } from "./RequestReviewRow";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminPaymentRequestsPage() {
  const t = await getTranslations("Payment");
  const requests = await getAllPaymentRequests();

  return (
    <div className="space-y-6 p-6">
      <PageHeader title={t("adminRequests")} />
      {requests.length === 0 ? (
        <EmptyState message={t("noRequests")} />
      ) : (
        <Card>
          <CardContent className="divide-y">
            {requests.map((req) => (
              <RequestReviewRow key={req.id} request={req} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
