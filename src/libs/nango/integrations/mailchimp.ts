import { nango } from "../server";

export async function getMailchimpDC(connectionId: string) {
  try {
    const result = await nango.get({
      baseUrlOverride: `https://login.mailchimp.com`,
      endpoint: `/oauth2/metadata`,
      providerConfigKey: "mailchimp",
      connectionId,
      retries: 5,
    });

    return result.data.dc as string;
  } catch (error) {
    console.log(error);
  }
}

export type MailchimpList = {
  id: string;
  name: string;
};

export async function getLists(connectionId: string, dc: string = "us22") {
  try {
    const result = await nango.get({
      baseUrlOverride: `https://${dc}.api.mailchimp.com`,
      endpoint: `/3.0/lists`,
      providerConfigKey: "mailchimp",
      connectionId,
      retries: 5,
    });

    return result.data.lists as MailchimpList[];
  } catch (error) {
    console.log(error);
  }
}

export async function addMemberToList(
  connectionId: string,
  dc: string,
  listId: string,
  email: string,
  mergeFields?: Record<string, any>,
) {
  try {
    const result = await nango.post({
      baseUrlOverride: `https://${dc}.api.mailchimp.com`,
      endpoint: `/3.0/lists/${listId}/members?skip_merge_validation=false`,
      providerConfigKey: "mailchimp",
      connectionId,
      data: {
        email_address: email,
        status: "subscribed",
        ...(mergeFields && { merge_fields: mergeFields }),
      },
      retries: 5,
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
}
