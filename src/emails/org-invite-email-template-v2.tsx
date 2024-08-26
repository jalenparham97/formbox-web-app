import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";
import { FooterCenter } from "./components/footer";
import { Header } from "./components/header";
import {
  wrapper,
  container,
  button,
  text,
  h1,
} from "./components/sharedStyles";
import { COMPANY_NAME } from "@/utils/constants";

type Props = {
  orgName: string;
  link?: string;
};

const OrgInviteEmailTemplate = ({
  orgName = "Some Company",
  link = "http://localhost:3000/api/auth/callback/email?callbackUrl=http%3A%2F%2Flocalhost%3A3000&token=3862779cce10af2342b11eb5d5957ceb6797645a41c329c5200f31c2b741a32d&email=jalenparham97%40gmail.com",
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Invitation</Preview>
      <Tailwind>
        <Body style={wrapper}>
          <Container style={wrapper}>
            <Container style={container}>
              <Header />
              <Section className="px-6 py-10">
                <Heading style={{ ...h1 }}>Invitation</Heading>
                <Text style={text} className="pb-4">
                  You&apos;ve been invited to join the{" "}
                  <span style={{ fontWeight: 600, color: "black" }}>
                    {orgName}
                  </span>{" "}
                  organization on {COMPANY_NAME}!
                </Text>
                <Button style={button} href={link}>
                  Join organization
                </Button>

                <Text style={text} className="pt-4">
                  Or copy and paste this URL into a new tab of your browser:
                </Text>
                <Text className="max-w-[500px] break-words text-sm text-black">
                  <Link href={link} className="text-blue-600 no-underline">
                    {link}
                  </Link>
                </Text>
              </Section>
              <FooterCenter />
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

OrgInviteEmailTemplate.PreviewProps = {};

export default OrgInviteEmailTemplate;
