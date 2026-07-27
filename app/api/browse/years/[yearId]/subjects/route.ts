import { NextResponse } from "next/server";
import { getSubjectsByYear } from "@/lib/queries/browse";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ yearId: string }> }
) {
  const { yearId } = await params;

  try {
    const subjects = await getSubjectsByYear(yearId);
    return NextResponse.json({ subjects });
  } catch (error) {
    console.error("GET /api/browse/years/[yearId]/subjects failed:", error);
    return NextResponse.json({ error: "load_failed" }, { status: 500 });
  }
}
