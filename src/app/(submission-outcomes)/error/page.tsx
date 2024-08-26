import { RouterButton } from "@/components/ui/router-button";
import { COMPANY_NAME, submissionErrors } from "@/utils/constants";
import { cn } from "@/utils/tailwind-helpers";
import { IconExclamationCircle } from "@tabler/icons-react";

export const metadata = {
  title: `Error - ${COMPANY_NAME}`,
};

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ErrorPage({ searchParams }: Props) {
  const error = searchParams?.error;

  function getErrorMessage() {
    if (error === submissionErrors.CLOSED) {
      return "The owner of this form has closed this form and it is no longer accepting submissions.";
    }

    if (error === submissionErrors.DOMAIN_NOT_ALLOWED) {
      return "The domain from which this submission was sent is not allowed.";
    }

    if (error === submissionErrors.FORM_NOT_FOUND) {
      return "The form you are trying to submit to does not exist.";
    }

    if (error === submissionErrors.LIMIT_REACHED) {
      return "The owner of this form is no longer accepting submissions.";
    }

    if (error === submissionErrors.FILE_SIZE_EXCEEDED) {
      return "The file you are trying to upload is too large. Please try again with a smaller file. The maximum file size is 5MB.";
    }

    if (error === submissionErrors.FILE_TYPE_NOT_ALLOWED) {
      return "The file you are trying to upload is not allowed. Please try again with a different file type. Allowed file types are: .png, .gif, .jpeg, .jpg, .svg, .webp, .avif, .heic, .csv, .txt, .pdf, .doc, .docx, .xls, .xlsx";
    }

    if (error === submissionErrors.MAX_FILE_COUNT_EXCEEDED) {
      return "The maximum number of files allowed for this submission has been exceeded. Please try again with fewer files. The maximum number of files allowed is 1.";
    }

    return "There was a problem processing your form submission.";
  }

  return (
    <div
      className={cn(
        "mt-40 flex h-full w-full flex-col items-center justify-center text-center md:mt-52",
      )}
    >
      <IconExclamationCircle size={60} className="mx-auto text-red-600" />
      <h2 className="mt-4 text-2xl font-semibold lg:text-3xl">Sorry!</h2>
      <p className="mt-4 max-w-lg font-light lg:text-xl">{getErrorMessage()}</p>
      <div className="mt-8">
        <RouterButton />
      </div>
    </div>
  );
}
