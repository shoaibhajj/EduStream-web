import { NextRequest, NextResponse } from "next/server";
import { requireApprovedTeacher } from "@/lib/access/guards";
import {
  getDailymotionAccessToken,
  getDailymotionVideoStatus,
  uploadFileToDailymotion,
} from "@/lib/providers/dailymotion/normalize";

export async function POST(request: NextRequest) {
  try {
    const actor = await requireApprovedTeacher();

    if (!actor.clerkUserId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "no_file" }, { status: 400 });
    }

    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json({ error: "file_too_large" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const accessToken = await getDailymotionAccessToken();

    const uploaded = await uploadFileToDailymotion(
      buffer,
      file.name,
      file.type || "video/mp4",
      accessToken
    );

    const status = await getDailymotionVideoStatus(
      accessToken,
      uploaded.videoId
    );

   return NextResponse.json({
     videoId: uploaded.videoId,
     privateId: uploaded.privateId ?? status.private_id ?? null,
     durationSeconds: uploaded.durationSeconds ?? null,
     ready: status.ready,
     status: status.status ?? null,
     encodingProgress: status.encoding_progress ?? null,
     publishingProgress: status.publishing_progress ?? null,
     statusCode: status.error_code ?? null,
     statusTitle: status.error_title ?? null,
     statusMessage: status.error_message ?? null,
   });
  } catch (err) {
    console.error("[api/dailymotion/upload] upload failed", err);

    return NextResponse.json(
      {
        error: "upload_failed",
        detail: err instanceof Error ? err.message : "unknown_error",
      },
      { status: 500 }
    );
  }
}
