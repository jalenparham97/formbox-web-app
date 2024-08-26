import { nango } from "../server";

const integration = "airtable";

export type AirtableBase = {
  id: string;
  name: string;
};

export type AirtableTable = {
  id: string;
  name: string;
  fields: {
    id: string;
    name: string;
    type: string;
  }[];
};

export type AirtableRecord = {
  fields: {
    [key: string]: any;
  };
};

export async function getBases(connectionId: string) {
  try {
    const result = await nango.get({
      endpoint: `/v0/meta/bases`,
      providerConfigKey: integration,
      connectionId,
      retries: 5,
    });

    return result.data.bases as AirtableBase[];
  } catch (error) {
    console.log(error);
  }
}

export async function getTables(connectionId: string, baseId: string) {
  try {
    const result = await nango.get({
      endpoint: `/v0/meta/bases/${baseId}/tables`,
      providerConfigKey: integration,
      connectionId,
      retries: 5,
    });

    return result.data.tables as AirtableTable[];
  } catch (error) {
    console.log(error);
  }
}

type CreateRecordInput = {
  connectionId: string;
  baseId: string;
  tableId: string;
  record: AirtableRecord;
};

export async function createRecord({
  connectionId,
  baseId,
  tableId,
  record,
}: CreateRecordInput) {
  try {
    const result = await nango.post({
      endpoint: `v0/${baseId}/${tableId}`,
      providerConfigKey: integration,
      connectionId,
      retries: 5,
      data: { records: [record] },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
}
