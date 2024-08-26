import { RouterButton } from "@/components/ui/router-button";
import { COMPANY_NAME } from "@/utils/constants";
import { cn } from "@/utils/tailwind-helpers";
import { IconCircleCheck } from "@tabler/icons-react";

export const metadata = {
  title: `Success - ${COMPANY_NAME}`,
};

export default function SuccessPage() {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center text-center",
      )}
    >
      <IconCircleCheck size={60} className="mx-auto" />
      <h2 className="mt-4 text-2xl font-semibold lg:text-3xl">Thank You!</h2>
      <p className="mt-4 font-light lg:text-xl">
        The form was submitted successfully.
      </p>
      <div className="mt-8">
        <RouterButton />
      </div>
    </div>
  );
}
