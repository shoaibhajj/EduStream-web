import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { saveExternalLinkMedia } from "@/lib/mutations/media";
import { requireApprovedTeacher } from "@/lib/access/guards";
type Context = {
  params: Promise<{ lessonId: string }>;
};

export async function POST(request: Request, { params }: Context) {
  const actor = await requireApprovedTeacher();

  if (!actor.clerkUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { lessonId } = await params;
  const body = await request.json();

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      course: { teacherId: actor.clerkUserId },
    },
    select: { id: true },
  });

  if (!lesson) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (!body.externalUrl) {
    return NextResponse.json({ error: "validation_failed" }, { status: 400 });
  }

  try {
    const media = await saveExternalLinkMedia({
      lessonId,
      externalUrl: body.externalUrl,
    });

    return NextResponse.json({ data: media }, { status: 201 });
  } catch (error) {
    console.error("[api] save external media", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
