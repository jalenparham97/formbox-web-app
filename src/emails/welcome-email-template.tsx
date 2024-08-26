import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";
import { FooterCenter } from "./components/footer";
import { Header } from "./components/header";
import {
  wrapper,
  button,
  container,
  text,
  h1,
  h2,
  h4,
  link,
  hr,
} from "./components/sharedStyles";

interface WelcomeEmailProps {
  logoImg?: string;
}

const baseUrl = "https://www.fireball.email/fireball-assets/";

export const WelcomeEmailTemplate = ({}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome</Preview>
      <Tailwind>
        <Body style={wrapper}>
          <Container style={wrapper}>
            <Container style={container}>
              <Header />
              <Section className="px-6 pb-5 pt-10" align="center">
                <Heading style={h1} className="text-center">
                  Welcome to Formbox
                </Heading>
                <Text style={text} className="text-center">
                  We&apos;re excited to have you on board. Here are some tips to
                  help you get started quickly:
                </Text>
                <Button
                  style={button}
                  href={"https://app.formbox.app/organizations"}
                  className="mt-6 block"
                >
                  Get started
                </Button>
              </Section>
              <Hr style={hr} />
              <Section className="px-6 pb-10">
                <Heading style={h2}>Tips for getting started</Heading>
                <Row className="mt-8">
                  <Column className="w-16 align-top">
                    <Img
                      src={`${baseUrl}/play.png`}
                      className="mt-2"
                      width="100%"
                      height="auto"
                      alt=""
                    />
                  </Column>
                  <Column className="py-2 pl-5">
                    <Heading style={h4}>Quick start</Heading>
                    <p style={text} className="my-1">
                      Follow our quick start guide to get up and running with
                      your first form in no time.
                    </p>
                    <Link
                      href="https://docs.formbox.app/introduction"
                      style={link}
                    >
                      Create your first form
                    </Link>
                  </Column>
                </Row>
                <Row className="my-4">
                  <Column className="w-16 align-top">
                    <Img
                      src={`${baseUrl}/help.png`}
                      className="mt-2"
                      width="100%"
                      height="auto"
                      alt=""
                    />
                  </Column>
                  <Column className="py-2 pl-5">
                    <Heading style={h4}>Need help?</Heading>
                    <p style={text} className="my-1">
                      Our support team is here to assist you with any questions
                      you might have.
                    </p>
                    <Link href="https://formbox.app/contact" style={link}>
                      Help and contact
                    </Link>
                  </Column>
                </Row>
                <Row className="my-4">
                  <Column className="w-16 align-top">
                    <Img
                      src={`${baseUrl}/docs.png`}
                      className="mt-2"
                      width="100%"
                      height="auto"
                      alt=""
                    />
                  </Column>
                  <Column className="py-2 pl-5">
                    <Heading style={h4}>Docs</Heading>
                    <p style={text} className="my-1">
                      Access our comprehensive documentation to explore all
                      features and capabilities.
                    </p>
                    <Link href="https://docs.formbox.app" style={link}>
                      Documentation
                    </Link>
                  </Column>
                </Row>
              </Section>
              <FooterCenter />
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmailTemplate;
