import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile, requireAuthenticatedProfile } from "@/lib/access/guards";
import { canAccessLesson } from "@/lib/access/playback";
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  const actor = await requireAuthenticatedProfile();
  try {
 

    if (!actor) {
      return NextResponse.json(
        { allowed: false, reason: "unauthenticated" },
        { status: 401 }
      );
    }

    const { lessonId } = await context.params;
    const result = await canAccessLesson(actor, lessonId);

    return NextResponse.json(result, {
      status: result.allowed ? 200 : 403,
    });
  } catch (error) {
    console.error("[api/lessons/access] Error:", error);

    return NextResponse.json(
      { allowed: false, reason: "server_error" },
      { status: 500 }
    );
  }
}
