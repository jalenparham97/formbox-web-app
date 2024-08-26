// This is a public API endpoint that will be invoked by QStash.
// It contains the logic for the background job and may take a long time to execute.

import { sendFormRespondentEmail } from "@/libs/mail";

export async function POST(request: Request) {
  const body = await request.json();

  const to = body.to as string;
  const fromName = body.fromName as string;
  const subject = body.subject as string;
  const html = body.html as string;

  const result = await sendFormRespondentEmail(fromName, to, subject, html);

  if (result.error) {
    console.error(result.error);
    return new Response("Error sending email", { status: 500 });
  }

  return new Response("Respondent email job started", { status: 200 });
}
