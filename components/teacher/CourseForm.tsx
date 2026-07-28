"use client";

import { useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createCourseAction, updateCourseAction } from "@/actions/course";
import {
  courseFormSchema,
  type CourseFormInput,
  type CourseFormValues,
} from "@/lib/validations/course";

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

type SubjectOption = {
  id: string;
  nameAr: string;
  nameEn: string | null;
  academicYear: {
    id: string;
    nameAr: string;
    nameEn: string | null;
  };
};

type CourseFormProps = {
  mode: "create" | "edit";
  courseId?: string;
  subjects: SubjectOption[];
  defaultValues?: CourseFormInput;
};

export function CourseForm({
  mode,
  courseId,
  subjects,
  defaultValues,
}: CourseFormProps) {
  const t = useTranslations("TeacherDashboard");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

 const form = useForm<CourseFormInput, unknown, CourseFormValues>({
   resolver: zodResolver(courseFormSchema),
   defaultValues: defaultValues ?? {
     subjectId: "",
     nameAr: "",
     nameEn: "",
     descriptionAr: "",
     descriptionEn: "",
     price: 0,
   },
 });

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form;

  const submitLabel = mode === "create" ? t("form.create") : t("form.update");

const onSubmit = handleSubmit((values) => {
  const formData = new FormData();
  formData.set("subjectId", values.subjectId);
  formData.set("nameAr", values.nameAr);
  formData.set("nameEn", values.nameEn ?? "");
  formData.set("descriptionAr", values.descriptionAr ?? "");
  formData.set("descriptionEn", values.descriptionEn ?? "");
  formData.set("price", String(values.price ?? 0));
  formData.set("locale", locale);

  if (mode === "edit" && courseId) {
    formData.set("courseId", courseId);
  }

  startTransition(async () => {
    const result =
      mode === "create"
        ? await createCourseAction(formData)
        : await updateCourseAction(formData);

    if (!result.success) {
      if (result.error === "VALIDATION_ERROR" && result.fieldErrors) {
        const fieldErrors = result.fieldErrors as Record<
          string,
          string[] | undefined
        >;

        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (!messages?.length) return;

          setError(field as keyof CourseFormInput, {
            type: "server",
            message: messages[0],
          });
        });
        return;
      }

      setError("root", {
        type: "server",
        message: t("form.serverError"),
      });
    }
  });
});

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nameAr">{t("form.nameAr")}</Label>
        <Input id="nameAr" dir="rtl" {...register("nameAr")} />
        {errors.nameAr ? (
          <p className="text-sm text-destructive">{errors.nameAr.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="nameEn">{t("form.nameEn")}</Label>
        <Input id="nameEn" dir="ltr" {...register("nameEn")} />
        {errors.nameEn ? (
          <p className="text-sm text-destructive">{errors.nameEn.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionAr">{t("form.descriptionAr")}</Label>
        <Textarea
          id="descriptionAr"
          dir="rtl"
          rows={4}
          {...register("descriptionAr")}
        />
        {errors.descriptionAr ? (
          <p className="text-sm text-destructive">
            {errors.descriptionAr.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionEn">{t("form.descriptionEn")}</Label>
        <Textarea
          id="descriptionEn"
          dir="ltr"
          rows={4}
          {...register("descriptionEn")}
        />
        {errors.descriptionEn ? (
          <p className="text-sm text-destructive">
            {errors.descriptionEn.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>{t("form.subject")}</Label>
        <Controller
          control={control}
          name="subjectId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={t("form.selectSubject")} />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {locale === "ar"
                      ? `${subject.academicYear.nameAr} — ${subject.nameAr}`
                      : `${
                          subject.academicYear.nameEn ??
                          subject.academicYear.nameAr
                        } — ${subject.nameEn ?? subject.nameAr}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.subjectId ? (
          <p className="text-sm text-destructive">{errors.subjectId.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">{t("form.price")}</Label>
        <Input
          id="price"
          type="number"
          min={0}
          inputMode="numeric"
          dir="ltr"
          {...register("price", { valueAsNumber: true })}
        />
        <p className="text-xs text-text-secondary">{t("form.priceHint")}</p>
        {errors.price ? (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        ) : null}
      </div>

      {errors.root ? (
        <p className="text-sm text-destructive">{errors.root.message}</p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? t("form.saving") : submitLabel}
      </Button>
    </form>
  );
}
