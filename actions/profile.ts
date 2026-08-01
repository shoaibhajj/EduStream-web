"use server";

import { requireAdmin } from "@/lib/access/guards";
import {
  approveTeacher,
  rejectTeacher,
  setProfileRole,
} from "@/lib/mutations/profile";
import { AppRole } from "@/lib/generated/prisma";
import { revalidatePath } from "next/cache";

export async function approveTeacherAction(clerkUserId: string) {
  await requireAdmin();
  await approveTeacher(clerkUserId);
  revalidatePath("/[locale]/(admin)/admin/teachers", "page");
}

export async function rejectTeacherAction(clerkUserId: string) {
  await requireAdmin();
  await rejectTeacher(clerkUserId);
  revalidatePath("/[locale]/(admin)/admin/teachers", "page");
}

export async function setProfileRoleAction(clerkUserId: string, role: AppRole) {
  await requireAdmin();
  await setProfileRole(clerkUserId, role);
  revalidatePath("/[locale]/(admin)/admin/teachers", "page");
}
