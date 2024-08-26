import { type NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { db } from "@/server/db";
import { qstash } from "@/libs/upstash";
import { env } from "@/env";

// QStash will call this endpoint with the data it received earlier.
async function handler(req: NextRequest) {
  const body = await req.json();

  try {
    const integrations = await db.integration.findMany({
      where: { formId: body.formId },
    });

    if (integrations.length === 0) {
      return NextResponse.json(
        { success: true, message: "No integrations found" },
        { status: 200 },
      );
    }

    const batch = integrations
      .filter((integration) => integration.isEnabled)
      .map((integration) => ({
        url: `${env.APP_URL}/api/integrations/${integration.type}`,
        body: body,
      }));

    await qstash.batchJSON(batch);

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
