import { NextRequest, NextResponse } from "next/server";
import { getCourseDetail } from "@/lib/queries/course";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const course = await getCourseDetail(courseId);
    if (!course) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ course });
  } catch (error) {
    console.error("[api/courses/courseId] GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
