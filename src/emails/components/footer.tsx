import {
  Column,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = "https://www.fireball.email/fireball-assets/";

export function FooterLeft() {
  return (
    <Section className="w-full px-6 pb-8">
      <Hr style={hr} className="mt-0" />
      {/* Social links */}
      <Section className="mx-auto my-4 w-full">
        <Row align="left">
          <Column>
            <Section>
              <Text style={footer} className="my-0">
                © {new Date().getFullYear()} Formbox. All rights reserved.
              </Text>
              <Text style={footer} className="my-0">
                MI, USA
              </Text>
            </Section>
          </Column>
          <Column className="ml-2 align-top">
            <Row align="right" className="w-auto">
              <Column>
                <Link
                  href={"https://www.fireball.email"}
                  className="mx-1 block h-8 w-8"
                >
                  <Img
                    src={`${baseUrl}/instagram-icon.png`}
                    width="20"
                    height="20"
                    alt="Instagram Logo"
                    className="m-0 block w-5 min-w-5 p-0"
                  />
                </Link>
              </Column>
              <Column>
                <Link
                  href={"https://www.fireball.email"}
                  className="mx-1 block h-8 w-8"
                >
                  <Img
                    src={`${baseUrl}/twitter-icon.png`}
                    width="20"
                    height="20"
                    alt="X Logo"
                    className="m-0 block w-5 min-w-5 p-0"
                  />
                </Link>
              </Column>
              <Column>
                <Link
                  href={"https://www.fireball.email"}
                  className="mx-1 block h-8 w-8"
                >
                  <Img
                    src={`${baseUrl}/github-icon.png`}
                    width="20"
                    height="20"
                    alt="GitHub Logo"
                    className="m-0 block w-5 min-w-5 p-0"
                  />
                </Link>
              </Column>
            </Row>
          </Column>
          {/* Meta */}
        </Row>
      </Section>
      {/* Footer links */}
      {/* <Section className="w-full my-4">
        <Row align="left" className="w-auto">
          <Column>
            <Link style={link} href={"https://www.fireball.email"}>
              Unsubscribe
            </Link>
            <Link style={link} href={"https://www.fireball.email"}>
              Preferences
            </Link>
            <Link style={link} href={"https://www.fireball.email"}>
              Help
            </Link>
          </Column>
        </Row>
      </Section> */}
    </Section>
  );
}

export function FooterCenter() {
  return (
    <Section className="w-full px-6 pb-6">
      <Hr style={hr} className="mt-0" />

      {/* Footer links */}
      {/* <Section className="mx-auto my-4 w-auto">
        <Row align="left" className="w-auto">
          <Column>
            <Link style={link} href={"https://www.fireball.email"}>
              Unsubscribe
            </Link>
            <Link style={link} href={"https://www.fireball.email"}>
              Preferences
            </Link>
            <Link style={link} href={"https://www.fireball.email"}>
              Help
            </Link>
          </Column>
        </Row>
      </Section> */}

      {/* Meta */}
      <Section className="mx-auto my-4 text-center">
        <Text style={footer} className="my-0">
          © {new Date().getFullYear()} Formbox. All rights reserved.
        </Text>
        <Text style={footer} className="my-0">
          MI, USA
        </Text>
      </Section>
      {/* Social links */}
      {/* <Section className="mx-auto my-4 w-auto">
        <Row align="left" className="w-auto">
          <Column>
            <Link
              href={"https://www.fireball.email"}
              className="mx-1 block min-w-9 p-1.5"
            >
              <Img
                src={`${baseUrl}/instagram-icon.png`}
                width="20"
                height="20"
                alt="Instagram Logo"
                className="my-0"
              />
            </Link>
          </Column>
          <Column>
            <Link
              href={"https://www.fireball.email"}
              className="mx-1 block min-w-9 p-1.5"
            >
              <Img
                src={`${baseUrl}/twitter-icon.png`}
                width="20"
                height="20"
                alt="X Logo"
                className="my-0"
              />
            </Link>
          </Column>
          <Column>
            <Link
              href={"https://www.fireball.email"}
              className="mx-1 block min-w-9 p-1.5"
            >
              <Img
                src={`${baseUrl}/github-icon.png`}
                width="20"
                height="20"
                alt="GitHub Logo"
                className="my-0"
              />
            </Link>
          </Column>
        </Row>
      </Section> */}
    </Section>
  );
}

const footer = {
  color: "#8E9EB4",
  fontSize: "13px",
};

const hr = {
  borderColor: "#F1F1F4",
  margin: "24px 0",
};

const link = {
  color: "#8E9EB4",
  textDecoration: "underline",
  fontSize: "13px",
  marginRight: "16px",
};
