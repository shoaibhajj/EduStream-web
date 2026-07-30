import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateSignedUploadParams } from "@/lib/cloudinary";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = generateSignedUploadParams("moallem-academy/lessons");
  return NextResponse.json(params);
}
