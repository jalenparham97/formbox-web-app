import { FormboxApiError } from "./errors";
import { FormCreateBody, FormUpdateBody } from "@/types/form.types";

export function setSubmissionStorageDuration(
  plan: string,
  body: FormCreateBody | FormUpdateBody,
): FormCreateBody["submissionStorageDuration"] {
  if (plan === "free") {
    return "60";
  }
  if (plan === "professional") {
    return "365";
  }
  return body.submissionStorageDuration || "365";
}

export function throwIfPlanAccessForbidden(
  plan: string,
  body: FormCreateBody | FormUpdateBody,
) {
  if (plan === "free") {
    if (body.submissionStorageDuration !== "60") {
      throw new FormboxApiError({
        code: "forbidden",
        message:
          "You can only use the free plan with a 60 day submission storage duration.",
      });
    }
    if (body.sendRespondantEmailNotifications) {
      throw new FormboxApiError({
        code: "forbidden",
        message:
          "The free plan does not support respondant email notifications.",
      });
    }
    if (body.useCustomRedirect) {
      throw new FormboxApiError({
        code: "forbidden",
        message: "The free plan does not support custom redirects.",
      });
    }
    if (body.customHoneypot) {
      throw new FormboxApiError({
        code: "forbidden",
        message: "The free plan does not support custom honeypots.",
      });
    }
    if (body.allowedDomains) {
      throw new FormboxApiError({
        code: "forbidden",
        message: "The free plan does not support allowed domains.",
      });
    }
  }

  if (plan === "professional") {
    if (body.submissionStorageDuration !== "365") {
      throw new FormboxApiError({
        code: "forbidden",
        message:
          "You can only use the professional plan with a 365 day submission storage duration.",
      });
    }
  }
}
