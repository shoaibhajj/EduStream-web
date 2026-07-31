import { NextResponse } from "next/server";
import { getStudentPaymentInstructions } from "@/lib/queries/payment";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherClerkId = searchParams.get("teacherClerkId") ?? undefined;
    const data = await getStudentPaymentInstructions(teacherClerkId);
    return NextResponse.json(data);
  } catch (e) {
    console.error("[api/payment/config]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
