import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApprovedTeacher } from "@/lib/access/guards";
import {
  getDailymotionAccessToken,
  getDailymotionVideoStatus,
} from "@/lib/providers/dailymotion/normalize";

export async function POST(request: NextRequest) {
  try {
    const actor = await requireApprovedTeacher();
    if (!actor.clerkUserId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const lessonId = String(body.lessonId ?? "");

    if (!lessonId) {
      return NextResponse.json(
        { error: "lesson_id_required" },
        { status: 400 }
      );
    }

    const media = await prisma.lessonMedia.findUnique({
      where: { lessonId },
      select: {
        id: true,
        lessonId: true,
        provider: true,
        dailymotionVideoId: true,
        dailymotionPrivateId: true,
      },
    });

    if (
      !media ||
      media.provider !== "dailymotion" ||
      !media.dailymotionVideoId
    ) {
      return NextResponse.json(
        { error: "dailymotion_media_not_found" },
        { status: 404 }
      );
    }

    const accessToken = await getDailymotionAccessToken();
    const status = await getDailymotionVideoStatus(
      accessToken,
      media.dailymotionVideoId
    );

    await prisma.lessonMedia.update({
      where: { lessonId },
      data: {
        dailymotionPrivateId:
          media.dailymotionPrivateId ?? status.private_id ?? null,
        isReady: status.ready,
      },
    });

    return NextResponse.json({
      ok: true,
      ready: status.ready,
      status: status.status ?? null,
      encodingProgress: status.encoding_progress ?? null,
      publishingProgress: status.publishing_progress ?? null,
      privateId: status.private_id ?? media.dailymotionPrivateId ?? null,
      statusCode: status.error_code ?? null,
      statusTitle: status.error_title ?? null,
      statusMessage: status.error_message ?? null,
    });
  } catch (err) {
    console.error("[api/dailymotion/status] failed", err);
    return NextResponse.json(
      {
        error: "status_check_failed",
        detail: err instanceof Error ? err.message : "unknown_error",
      },
      { status: 500 }
    );
  }
}
