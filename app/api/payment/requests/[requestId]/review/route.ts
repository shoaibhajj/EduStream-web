import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  approvePaymentRequest,
  rejectPaymentRequest,
} from "@/lib/mutations/payment";

export async function POST(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId: userId },
    });
    if (profile?.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { action, adminNote } = body as {
      action: "approve" | "reject";
      adminNote?: string;
    };

    if (action === "approve")
      await approvePaymentRequest(params.requestId, adminNote);
    else if (action === "reject")
      await rejectPaymentRequest(params.requestId, adminNote);
    else return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/payment/requests/review]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
