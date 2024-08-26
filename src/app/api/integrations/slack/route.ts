import { type NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { db } from "@/server/db";
import { createSlackMessage } from "@/libs/nango/integrations/slack";

// QStash will call this endpoint with the data it received earlier.
async function handler(req: NextRequest) {
  const body = await req.json();

  try {
    const integration = await db.integration.findFirst({
      where: { formId: body.formId, type: "slack" },
      select: {
        id: true,
        connectionId: true,
        slackChannelId: true,
        isEnabled: true,
        orgId: true,
        formId: true,
      },
    });

    if (!integration || !integration.connectionId) {
      return NextResponse.json(
        { success: true, message: "No Slack integration found" },
        { status: 200 },
      );
    }

    if (!integration.slackChannelId) {
      return NextResponse.json(
        {
          success: true,
          message: "Slack integration is not configured correctly",
        },
        { status: 200 },
      );
    }

    if (!integration.isEnabled) {
      return NextResponse.json(
        { success: true, message: "Slack integration is disabled" },
        { status: 200 },
      );
    }

    const { connectionId, slackChannelId, orgId } = integration;

    await createSlackMessage(connectionId, slackChannelId, {
      formId: body.formId,
      orgId,
      formName: body.formName,
      answers: body.data,
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
