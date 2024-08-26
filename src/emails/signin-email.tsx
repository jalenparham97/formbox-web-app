import { COMPANY_NAME } from "@/utils/constants";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface SignInEmailProps {
  email?: string;
  link?: string;
  logoImageBaseUrl?: string;
}

export default function SignInEmailTemplate({
  email = "bukinoshita@example.com",
  link = "http://localhost:3000/api/auth/callback/email?callbackUrl=http%3A%2F%2Flocalhost%3A3000&token=3862779cce10af2342b11eb5d5957ceb6797645a41c329c5200f31c2b741a32d&email=jalenparham97%40gmail.com",
  logoImageBaseUrl = `https://pub-0d5128ccf1c14b249f89e752003a6e37.r2.dev/formbox-logo.png`,
}: SignInEmailProps) {
  const previewText = `Sign in to Formbox`;

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
              Sign in
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black"></Text>
            <Section>
              <Text className="text-base text-black">
                Hi <strong>{email}</strong>,
              </Text>
              <Text className="text-base text-black">
                We received a request to sign in {COMPANY_NAME}. To complete the
                sign in process, please click the button below.
              </Text>
            </Section>
            <Section className="mb-[20px] mt-[20px]">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Sign in to Formbox
              </Button>
            </Section>

            <Section>
              <Text className="text-base text-black">
                Or copy and paste this URL into a new tab of your browser:
              </Text>

              <Text className="max-w-[500px] break-words text-sm text-black">
                <Link href={link} className="text-blue-600 no-underline">
                  {link}
                </Link>
              </Text>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              If you did not request this email, you can safely ignore it.
            </Text>
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              © {new Date().getFullYear()} {COMPANY_NAME} · MI, USA
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
