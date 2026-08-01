import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateSignedUploadParams } from "@/lib/cloudinary";
import { requireApprovedTeacher } from "@/lib/access/guards";
export async function GET() {
  const actor = await requireApprovedTeacher();

  if (!actor.clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = generateSignedUploadParams("moallem-academy/lessons");
  return NextResponse.json(params);
}
