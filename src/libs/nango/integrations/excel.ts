import { nango } from "@/libs/nango/server";

const integration = "excel";

export type ExcelWorkbook = {
  id: string;
  name: string;
  webUrl: string;
};

export type ExcelWorkbooks = {
  value: ExcelWorkbook[];
};

export async function getExcelWorkbooks(connectionId: string) {
  const result = await nango.get<ExcelWorkbooks>({
    baseUrlOverride: "https://graph.microsoft.com",
    endpoint: "/v1.0/me/drive/root/children?$select=id,name,webUrl",
    providerConfigKey: integration,
    connectionId,
    retries: 5,
  });

  return result.data.value.filter((workbook) =>
    workbook.name.endsWith(".xlsx"),
  );
}

export async function getRowCount(connectionId: string, workbookId: string) {
  const result = await nango.get({
    baseUrlOverride: "https://graph.microsoft.com",
    endpoint: `/v1.0/me/drive/items/${workbookId}/workbook/worksheets('Sheet1')/usedRange?$select=rowCount,rowIndex`,
    providerConfigKey: integration,
    connectionId,
    retries: 5,
  });

  return result.data.rowCount as number;
}

export async function updateExcelSheetHeaders(
  connectionId: string,
  spreadsheetId: string,
  range: string,
  values: string[][],
) {
  const result = await nango.patch({
    baseUrlOverride: "https://graph.microsoft.com",
    endpoint: `/v1.0/me/drive/items/${spreadsheetId}/workbook/worksheets/Sheet1/range(address='${range}')`,
    providerConfigKey: integration,
    connectionId,
    retries: 5,
    data: { values },
  });

  return result.data;
}

export async function addExcelSheetEntry(
  connectionId: string,
  spreadsheetId: string,
  range: string,
  values: string[][],
) {
  const result = await nango.patch({
    baseUrlOverride: "https://graph.microsoft.com",
    endpoint: `/v1.0/me/drive/items/${spreadsheetId}/workbook/worksheets/Sheet1/range(address='${range}')`,
    providerConfigKey: integration,
    connectionId,
    retries: 5,
    data: { values },
  });

  return result.data;
}
