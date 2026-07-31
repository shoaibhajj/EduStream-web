"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPaymentRequestAction } from "@/actions/payment";

interface Course {
  id: string;
  nameAr: string;
  nameEn: string | null;
}

export function PaymentRequestForm({ courses }: { courses: Course[] }) {
  const t = useTranslations("Payment");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const [requestType, setRequestType] = useState<"course" | "subscription">(
    "course"
  );
const [courseId, setCourseId] = useState<string >("");
  const [phone, setPhone] = useState("");
  const [reference, setReference] = useState("");

  function handleSubmit() {
    startTransition(async () => {
      await createPaymentRequestAction({
        requestType,
        courseId: requestType === "course" ? courseId : null,
        phoneNumber: phone,
        paymentReference: reference,
      });
      setDone(true);
    });
  }

  if (done) {
    return <p className="text-center py-8">{t("requestSubmitted")}</p>;
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto p-6">
      <h1 className="text-xl font-semibold">{t("requestTitle")}</h1>

      <div>
        <Label>{t("requestTypeLabel")}</Label>
        <Select
          value={requestType}
          onValueChange={(v) => setRequestType(v as "course" | "subscription")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="course">{t("requestTypeCourse")}</SelectItem>
            <SelectItem value="subscription">
              {t("requestTypeSubscription")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {requestType === "course" && (
        <div>
          <Label>{t("courseLabel")}</Label>
          <Select
            value={courseId}
            onValueChange={(value) => setCourseId(value ?? "")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>{t("phoneLabel")}</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("phonePlaceholder")}
          dir="ltr"
        />
      </div>

      <div>
        <Label>{t("referenceLabel")}</Label>
        <Textarea
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder={t("referencePlaceholder")}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={
          isPending ||
          !phone ||
          !reference ||
          (requestType === "course" && !courseId)
        }
        className="w-full"
      >
        {t("submitRequest")}
      </Button>
    </div>
  );
}
