import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

import { createLessonSchema } from "@/lib/validations/lesson";
import {
  deleteLessonForTeacher,
  updateLessonForTeacher,
} from "@/lib/mutations/lesson";

type Context = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export async function GET(_: Request, { params }: Context) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { courseId, lessonId } = await params;

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      courseId,
      course: { teacherId: userId },
    },
    include: { media: true },
  });

  if (!lesson) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ data: lesson });
}

export async function PATCH(request: Request, { params }: Context) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { courseId, lessonId } = await params;
  const body = await request.json();

  const parsed = createLessonSchema.safeParse({
    courseId,
    titleAr: body.titleAr,
    titleEn: body.titleEn,
    description: body.description,
    isPreview: body.isPreview,
    isPublished: body.isPublished,
    sortOrder: body.sortOrder,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const lesson = await updateLessonForTeacher(
      lessonId,
      courseId,
      userId,
      parsed.data
    );
    return NextResponse.json({ data: lesson });
  } catch (error) {
    console.error("[api] update lesson", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Context) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { courseId, lessonId } = await params;

  try {
    await deleteLessonForTeacher(lessonId, courseId, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api] delete lesson", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
