import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { deleteLessonMedia } from "@/lib/mutations/media";
import { getProtectedPlaybackUrl } from "@/lib/queries/media";

type Context = {
  params: Promise<{ lessonId: string }>;
};

export async function GET(_: Request, { params }: Context) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { lessonId } = await params;

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      course: { teacherId: userId },
    },
    include: { media: true },
  });

  if (!lesson) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const preview = lesson.media ? await getProtectedPlaybackUrl(lessonId) : null;

  return NextResponse.json({
    data: {
      media: lesson.media,
      preview,
    },
  });
}

export async function DELETE(_: Request, { params }: Context) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { lessonId } = await params;

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      course: { teacherId: userId },
    },
    select: { id: true },
  });

  if (!lesson) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  try {
    await deleteLessonMedia(lessonId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api] delete lesson media", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
