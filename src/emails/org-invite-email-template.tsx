import { env } from "@/env";
import { COMPANY_NAME } from "@/utils/constants";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

type Props = {
  orgName: string;
  link?: string;
  logoImageBaseUrl?: string;
};

export default function OrgInviteEmailTemplate({
  orgName = "Vercel",
  link = "http://localhost:3000/api/auth/callback/email?callbackUrl=http%3A%2F%2Flocalhost%3A3000&token=3862779cce10af2342b11eb5d5957ceb6797645a41c329c5200f31c2b741a32d&email=jalenparham97%40gmail.com",
  logoImageBaseUrl = `https://pub-0d5128ccf1c14b249f89e752003a6e37.r2.dev/formbox-logo.png`,
}: Props) {
  return (
    <Html>
      <Head />
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
            <Section>
              <Text className="text-base text-black">
                You&apos;ve been invited to join the{" "}
                <span style={{ fontWeight: 600 }}>{orgName}</span> organization
                on {COMPANY_NAME}!
              </Text>
              <Text className="text-base text-black">
                You can use the button below to sign in to {COMPANY_NAME} and
                join the organization.
              </Text>
            </Section>
            <Section className="mb-[20px] mt-[20px]">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Join organization
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
