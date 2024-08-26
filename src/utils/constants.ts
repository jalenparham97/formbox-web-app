export const COMPANY_NAME = "Formbox";

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/organizations";

export const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export const NUMBER_REGEX =
  /^(?:-(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$/;

export const PHONE_NUMBER_REGEX =
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

export const FILTER_TAKE = 20;

export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_REDIRECTS = {
  home: "https://formbox.app",
  formbox: "https://formbox.app",
  auth: "https://app.formbox.app/auth/login",
  signin: "https://app.formbox.app/login",
  login: "https://app.formbox.app/login",
  register: "https://app.formbox.app/signup",
  signup: "https://app.formbox.app/signup",
  app: "https://app.formbox.app",
  dashboard: "https://app.formbox.app",
  settings: "https://app.formbox.app/settings",
  onboarding: "https://app.formbox.co/onboarding",
};

export const submissionErrors = {
  CLOSED: "CLOSED",
  DOMAIN_NOT_ALLOWED: "DOMAIN_NOT_ALLOWED",
  FORM_NOT_FOUND: "FORM_NOT_FOUND",
  LIMIT_REACHED: "LIMIT_REACHED",
  FILE_TYPE_NOT_ALLOWED: "FILE_TYPE_NOT_ALLOWED",
  FILE_SIZE_EXCEEDED: "FILE_SIZE_EXCEEDED",
  MAX_FILE_COUNT_EXCEEDED: "MAX_FILE_COUNT_EXCEEDED",
} as const;

export const MIME_TYPES = {
  // Images
  png: "image/png",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  svg: "image/svg+xml",
  webp: "image/webp",
  avif: "image/avif",
  heic: "image/heic",

  // Documents
  csv: "text/csv",
  txt: "text/plain",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
} as const;

export const DOCUMENT_MIME_TYPE = [
  MIME_TYPES.txt,
  MIME_TYPES.pdf,
  MIME_TYPES.doc,
  MIME_TYPES.docx,
] as const;

export const SPREADSHEET_MIME_TYPE = [
  MIME_TYPES.xls,
  MIME_TYPES.xlsx,
  MIME_TYPES.csv,
] as const;

export const IMAGE_MIME_TYPE = [
  MIME_TYPES.png,
  MIME_TYPES.gif,
  MIME_TYPES.jpeg,
  MIME_TYPES.jpg,
  MIME_TYPES.svg,
  MIME_TYPES.webp,
  MIME_TYPES.avif,
  MIME_TYPES.heic,
] as const;

export type ImageMimeType =
  | "image/png"
  | "image/gif"
  | "image/jpeg"
  | "image/jpg"
  | "image/svg+xml"
  | "image/webp"
  | "image/avif"
  | "image/heic";

export type DocumentMimeType =
  | "text/plain"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type SpreadsheetMimeType =
  | "text/csv"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const API_SCOPES = {
  api: {
    full: "api.full",
    read: "api.read",
  },
};
