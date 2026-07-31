"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updatePaymentConfigAction } from "@/actions/payment";
import type { PaymentConfig } from "@/lib/generated/prisma";

interface Props {
  config: PaymentConfig | null;
}

export function PaymentConfigForm({ config }: Props) {
  const t = useTranslations("Payment");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [instructionsAr, setInstructionsAr] = useState(
    config?.instructionsAr ?? ""
  );
  const [instructionsEn, setInstructionsEn] = useState(
    config?.instructionsEn ?? ""
  );
  const [qrUrl, setQrUrl] = useState(config?.shamCashQrImageUrl ?? "");
  const [whatsapp, setWhatsapp] = useState(
    config?.shamCashWhatsappNumber ?? ""
  );
  const [shamAr, setShamAr] = useState(config?.shamCashInstructionsAr ?? "");
  const [shamEn, setShamEn] = useState(config?.shamCashInstructionsEn ?? "");

  function handleSaveConfig() {
    startTransition(async () => {
      await updatePaymentConfigAction({
        instructionsAr,
        instructionsEn,
        shamCashQrImageUrl: qrUrl,
        shamCashWhatsappNumber: whatsapp,
        shamCashInstructionsAr: shamAr,
        shamCashInstructionsEn: shamEn,
      });
      setSaved(true);
    });
  }

  return (
    <div className="grid gap-4">
      <div>
        <Label>{t("instructionsAr")}</Label>
        <Textarea
          value={instructionsAr}
          onChange={(e) => setInstructionsAr(e.target.value)}
          dir="rtl"
        />
      </div>
      <div>
        <Label>{t("instructionsEn")}</Label>
        <Textarea
          value={instructionsEn}
          onChange={(e) => setInstructionsEn(e.target.value)}
          dir="ltr"
        />
      </div>
      <div>
        <Label>{t("qrImageUrl")}</Label>
        <Input
          value={qrUrl}
          onChange={(e) => setQrUrl(e.target.value)}
          placeholder="https://..."
          dir="ltr"
        />
      </div>
      <div>
        <Label>{t("whatsappNumber")}</Label>
        <Input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="+963..."
          dir="ltr"
        />
      </div>
      <div>
        <Label>{t("shamCashInstructionsAr")}</Label>
        <Textarea
          value={shamAr}
          onChange={(e) => setShamAr(e.target.value)}
          dir="rtl"
        />
      </div>
      <div>
        <Label>{t("shamCashInstructionsEn")}</Label>
        <Textarea
          value={shamEn}
          onChange={(e) => setShamEn(e.target.value)}
          dir="ltr"
        />
      </div>

      <Button onClick={handleSaveConfig} disabled={isPending}>
        {t("adminSaveConfig")}
      </Button>

      {saved && <p className="text-sm text-success">{t("requestSubmitted")}</p>}
    </div>
  );
}
