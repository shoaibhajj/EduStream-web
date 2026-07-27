import { NextResponse } from "next/server";
import { getPublishedCoursesBySubject } from "@/lib/queries/browse";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  const { subjectId } = await params;

  try {
    const courses = await getPublishedCoursesBySubject(subjectId);
    return NextResponse.json({ courses });
  } catch (error) {
    console.error(
      "GET /api/browse/subjects/[subjectId]/courses failed:",
      error
    );
    return NextResponse.json({ error: "load_failed" }, { status: 500 });
  }
}
