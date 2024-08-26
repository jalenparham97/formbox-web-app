import { COMPANY_NAME } from "@/utils/constants";
import { type Answer } from "@prisma/client";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface SubmissionEmailTemplateProps {
  formName?: string;
  formLink?: string;
  answers?: Answer[];
  logoImageBaseUrl?: string;
}

export default function SubmissionEmailTemplate({
  formName = "Formbox",
  formLink = "http://localhost:3000/organizations",
  answers = [
    { label: "What is your name?", value: "Jalen", id: "csdwdcwqdc" } as Answer,
  ],
  logoImageBaseUrl = `https://pub-0d5128ccf1c14b249f89e752003a6e37.r2.dev/formbox-logo.png`,
}: SubmissionEmailTemplateProps) {
  const previewText = `New submission for ${formName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[500px] rounded border border-solid border-[#eaeaea] px-10 py-5">
            <Section className="">
              <Img
                src={`${logoImageBaseUrl}`}
                width="180px"
                height="30px"
                alt="Formbox Logo"
                className="my-5"
              />
            </Section>
            <Heading className="mx-0 my-[20px] p-0 text-[20px] font-normal text-black">
              New submission for <strong>{formName}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black"></Text>
            <Section>
              {answers.map((answer) => (
                <div key={answer.id}>
                  <Text className="text-[16px]">
                    <strong>{answer.label}</strong>
                  </Text>
                  <Text className="text-[16px]">{answer.value}</Text>
                </div>
              ))}
            </Section>
            <Section className="mb-[32px] mt-[20px]">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={formLink}
              >
                View submission
              </Button>
            </Section>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              © {new Date().getFullYear()} {COMPANY_NAME} · MI, USA
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
