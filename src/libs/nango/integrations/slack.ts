import { env } from "@/env";
import { nango } from "../server";

type SlackConnection = {
  bot_user_id: string;
  team: {
    id: string;
    name: string;
  };
};

type SlackChannel = {
  id: string;
  name: string;
};

export async function getSlackConnection(connectionId: string) {
  const result = await nango.getConnection("slack", connectionId);
  return result.credentials.raw as SlackConnection;
}

export async function fetchSlackChannels(connectionId: string) {
  const result = await nango.get({
    connectionId,
    providerConfigKey: "slack",
    endpoint: "/conversations.list?types=public_channel,private_channel",
  });
  return result.data.channels as SlackChannel[];
}

type FormInfo = {
  formName: string;
  formId: string;
  orgId: string;
  answers: Record<string, string>;
};

export async function createSlackMessage(
  connectionId: string,
  channelId: string,
  formInfo: FormInfo,
) {
  return nango.post({
    connectionId,
    providerConfigKey: "slack",
    endpoint: "/chat.postMessage",
    retries: 5,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      channel: channelId,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `New submission for *${formInfo.formName}*`,
          },
        },
        ...Object.entries(formInfo.answers).map(([key, value]) => ({
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*${key}:* ${value}`,
            },
          ],
        })),
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View in Formbox",
                emoji: true,
              },
              url: `${env.APP_URL}/dashboard/${formInfo.orgId}/forms/${formInfo.formId}`,
            },
          ],
        },
      ],
    },
  });
}
