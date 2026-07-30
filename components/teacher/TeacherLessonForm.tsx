"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { createLessonAction } from "@/actions/lesson";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  updateLessonAction } from "@/actions/lesson";
type Props = {
  courseId: string;
  mode?: "create" | "edit";
  lessonId?: string;
  defaultValues?: {
    titleAr: string;
    titleEn: string | null;
    description: string | null;
    sortOrder: number;
    isPreview: boolean;
    isPublished: boolean;
  };
};
export function TeacherLessonForm({
  courseId,
  mode = "create",
  lessonId,
  defaultValues,
}: Props) {
  const t = useTranslations("TeacherLessons");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          if (mode === "edit" && lessonId)
            formData.append("lessonId", lessonId);
          const result =
            mode === "edit"
              ? await updateLessonAction(formData)
              : await createLessonAction(formData);
          if (result?.error) setError(t("serverError"));
        });
      }}
    >
      <input type="hidden" name="courseId" value={courseId} />

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("titleAr")}</label>
        <Input defaultValue={defaultValues?.titleAr} name="titleAr" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("titleEn")}</label>
        <Input defaultValue={defaultValues?.titleEn ?? ""} name="titleEn" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("description")}</label>
        <Input
          defaultValue={defaultValues?.description ?? ""}
          name="description"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("sortOrder")}</label>
        <Input
          defaultValue={defaultValues?.sortOrder ?? 0}
          name="sortOrder"
          type="number"
          min={0}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("isPreview")}</label>
        <select
          name="isPreview"
          defaultValue={defaultValues?.isPreview.toString() ?? "false"}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          <option value="false">{t("no")}</option>
          <option value="true">{t("yes")}</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("isPublished")}</label>
        <select
          name="isPublished"
          defaultValue={defaultValues?.isPublished.toString() ?? "true"}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          <option value="true">{t("yes")}</option>
          <option value="false">{t("no")}</option>
        </select>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={isPending}>
        {isPending
          ? t("saving")
          : mode === "edit"
          ? t("editLessonNow")
          : t("create")}
      </Button>
    </form>
  );
}
