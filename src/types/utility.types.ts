export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: unknown[]) => infer U
    ? U
    : T extends Promise<infer U>
      ? U
      : T;

export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

export type FormProps<T> = {
  onFormSubmit: (data: T) => Promise<T | void>;
  loading?: boolean;
  error?: any;
  clearError?: () => void;
};

export const Roles = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
  VIEWER: "viewer",
} as const;

export const MIME_TYPES = {
  // Images
  png: "image/png",
  gif: "image/gif",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  webp: "image/webp",
  avif: "image/avif",

  // Documents
  mp4: "video/mp4",
  csv: "text/csv",
  pdf: "application/pdf",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
} as const;

export const IMAGE_MIME_TYPE = [
  MIME_TYPES.png,
  MIME_TYPES.gif,
  MIME_TYPES.jpeg,
  MIME_TYPES.svg,
  MIME_TYPES.webp,
  MIME_TYPES.avif,
];

export const PDF_MIME_TYPE = [MIME_TYPES.pdf];
export const MS_EXCEL_MIME_TYPE = [MIME_TYPES.xls, MIME_TYPES.xlsx];
