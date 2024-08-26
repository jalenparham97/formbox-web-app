import { type NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { db } from "@/server/db";
import { qstash } from "@/libs/upstash";

// QStash will call this endpoint with the data it received earlier.
async function handler(req: NextRequest) {
  const data = await req.json();

  try {
    const integration = await db.integration.findFirst({
      where: { formId: data.formId, type: "webhook" },
      select: {
        id: true,
        webhookUrl: true,
        isEnabled: true,
      },
    });

    if (!integration || !integration.webhookUrl) {
      return NextResponse.json(
        { success: true, message: "No Webhook integration found" },
        { status: 200 },
      );
    }

    if (!integration.isEnabled) {
      return NextResponse.json(
        { success: true, message: "Webhook integration is disabled" },
        { status: 200 },
      );
    }

    await qstash.publishJSON({
      url: integration.webhookUrl,
      body: data,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("ERROR: ", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// It is very important to add this line as this makes
// sure that only QStash can successfully call this endpoint.
// It will make use of the QSTASH_CURRENT_SIGNING_KEY and
// QSTASH_NEXT_SIGNING_KEY from your .env file.
export const POST = verifySignatureAppRouter(handler);
// export const POST = handler;
