"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { reviewPaymentRequestAction } from "@/actions/payment";

interface RequestItem {
  id: string;
  status: string;
  requestType: string;
  phoneNumber: string;
  paymentReference: string;
  adminNote: string | null;
  createdAt: Date;
  profile: { displayName: string | null; clerkUserId: string };
  course: { nameAr: string; nameEn: string | null } | null;
}

export function RequestReviewRow({ request }: { request: RequestItem }) {
  const t = useTranslations("Payment");
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const statusVariant =
    request.status === "approved"
      ? "default"
      : request.status === "rejected"
      ? "destructive"
      : "secondary";

  function handle(action: "approve" | "reject") {
    startTransition(async () => {
      await reviewPaymentRequestAction({
        requestId: request.id,
        action,
        adminNote: note,
      });
    });
  }

  return (
    <div className="py-4 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium">
            {request.profile.displayName ?? request.profile.clerkUserId}
          </p>
          <p className="text-sm text-muted-foreground">
            {request.requestType === "course"
              ? request.course?.nameAr ?? "—"
              : t("requestTypeSubscription")}
          </p>
          <p className="text-sm">{request.phoneNumber}</p>
          <p className="text-sm text-muted-foreground">
            {request.paymentReference}
          </p>
        </div>
        <Badge variant={statusVariant}>
          {request.status === "pending"
            ? t("statusPending")
            : request.status === "approved"
            ? t("statusApproved")
            : t("statusRejected")}
        </Badge>
      </div>

      {request.status === "pending" && (
        <div className="space-y-2">
          <Textarea
            placeholder={t("adminNoteOptional")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handle("approve")}
              disabled={isPending}
            >
              {t("adminApprove")}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handle("reject")}
              disabled={isPending}
            >
              {t("adminReject")}
            </Button>
          </div>
        </div>
      )}

      {request.adminNote && (
        <p className="text-sm text-muted-foreground">{request.adminNote}</p>
      )}
    </div>
  );
}
