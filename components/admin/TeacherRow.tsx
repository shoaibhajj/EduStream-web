"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { approveTeacherAction, rejectTeacherAction } from "@/actions/profile";
import type { Profile } from "@/lib/generated/prisma";

export function TeacherRow({ profile }: { profile: Profile }) {
  const t = useTranslations("Admin.Teachers");

  return (
    <li className="flex items-center justify-between py-3 gap-4">
      <div>
        <p className="font-medium text-text-primary">
          {profile.displayName ?? profile.email ?? profile.clerkUserId}
        </p>
        <p className="text-xs text-text-muted">{profile.email}</p>
      </div>
      <div className="flex items-center gap-2">
        <ApprovalBadge status={profile.teacherApprovalStatus} />
        {profile.teacherApprovalStatus === "pending" && (
          <>
            <form action={approveTeacherAction.bind(null, profile.clerkUserId)}>
              <Button variant="default" size="sm" type="submit">
                {t("approve")}
              </Button>
            </form>
            <form action={rejectTeacherAction.bind(null, profile.clerkUserId)}>
              <Button variant="destructive" size="sm" type="submit">
                {t("reject")}
              </Button>
            </form>
          </>
        )}
      </div>
    </li>
  );
}

function ApprovalBadge({ status }: { status: string }) {
  const t = useTranslations("Admin.Teachers");
  const variantMap: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    approved: "default",
    pending: "secondary",
    rejected: "destructive",
    not_applicable: "outline",
  };
  return (
    <Badge variant={variantMap[status] ?? "outline"}>
      {t(`status.${status}`)}
    </Badge>
  );
}
