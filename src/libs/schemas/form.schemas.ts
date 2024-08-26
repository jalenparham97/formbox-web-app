import { z } from "../zod";
import { getPaginationQuerySchema } from "./api.schemas";

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

// External API
export const formCreateBodySchema = z.object({
  name: z
    .string()
    .min(1, "Form name is a required field.")
    .describe("Form name"),
  type: z
    .enum(["endpoint", "hosted"])
    .default("endpoint")
    .describe("Form type. The default is `endpoint`."),
  removeFormboxBranding: z
    .boolean()
    .default(false)
    .describe("Remove Formbox branding from the form."),
  sendEmailNotifications: z
    .boolean()
    .default(true)
    .describe("Send email notifications for new submissions.")
    .openapi({
      default: true,
    }),
  emailsToNotify: z
    .array(z.string())
    .default([])
    .describe("Email addresses to send notifications to."),
  submissionStorageDuration: z
    .enum(["30", "60", "90", "365", "forever", "never"])
    .default("365")
    .describe("How long to store submissions."),
  sendRespondantEmailNotifications: z
    .boolean()
    .default(false)
    .describe("Send respondant email notifications.")
    .openapi({
      default: false,
    }),
  respondantEmailFromName: z
    .string()
    .optional()
    .describe("From name for respondant email notifications."),
  respondantEmailSubject: z
    .string()
    .optional()
    .describe("Subject for respondant email notifications."),
  limitResponses: z
    .boolean()
    .default(false)
    .describe("Limit the number of responses for the form.")
    .openapi({
      default: false,
    }),
  isClosed: z
    .boolean()
    .default(false)
    .describe("Is the form closed for new submissions?")
    .openapi({
      default: false,
    }),
  maxResponses: z
    .number()
    .default(Infinity)
    .describe("Maximum number of responses for the form."),
  useCustomThankYouPage: z
    .boolean()
    .default(false)
    .describe("Use a custom thank you page.")
    .openapi({
      default: false,
    }),
  tpButtonText: z
    .string()
    .optional()
    .describe("Text for the thank you page button."),
  tpButtonColor: z
    .string()
    .default("#030712")
    .describe("Color for the thank you page button."),
  tpButtonBackgroundColor: z
    .string()
    .default("#f3f4f6")
    .describe("Background color for the thank you page button."),
  tpBackgroundColor: z
    .string()
    .default("#ffffff")
    .describe("Background color for the thank you page."),
  tpTextColor: z
    .string()
    .default("#030712")
    .describe("Text color for the thank you page."),
  tpHeader: z
    .string()
    .optional()
    .describe("Header text for the thank you page."),
  tpMessage: z
    .string()
    .optional()
    .describe("Message text for the thank you page."),
  tpButtonUrl: z
    .string()
    .optional()
    .describe("URL for the thank you page button."),
  useCustomRedirect: z
    .boolean()
    .default(false)
    .describe("Use a custom redirect URL.")
    .openapi({
      default: false,
    }),
  customSuccessUrl: z
    .string()
    .optional()
    .describe("Custom redirect URL for successful submissions."),
  customHoneypot: z.string().optional().describe("Custom honeypot field name."),
  googleRecaptchaEnabled: z
    .boolean()
    .default(false)
    .describe("Enable Google reCAPTCHA.")
    .openapi({
      default: false,
    }),
  googleRecaptchaSecretKey: z
    .string()
    .optional()
    .describe("Google reCAPTCHA secret key."),
  allowedDomains: z
    .string()
    .optional()
    .describe("Allowed domains for the form.")
    .openapi({
      example: "example.com, example.org",
      description: "Allowed domains for the form.",
    }),
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

// OpenAPI
export const formSchema = z
  .object({
    id: z.string().describe("The unique ID of the form."),
    name: z.string().describe("The name of the form."),
    type: z
      .string()
      .describe("The type of the form. Can be `endpoint` or `hosted`."),
    submissionStorageDuration: z
      .string()
      .describe("The duration of the submission storage."),
    sendEmailNotifications: z
      .boolean()
      .describe("Whether to send email notifications for new submissions."),
    sendRespondantEmailNotifications: z
      .boolean()
      .describe("Whether to send respondant email notifications."),
    emailsToNotify: z
      .array(z.string())
      .describe("Email addresses to send notifications to."),
    allowedDomains: z.string().describe("Allowed domains for the form."),
    customHoneypot: z.string().describe("Custom honeypot field name."),
    limitResponses: z
      .boolean()

      .describe("Whether to limit the number of responses for the form."),
    maxResponses: z
      .number()
      .nullable()
      .describe("Maximum number of responses for the form."),
    respondantEmailFromName: z
      .string()
      .describe("From name for respondant email notifications."),
    respondantEmailSubject: z
      .string()
      .describe("Subject for respondant email notifications."),
    respondantEmailMessageHTML: z
      .string()
      .describe("Message for respondant email notifications."),
    submitButtonText: z.string().describe("Text for the submit button."),
    webhookEnabled: z
      .boolean()
      .describe("Whether to enable webhooks.")
      .openapi({ deprecated: true }),
    webhookUrl: z
      .string()
      .describe("Webhook URL.")
      .openapi({ deprecated: true }),
    useCustomRedirect: z
      .boolean()
      .describe("Whether to use a custom redirect URL."),
    customSuccessUrl: z
      .string()
      .describe("Custom redirect URL for successful submissions."),
    useCustomThankYouPage: z
      .boolean()
      .describe("Whether to use a custom thank you page."),
    tpBackgroundColor: z
      .string()
      .describe("Background color for the thank you page."),
    tpTextColor: z.string().describe("Text color for the thank you page."),
    tpButtonBackgroundColor: z
      .string()
      .describe("Background color for the thank you page button."),
    tpButtonColor: z
      .string()
      .describe("Text color for the thank you page button."),
    tpHeader: z.string().describe("Header text for the thank you page."),
    tpMessage: z.string().describe("Message text for the thank you page."),
    tpButtonText: z.string().describe("Text for the thank you page button."),
    tpButtonUrl: z.string().describe("URL for the thank you page button."),
    googleRecaptchaEnabled: z
      .boolean()
      .describe("Whether to enable Google reCAPTCHA."),
    googleRecaptchaSecretKey: z
      .string()
      .describe("Google reCAPTCHA secret key."),
    showCustomClosedMessage: z
      .boolean()
      .describe("Whether to show a custom closed message."),
    closeMessageTitle: z.string().describe("Title for the closed message."),
    closeMessageDescription: z
      .string()
      .describe("Description for the closed message."),
    headerTitle: z.string().describe("Title for the header."),
    headerDescription: z.string().describe("Description for the header."),
    pageMode: z.enum(["compact", "full"]).describe("The form page mode."),
    backgroundColor: z.string().describe("The form background color."),
    textColor: z.string().describe("The form text color."),
    buttonBackgroundColor: z
      .string()
      .describe("The form button background color."),
    buttonTextColor: z.string().describe("The form button text color."),
    accentColor: z.string().describe("The form accent color."),
    buttonBorderStyle: z
      .enum(["full", "flat", "rounded"])
      .describe("The form button border style."),
    inputBorderStyle: z
      .enum(["full", "flat", "rounded"])
      .describe("The form input border style."),
    headerImage: z.string().describe("The form header image."),
    logo: z.string().describe("The form logo."),
    fields: z
      .array(
        z
          .object({
            id: z.string().describe("The field ID."),
            label: z.string().describe("The field label."),
            description: z
              .string()
              .optional()
              .describe("The field description."),
            type: z.string().describe("The field type."),
            subtype: z.string().describe("The field subtype."),
            required: z.boolean().describe("Whether the field is required."),
            ratingCount: z
              .number()
              .optional()
              .describe("The number of rating options."),
            options: z
              .array(z.object({ id: z.string(), value: z.string() }))
              .optional()
              .describe(
                "The options for multi-choice, dropdown, or single choice fields.",
              ),
            showDescription: z
              .boolean()
              .describe("Whether to show the field description."),
          })
          .optional(),
      )
      .describe("The form fields for hosted forms."),
    removeFormboxBranding: z
      .boolean()
      .describe("Whether to remove Formbox branding from the form."),
    isClosed: z.boolean().describe("Is the form closed?"),
    orgId: z.string().describe("The ID of the organization."),
    createdAt: z.string().describe("The date the form was created."),
    updatedAt: z.string().describe("The date the form was last updated."),
  })
  .openapi({ title: "Form" });

export const getFormsQuerySchema = z
  .object({
    search: z.string().optional().describe("Search for a form by name."),
    sort: z
      .enum(["createdAt", "submissions"])
      .optional()
      .default("createdAt")
      .describe(
        "The field to sort the forms by. The default is `createdAt`, and sort order is always descending.",
      )
      .openapi({
        default: "createdAt",
      }),
  })
  .merge(getPaginationQuerySchema({ maxPageSize: 100 }));

export const getFormsResponseSchema = z.object({
  data: z
    .array(
      z.object({
        id: z.string().describe("The unique ID of the form."),
        name: z.string().describe("The name of the form."),
        type: z
          .string()
          .describe("The type of the form. Can be `endpoint` or `hosted`."),
        isClosed: z.boolean().describe("Is the form closed?"),
        submissions: z.number().describe("The number of submissions."),
        orgId: z.string().describe("The ID of the organization."),
        createdAt: z.string().describe("The date the form was created."),
        updatedAt: z.string().describe("The date the form was last updated."),
      }),
    )
    .describe("The list of forms."),
  meta: z
    .object({
      total: z.number().describe("The total number of forms."),
    })
    .describe("Extra metadata about the forms response."),
  pagination: z
    .object({
      totalPages: z.number().describe("The total number of pages."),
      currentPage: z.number().describe("The current page number."),
      nextPage: z.number().nullish().describe("The next page number."),
      previousPage: z.number().nullish().describe("The previous page number."),
    })
    .describe("Pagination metadata."),
});

export const formResponseSchema = formSchema;
