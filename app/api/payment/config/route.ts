import { NextResponse } from "next/server";
import { getStudentPaymentInstructions } from "@/lib/queries/payment";
import { requireAdmin } from "@/lib/access/guards";
export async function GET(request: Request) {
  const actor = await requireAdmin();
  try {
    const data = await getStudentPaymentInstructions(actor.clerkUserId);
    return NextResponse.json(data);
  } catch (e) {
    console.error("[api/payment/config]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
