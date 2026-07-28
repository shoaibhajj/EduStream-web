"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { setCoursePublishStateAction } from "@/actions/course";

type Props = {
  courseId: string;
  isPublished: boolean;
};

export function TogglePublishButton({ courseId, isPublished }: Props) {
  const t = useTranslations("TeacherDashboard");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={isPublished ? "outline" : "default"}
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await setCoursePublishStateAction({
            courseId,
            isPublished: !isPublished,
          });
          router.refresh();
        });
      }}
    >
      {isPublished ? t("moveToDraft") : t("publish")}
    </Button>
  );
}
