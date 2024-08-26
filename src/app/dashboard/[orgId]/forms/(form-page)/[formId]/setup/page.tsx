import { FormSetupView } from "@/components/forms/form-setup-view";
import { api } from "@/trpc/server";
import { type Metadata } from "next";

interface Props {
  params: { formId: string; orgId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const form = await api.form.getById({
    id: params.formId,
    orgId: params.orgId,
  });
  return {
    title: `Setup - ${form?.name}`,
  };
}

export default function SetupPage({ params: { formId } }: Props) {
  return <FormSetupView formId={formId} />;
}
