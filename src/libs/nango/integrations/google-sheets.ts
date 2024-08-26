import { nango } from "../server";

type GoogleSheet = {
  spreadsheetId: string;
  properties: {
    title: string;
  };
  spreadsheetUrl: string;
};

const integration = "google-sheets";

export async function createGoogleSheet(
  connectionId: string,
  title: string | undefined,
) {
  const result = await nango.post<GoogleSheet>({
    endpoint: "/v4/spreadsheets",
    providerConfigKey: integration,
    connectionId,
    retries: 5,
    data: {
      properties: {
        title,
      },
    },
  });

  return result;
}

export async function getSpreadSheet(
  spreadsheetId: string,
  connectionId: string,
) {
  try {
    const result = await nango.get<GoogleSheet>({
      endpoint: `/v4/spreadsheets/${spreadsheetId}`,
      providerConfigKey: integration,
      connectionId,
      retries: 5,
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
}

export async function addSheetEntry(
  connectionId: string,
  spreadsheetId: string,
  range: string,
  values: string[][],
) {
  const result = await nango.post<GoogleSheet>({
    endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${range}:append`,
    providerConfigKey: integration,
    connectionId,
    retries: 5,
    params: {
      valueInputOption: "USER_ENTERED",
    },
    data: { values },
  });

  return result;
}

export async function updateSheetHeaders(
  connectionId: string,
  spreadsheetId: string,
  range: string,
  values: string[][],
) {
  const result = await nango.proxy<GoogleSheet>({
    method: "PUT",
    endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    providerConfigKey: integration,
    connectionId,
    retries: 5,
    params: {
      valueInputOption: "USER_ENTERED",
    },
    data: { values },
  });

  return result;
}
