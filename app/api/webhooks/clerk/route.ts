import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import {
  upsertProfileFromClerk,
  deleteProfileByClerkId,
} from "@/lib/mutations/profile";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;
      const primaryEmail =
        email_addresses?.find((e) => e.id === evt.data.primary_email_address_id)
          ?.email_address ?? null;

      await upsertProfileFromClerk({
        clerkUserId: id,
        email: primaryEmail,
        displayName: [first_name, last_name].filter(Boolean).join(" ") || null,
        avatarUrl: image_url ?? null,
      });
    }

    if (evt.type === "user.deleted") {
      const { id } = evt.data;
      if (id) await deleteProfileByClerkId(id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[api/webhooks/clerk] Error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
