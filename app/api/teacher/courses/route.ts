import { NextRequest, NextResponse } from "next/server";
import { getTeacherCourses } from "@/lib/queries/teacher";

export async function GET(request: NextRequest) {
  const teacherId = request.nextUrl.searchParams.get("teacherId");

  if (!teacherId) {
    return NextResponse.json(
      { error: "teacherId is required" },
      { status: 400 }
    );
  }

  try {
    const courses = await getTeacherCourses(teacherId);

    return NextResponse.json({
      courses,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load teacher courses" },
      { status: 500 }
    );
  }
}
