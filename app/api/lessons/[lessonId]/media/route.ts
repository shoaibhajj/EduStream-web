import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProtectedPlaybackUrl } from "@/lib/queries/media";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO Feature 10: add enrollment/access check here before returning URL
  const { lessonId } = await params;
  const playback = await getProtectedPlaybackUrl(lessonId);
  if (!playback) {
    return NextResponse.json({ error: "No media available" }, { status: 404 });
  }

  return NextResponse.json(playback);
}
