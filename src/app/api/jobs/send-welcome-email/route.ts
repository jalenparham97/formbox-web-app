// This is a public API endpoint that will be invoked by QStash.
// It contains the logic for the background job and may take a long time to execute.

import { sendFormRespondentEmail, sendWelcomeEmail } from "@/libs/mail";

export async function POST(request: Request) {
  const body = await request.json();

  const result = await sendWelcomeEmail(body.email);

  if (result.error) {
    console.error(result.error);
    return new Response("Error sending email", { status: 500 });
  }

  return new Response("Welcome email job started", { status: 200 });
}
