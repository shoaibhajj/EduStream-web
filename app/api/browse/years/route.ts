import { NextResponse } from "next/server";
import { getActiveAcademicYears } from "@/lib/queries/browse";

export async function GET() {
  try {
    const years = await getActiveAcademicYears();
    return NextResponse.json({ years });
  } catch (error) {
    console.error("GET /api/browse/years failed:", error);
    return NextResponse.json({ error: "load_failed" }, { status: 500 });
  }
}
