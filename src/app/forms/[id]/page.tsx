import { FormPreview } from "@/components/forms/form-preview";
import { api } from "@/trpc/server";
import { type FormOutput } from "@/types/form.types";
import { IconEyeOff } from "@tabler/icons-react";
import React from "react";
import { type Metadata } from "next";
import { env } from "@/env";
import { redirect } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const form = await api.form.getByIdPublic({ id: params.id });
  return {
    title: `${form?.headerTitle}`,
    description: "Made with Formbox, the easiest way to create forms for free.",
    openGraph: {
      title: `${form?.headerTitle}`,
      description:
        "Made with Formbox, the easiest way to create forms for free.",
      images: [
        {
          url: `${env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL}/formbox-homepage.png`,
          width: 800,
          height: 800,
          alt: "Formbox Forms",
        },
      ],
    },
  };
}

export default async function FormViewPage({ params }: Props) {
  const form = await api.form.getByIdPublic({ id: params.id });

  const isFormClosed =
    form?.isClosed ||
    (form?.limitResponses &&
      Number(form?._count.submissions) >=
        Number(form?.maxResponses || Infinity));

  async function redirectToCustomSuccessUrl() {
    "use server";
    if (form?.customSuccessUrl) {
      redirect(form?.customSuccessUrl);
    }
  }

  return (
    <div className="h-full">
      <div className="h-full">
        {isFormClosed && (
          <div className="flex h-screen flex-col items-center justify-center">
            <div
              className="space-y-3 text-center"
              style={{ color: form?.textColor }}
            >
              <div className="flex flex-col items-center">
                <IconEyeOff size={50} />
              </div>
              <h2 className="mt-4 text-2xl font-semibold">
                {form?.closeMessageTitle || "This form is now closed"}
              </h2>
              <p className="text-xl font-light">
                {form?.closeMessageDescription ||
                  "The form can't receive new submissions at this moment."}
              </p>
            </div>
          </div>
        )}

        {!isFormClosed && (
          <FormPreview
            form={form as FormOutput}
            redirect={redirectToCustomSuccessUrl}
          />
        )}
      </div>
    </div>
  );
}
