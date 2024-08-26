import OrgInviteEmailTemplate from "@/emails/org-invite-email-template-v2";
import SignInEmailTemplate from "@/emails/signin-email-v2";
import VerifyEmailTemplate from "@/emails/verify-email-template-v2";
import WelcomeEmailTemplate from "@/emails/welcome-email-template";
import { env } from "@/env";
import type { Answer } from "@prisma/client";
import { renderAsync } from "@react-email/components";
import { Resend } from "resend";

export const resend = new Resend(env.RESEND_API_KEY);

const emailFrom = `Formbox <${env.EMAIL_FROM}>`;

export async function sendMagicLink(email: string, link: string) {
  const text = await renderAsync(
    <SignInEmailTemplate email={email} link={link} />,
    {
      plainText: true,
    },
  );

  return await resend.emails.send({
    subject: "Sign in to Formbox",
    from: `Formbox Accounts <accounts@formbox.app>`,
    to: email,
    text,
    react: <SignInEmailTemplate email={email} link={link} />,
  });
}

export async function sendWelcomeEmail(email: string) {
  const text = await renderAsync(<WelcomeEmailTemplate />, {
    plainText: true,
  });

  return await resend.emails.send({
    subject: "Welcome to Formbox",
    from: `Formbox Team <team@formbox.app>`,
    to: email,
    text,
    react: <WelcomeEmailTemplate />,
  });
}

export async function sendVerifyEmail(email: string, link: string) {
  const text = await renderAsync(
    <VerifyEmailTemplate email={email} link={link} />,
    {
      plainText: true,
    },
  );

  return await resend.emails.send({
    subject: "Verify your email address",
    from: `Formbox Accounts <accounts@formbox.app>`,
    to: email,
    text,
    react: <VerifyEmailTemplate email={email} link={link} />,
  });
}

export async function sendOrgInviteEmail(
  email: string,
  orgName: string,
  link: string,
) {
  const text = await renderAsync(
    <OrgInviteEmailTemplate orgName={orgName} link={link} />,
    {
      plainText: true,
    },
  );

  return await resend.emails.send({
    subject: "You've been invited to join an organization on Formbox",
    from: `Formbox Invites <accounts@formbox.app>`,
    to: email,
    text,
    react: <OrgInviteEmailTemplate orgName={orgName} link={link} />,
  });
}

type SubmissionNotificationEmailPayload = {
  to: string;
  subject: string;
  text: string;
  react: JSX.Element;
};

export async function sendBatchSubmissionNotificationEmail(
  payload: SubmissionNotificationEmailPayload[],
) {
  const emails = payload.map((email) => {
    return {
      ...email,
      from: emailFrom,
    };
  });
  return await resend.batch.send(emails);
}

export async function sendFormRespondentEmail(
  fromName: string,
  to: string,
  subject: string,
  html: string,
) {
  return await resend.emails.send({
    from: `${fromName} <${env.EMAIL_FROM}>`,
    subject,
    to,
    html,
  });
}

function injectTemplateValues(answers: Answer[], html: string) {
  let newHtml = html;
  answers.forEach((answer) => {
    newHtml = newHtml.replace(`{{${answer.label}}}`, answer.value);
  });
  return newHtml;
}
