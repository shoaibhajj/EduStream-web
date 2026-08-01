"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type DeleteLessonButtonProps = {
  locale: string;
  courseId: string;
  lessonId: string;
  label: string;
  confirmMessage: string;
};

export function DeleteLessonButton({
  locale,
  courseId,
  lessonId,
  label,
  confirmMessage,
}: DeleteLessonButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `/api/teacher/courses/${courseId}/lessons/${lessonId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("DELETE_FAILED");
      }

      router.refresh();
    } catch (error) {
      console.error("[DeleteLessonButton] delete failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
      disabled={isSubmitting}
    >
      {label}
    </Button>
  );
}
