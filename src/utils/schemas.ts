import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const UserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must contain at least 3 character(s)")
    .max(50, "Name must contain at less than 50 character(s)"),
});

export const OrgCreateSchema = z.object({
  name: z.string().min(1, "Organization name is a required field"),
  // slug: z.string().min(1, "Organization slug is a required field"),
});

export const OrgUpdateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
});

export const formCreateSchema = z.object({
  name: z.string().min(1, "Form name is a required field."),
  type: z.enum(["endpoint", "hosted"]).default("endpoint"),
  orgId: z.string(),
});

export const formDuplicateSchema = z.object({
  id: z.string(),
  orgId: z.string(),
});

export const formUpdateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  isClosed: z.boolean().optional(),
  removeFormboxBranding: z.boolean().optional(),
  saveAnswers: z.boolean().optional(),
  submissionStorageDuration: z.string().optional(),
  sendEmailNotifications: z.boolean().optional(),
  sendRespondantEmailNotifications: z.boolean().optional(),
  emailsToNotify: z.array(z.string()).optional(),
  allowedDomains: z.string().optional(),
  customHoneypot: z.string().optional(),
  limitResponses: z.boolean().optional(),
  maxResponses: z.number().optional().nullable(),
  respondantEmailFromName: z.string().optional(),
  respondantEmailSubject: z.string().optional(),
  respondantEmailMessageHTML: z.string().optional(),
  submitButtonText: z.string().optional(),
  webhookEnabled: z.boolean().optional(),
  webhookUrl: z.string().optional(),
  useCustomRedirect: z.boolean().optional(),
  customSuccessUrl: z.string().optional(),
  useCustomThankYouPage: z.boolean().optional(),
  tpBackgroundColor: z.string().optional(),
  tpTextColor: z.string().optional(),
  tpButtonBackgroundColor: z.string().optional(),
  tpButtonColor: z.string().optional(),
  tpHeader: z.string().optional(),
  tpMessage: z.string().optional(),
  tpButtonText: z.string().optional(),
  tpButtonUrl: z.string().optional(),
  googleRecaptchaEnabled: z.boolean().optional(),
  googleRecaptchaSecretKey: z.string().optional(),
  showCustomClosedMessage: z.boolean().optional(),
  closeMessageTitle: z.string().optional(),
  closeMessageDescription: z.string().optional(),
  headerTitle: z.string().optional(),
  headerDescription: z.string().optional(),
  pageMode: z.enum(["compact", "full"]).optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  buttonBackgroundColor: z.string().optional(),
  buttonTextColor: z.string().optional(),
  accentColor: z.string().optional(),
  buttonBorderStyle: z.enum(["full", "flat", "rounded"]).optional(),
  inputBorderStyle: z.enum(["full", "flat", "rounded"]).optional(),
  headerImage: z.string().default("").optional(),
  logo: z.string().default("").optional(),
  fields: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        description: z.string().optional(),
        type: z.string(),
        subtype: z.string(),
        required: z.boolean(),
        ratingCount: z.number().optional(),
        options: z
          .array(z.object({ id: z.string(), value: z.string() }))
          .optional(),
        showDescription: z.boolean(),
      }),
    )
    .optional(),
});

export const formCreateBodySchema = z.object({
  name: z.string().min(1, "Form name is a required field."),
  type: z.enum(["endpoint", "hosted"]).default("endpoint"),
  removeFormboxBranding: z.boolean().default(false),
  sendEmailNotifications: z.boolean().default(true),
  emailsToNotify: z.array(z.string()).default([]),
  submissionStorageDuration: z
    .enum(["30", "60", "90", "365", "forever", "never"])
    .default("365"),
  sendRespondantEmailNotifications: z.boolean().default(false),
  respondantEmailFromName: z.string().default(""),
  respondantEmailSubject: z.string().default(""),
  limitResponses: z.boolean().default(false),
  isClosed: z.boolean().default(false),
  maxResponses: z.number().default(Infinity),
  useCustomThankYouPage: z.boolean().default(false),
  tpButtonText: z.string().default(""),
  tpButtonColor: z.string().default("#030712"),
  tpButtonBackgroundColor: z.string().default("#f3f4f6"),
  tpBackgroundColor: z.string().default("#ffffff"),
  tpTextColor: z.string().default("#030712"),
  tpHeader: z.string().default(""),
  tpMessage: z.string().default(""),
  tpButtonUrl: z.string().default(""),
  useCustomRedirect: z.boolean().default(false),
  customSuccessUrl: z.string().default(""),
  customHoneypot: z.string().default(""),
  googleRecaptchaEnabled: z.boolean().default(false),
  googleRecaptchaSecretKey: z.string().default(""),
  allowedDomains: z.string().default(""),
});

export const formUpdateBodySchema = z.object({
  name: z.string().optional(),
  type: z.enum(["endpoint", "hosted"]).optional(),
  removeFormboxBranding: z.boolean().optional(),
  sendEmailNotifications: z.boolean().optional(),
  emailsToNotify: z.array(z.string()).optional(),
  submissionStorageDuration: z
    .enum(["30", "60", "90", "365", "forever", "never"])
    .optional(),
  sendRespondantEmailNotifications: z.boolean().optional(),
  respondantEmailFromName: z.string().optional(),
  respondantEmailSubject: z.string().optional(),
  limitResponses: z.boolean().optional(),
  isClosed: z.boolean().optional(),
  maxResponses: z.number().optional(),
  useCustomThankYouPage: z.boolean().optional(),
  tpButtonText: z.string().optional(),
  tpButtonColor: z.string().optional(),
  tpButtonBackgroundColor: z.string().optional(),
  tpBackgroundColor: z.string().optional(),
  tpTextColor: z.string().optional(),
  tpHeader: z.string().optional(),
  tpMessage: z.string().optional(),
  tpButtonUrl: z.string().optional(),
  useCustomRedirect: z.boolean().optional(),
  customSuccessUrl: z.string().optional(),
  customHoneypot: z.string().optional(),
  googleRecaptchaEnabled: z.boolean().optional(),
  googleRecaptchaSecretKey: z.string().optional(),
  allowedDomains: z.string().optional(),
});

export const integrationCreateSchema = z.object({
  type: z.enum([
    "google-sheets",
    "excel",
    "slack",
    "airtable",
    "notion",
    "mailchimp",
    "github",
    "zapier",
    "webhook",
  ]),
  orgId: z.string(),
  formId: z.string(),
  connectionId: z.string(),
  isEnabled: z.boolean().default(true),
  webhookUrl: z.string().optional(),
});

export const integrationUpdateSchema = z.object({
  id: z.string().optional(),
  isEnabled: z.boolean().optional(),
  spreadsheetId: z.string().optional(),
  excelWebUrl: z.string().optional(),
  airtableBaseId: z.string().optional(),
  airtableTableId: z.string().optional(),
  mailchimpDC: z.string().optional(),
  mailchimpListId: z.string().optional(),
  webhookUrl: z.string().optional(),
  slackChannelId: z.string().optional(),
});

export const domainCreateSchema = z.object({
  name: z.string().min(1, "Domain name is required"),
  orgId: z.string(),
});

const SortOperators = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const filterSchema = {
  searchString: z.string().optional(),
  cursor: z.string().nullish(),
  sort: z.nativeEnum(SortOperators).optional(),
  take: z.number().optional(),
};
