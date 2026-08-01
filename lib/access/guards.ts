import { auth } from "@clerk/nextjs/server";
import { getProfileByClerkId } from "@/lib/queries/profile";
import { isAdmin, isApprovedTeacher, isStudent } from "./roles";
import type { Profile } from "@/lib/generated/prisma";

/**
 * Resolves the current Clerk user's DB profile.
 * Returns null if not signed in or profile not yet synced.
 * Use in Server Components, Server Actions, and Route Handlers.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const { userId } = await auth();
  if (!userId) return null;
  return getProfileByClerkId(userId);
}

/** Throws if the current user is not an admin. Use in Server Actions and Route Handlers. */
export async function requireAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || !isAdmin(profile)) {
    throw new Error("UNAUTHORIZED: admin role required");
  }
  return profile;
}

/** Throws if the current user is not an approved teacher or admin. */
export async function requireApprovedTeacher(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || (!isApprovedTeacher(profile) && !isAdmin(profile))) {
    throw new Error("UNAUTHORIZED: approved teacher role required");
  }
  return profile;
}

export async function requireAuthenticatedProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();

  if (!profile) {
    throw new Error("UNAUTHORIZED: authenticated profile required");
  }

  return profile;
}

export async function requireStudent(): Promise<Profile> {
  const profile = await requireAuthenticatedProfile();

  if (!isStudent(profile) && !isAdmin(profile)) {
    throw new Error("UNAUTHORIZED: student role required");
  }

  return profile;
}