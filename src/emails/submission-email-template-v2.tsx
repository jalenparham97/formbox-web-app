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
import { type Answer } from "@prisma/client";

interface Props {
  formName?: string;
  formLink?: string;
  answers?: Answer[];
}

const SubmissionEmailTemplate = ({
  formName = "Formbox",
  formLink = "http://localhost:3000/organizations",
  answers = [
    { label: "What is your name?", value: "Jalen", id: "csdwdcwqdc" } as Answer,
  ],
}: Props) => {
  const previewText = `New submission for ${formName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body style={wrapper}>
          <Container style={wrapper}>
            <Container style={container}>
              <Header />
              <Section className="px-6 py-10">
                <Heading style={{ ...h1 }} className="font-normal">
                  New submission for <strong>{formName}</strong>
                </Heading>
                <Section>
                  {answers.map((answer) => (
                    <div key={answer.id}>
                      <Text className="text-[16px]">
                        <strong>{answer.label}</strong>
                      </Text>
                      <Text style={text}>{answer.value}</Text>
                    </div>
                  ))}
                </Section>
                <Button style={button} href={formLink} className="mt-4">
                  View submission
                </Button>
              </Section>
              <FooterCenter />
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

SubmissionEmailTemplate.PreviewProps = {};

export default SubmissionEmailTemplate;
