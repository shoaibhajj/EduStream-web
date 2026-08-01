import { NextResponse } from "next/server";
import { getTeacherCourses } from "@/lib/queries/teacher";
import { requireApprovedTeacher } from "@/lib/access/guards";

export async function GET() {
  try {
    const actor = await requireApprovedTeacher();

    const courses = await getTeacherCourses(actor.clerkUserId);

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("[api/teacher/courses] Error:", error);

    return NextResponse.json(
      { error: "Failed to load teacher courses" },
      { status: 500 }
    );
  }
}
