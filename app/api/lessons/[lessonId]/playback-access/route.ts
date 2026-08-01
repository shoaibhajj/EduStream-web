import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/access/guards";
import { resolvePlaybackAccess } from "@/lib/queries/media";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;
    // getCurrentProfile returns null for unauthenticated — correct for preview lessons
    const profile = await getCurrentProfile();
    const result = await resolvePlaybackAccess(profile, lessonId);

    return NextResponse.json(result, {
      status: result.allowed
        ? 200
        : result.reason === "unauthenticated"
        ? 401
        : 403,
    });
  } catch (error) {
    console.error("[api/lessons/playback-access] Error:", error);
    return NextResponse.json(
      { allowed: false, reason: "server_error" },
      { status: 500 }
    );
  }
}
