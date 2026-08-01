import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createPaymentRequest } from "@/lib/mutations/payment";
import { createPaymentRequestSchema } from "@/lib/validations/payment";
import { getStudentPaymentRequests } from "@/lib/queries/payment";
import { requireStudent } from "@/lib/access/guards";
export async function GET() {
  const actor = await requireStudent();
  try {
 
    if (!actor.clerkUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId: actor.clerkUserId },
    });
    if (!profile)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    const requests = await getStudentPaymentRequests(profile.id);
    return NextResponse.json(requests);
  } catch (e) {
    console.error("[api/payment/requests GET]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
    const actor = await requireStudent();
  try {
  
    if (!actor.clerkUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId: actor.clerkUserId },
    });
    if (!profile)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const body = await request.json();
    const parsed = createPaymentRequestSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const result = await createPaymentRequest({
      ...parsed.data,
      profileId: profile.id,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    console.error("[api/payment/requests POST]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
