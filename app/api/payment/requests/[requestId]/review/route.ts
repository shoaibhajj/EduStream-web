import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  approvePaymentRequest,
  rejectPaymentRequest,
} from "@/lib/mutations/payment";
import { requireAdmin } from "@/lib/access/guards";
export async function POST(
  request: Request,
  context: { params: Promise<{ requestId: string }> }
) {
  const actor = await requireAdmin();
  const { requestId } = await context.params;
  try {
 
    if (!actor.clerkUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId: actor.clerkUserId },
    });
    if (profile?.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { action, adminNote } = body as {
      action: "approve" | "reject";
      adminNote?: string;
    };

    if (action === "approve")
      await approvePaymentRequest(requestId, adminNote);
    else if (action === "reject")
      await rejectPaymentRequest(requestId, adminNote);
    else return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/payment/requests/review]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
