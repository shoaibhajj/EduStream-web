import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { createLessonSchema } from "@/lib/validations/lesson";
import { createLessonForTeacher } from "@/lib/mutations/lesson";

type Context = {
  params: Promise<{ courseId: string }>;
};

export async function POST(request: Request, { params }: Context) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;
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
    const lesson = await createLessonForTeacher(parsed.data, userId);
    return NextResponse.json({ data: lesson }, { status: 201 });
  } catch (error) {
    console.error("[api] create lesson", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
