import { getTranslations } from "next-intl/server";
import { getAllPaymentRequests } from "@/lib/queries/payment";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { RequestReviewRow } from "./RequestReviewRow";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireAdmin } from "@/lib/access/guards";
import { forbidden } from "next/navigation";
import { getCurrentProfile } from "@/lib/access/guards";
import { isAdmin } from "@/lib/access/roles";

export default async function AdminPaymentRequestsPage() {
  const profile = await getCurrentProfile();

  if (!profile || !isAdmin(profile)) {
    forbidden();
  }
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
