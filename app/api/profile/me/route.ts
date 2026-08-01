import { NextResponse } from "next/server";
import { getCurrentProfile, requireAuthenticatedProfile } from "@/lib/access/guards";

/** Mobile: get the current user's DB profile. */
export async function GET() {
 const actor = await requireAuthenticatedProfile();
  if (!actor) {
    return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
  }
  return NextResponse.json({ actor });
}
