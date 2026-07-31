"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertMyTeacherPaymentDetailAction } from "@/actions/payment";
import type { TeacherPaymentDetail } from "@/lib/generated/prisma";

interface Props {
  detail: TeacherPaymentDetail | null;
}

export function TeacherPaymentForm({ detail }: Props) {
  const t = useTranslations("Payment");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [detailsAr, setDetailsAr] = useState(detail?.detailsAr ?? "");
  const [detailsEn, setDetailsEn] = useState(detail?.detailsEn ?? "");
  const [whatsappNumber, setWhatsappNumber] = useState(
    detail?.whatsappNumber ?? ""
  );
  const [qrImageUrl, setQrImageUrl] = useState(detail?.qrImageUrl ?? "");

  function handleSave() {
    startTransition(async () => {
      await upsertMyTeacherPaymentDetailAction({
        detailsAr,
        detailsEn,
        whatsappNumber,
        qrImageUrl,
      });
      setSaved(true);
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("myPaymentDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t("teacherDetailsAr")}</Label>
            <Textarea
              value={detailsAr}
              onChange={(e) => setDetailsAr(e.target.value)}
              dir="rtl"
            />
          </div>

          <div>
            <Label>{t("teacherDetailsEn")}</Label>
            <Textarea
              value={detailsEn}
              onChange={(e) => setDetailsEn(e.target.value)}
              dir="ltr"
            />
          </div>

          <div>
            <Label>{t("whatsappNumber")}</Label>
            <Input
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+963..."
              dir="ltr"
            />
          </div>

          <div>
            <Label>{t("qrImageUrl")}</Label>
            <Input
              value={qrImageUrl}
              onChange={(e) => setQrImageUrl(e.target.value)}
              placeholder="https://..."
              dir="ltr"
            />
          </div>

          <Button onClick={handleSave} disabled={isPending}>
            {t("saveMyDetails")}
          </Button>

          {saved && (
            <p className="text-sm text-success">{t("requestSubmitted")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
