import { RouterButton } from "@/components/ui/router-button";
import { api } from "@/trpc/server";
import { COMPANY_NAME } from "@/utils/constants";
import { cn } from "@/utils/tailwind-helpers";
import { IconCircleCheck } from "@tabler/icons-react";

export const metadata = {
  title: `Success - ${COMPANY_NAME}`,
};

export default async function SuccessPage({
  params,
}: {
  params: { formId: string };
}) {
  const form = await api.form.getCustomTYPageSettings({ id: params.formId });

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center text-center",
      )}
      style={{
        backgroundColor: form?.tpBackgroundColor || "#ffffff",
        color: form?.tpTextColor || "#030712",
      }}
    >
      <IconCircleCheck size={60} className="mx-auto" />
      <h2 className="mt-4 text-2xl font-semibold lg:text-3xl">
        {form?.tpHeader || "Thank you!"}
      </h2>
      <p className="mt-4 font-light lg:text-xl">
        {form?.tpMessage || "The form was submitted successfully."}
      </p>
      <div className="mt-8">
        <RouterButton
          buttonText={form?.tpButtonText}
          buttonUrl={form?.tpButtonUrl}
          buttonBackgroundColor={form?.tpButtonBackgroundColor}
          buttonTextColor={form?.tpButtonColor}
        />
      </div>
    </div>
  );
}
