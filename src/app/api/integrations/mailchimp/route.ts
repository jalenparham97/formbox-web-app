import { type NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { db } from "@/server/db";
import { addMemberToList } from "@/libs/nango/integrations/mailchimp";

function getFullName(data: Record<string, string>) {
  if (data.fullName) {
    const fullName = data.fullName.split(" ");
    return {
      firstName: fullName[0] || "",
      lastName: fullName[1] || "",
    };
  }

  if (data.name) {
    const name = data.name.split(" ");
    return {
      firstName: name[0] || "",
      lastName: name[1] || "",
    };
  }

  return {
    firstName: data.firstName || "",
    lastName: data.lastName || "",
  };
}

// QStash will call this endpoint with the data it received earlier.
async function handler(req: NextRequest) {
  const body = await req.json();

  try {
    const integration = await db.integration.findFirst({
      where: { formId: body.formId, type: "mailchimp" },
      select: {
        id: true,
        connectionId: true,
        mailchimpDC: true,
        mailchimpListId: true,
        isEnabled: true,
      },
    });

    if (!integration || !integration.connectionId) {
      return NextResponse.json(
        { success: true, message: "No Mailchimp integration found" },
        { status: 200 },
      );
    }

    if (!integration.mailchimpDC || !integration.mailchimpListId) {
      return NextResponse.json(
        {
          success: true,
          message: "Mailchimp integration is not configured correctly",
        },
        { status: 200 },
      );
    }

    if (!integration.isEnabled) {
      return NextResponse.json(
        { success: true, message: "Mailchimp integration is disabled" },
        { status: 200 },
      );
    }

    const { connectionId, mailchimpDC, mailchimpListId } = integration;

    const name = getFullName(body.data);

    await addMemberToList(
      connectionId,
      mailchimpDC,
      mailchimpListId,
      body.data.email,
      {
        FNAME: name.firstName,
        LNAME: name.lastName,
        ADDRESS: {
          addr1: body.data.addr1 || "",
          city: body.data.city || "",
          state: body.data.state || "",
          zip: body.data.zip || "",
        },
      },
    );

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
