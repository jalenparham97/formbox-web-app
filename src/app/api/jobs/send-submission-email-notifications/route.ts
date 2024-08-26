// This is a public API endpoint that will be invoked by QStash.
// It contains the logic for the background job and may take a long time to execute.

import SubmissionEmailTemplate from "@/emails/submission-email-template-v2";
import { sendBatchSubmissionNotificationEmail } from "@/libs/mail";
import { type Answer } from "@prisma/client";
import { render } from "@react-email/components";

export async function POST(request: Request) {
  const body = await request.json();

  const formName = body.formName as string;
  const formLink = body.formLink as string;
  const emailsToNotify = body.emailsToNotify as string[];
  const answers = body.answers as Answer[];

  // Send emails to the users
  const payload = emailsToNotify.map((email) => {
    const reactElement = SubmissionEmailTemplate({
      formName,
      formLink,
      answers,
    });

    const text = render(reactElement, { plainText: true });

    return {
      to: email,
      subject: `New submission for ${formName}`,
      text,
      react: reactElement,
    };
  });

  const result = await sendBatchSubmissionNotificationEmail(payload);

  if (result.error) {
    console.error(result.error);
    return new Response("Error sending email", { status: 500 });
  }

  return new Response("Submission email job started", { status: 200 });
}
