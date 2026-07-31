"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { setTeacherPaymentVisibilityAction } from "@/actions/payment";

interface TeacherWithDetail {
  clerkUserId: string;
  displayName: string | null;
  paymentDetail: {
    detailsAr: string | null;
    detailsEn: string | null;
    whatsappNumber: string | null;
    qrImageUrl: string | null;
    isVisibleToStudents: boolean;
  } | null;
}

export function TeacherVisibilityRow({
  teacher,
}: {
  teacher: TeacherWithDetail;
}) {
  const t = useTranslations("Payment");
  const [isPending, startTransition] = useTransition();
  const [visible, setVisible] = useState(
    teacher.paymentDetail?.isVisibleToStudents ?? false
  );

  const hasDetail = Boolean(teacher.paymentDetail);

  function handleToggle(next: boolean) {
    setVisible(next);
    startTransition(async () => {
      await setTeacherPaymentVisibilityAction({
        teacherClerkId: teacher.clerkUserId,
        visible: next,
      });
    });
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <p className="font-medium">
            {teacher.displayName ?? teacher.clerkUserId}
          </p>
          {!hasDetail && <Badge variant="secondary">{t("noRequests")}</Badge>}
        </div>

        {hasDetail && (
          <div className="text-sm text-text-secondary space-y-1">
            {teacher.paymentDetail?.detailsAr && (
              <p dir="rtl">{teacher.paymentDetail.detailsAr}</p>
            )}
            {teacher.paymentDetail?.whatsappNumber && (
              <p>
                {t("whatsappNumber")}: {teacher.paymentDetail.whatsappNumber}
              </p>
            )}
          </div>
        )}

        {hasDetail && (
          <div className="flex items-center gap-3">
            <Switch
              checked={visible}
              onCheckedChange={handleToggle}
              disabled={isPending}
            />
            <Label>{t("visibleToStudents")}</Label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
