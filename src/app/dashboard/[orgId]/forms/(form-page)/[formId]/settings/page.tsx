import { FormSettingsView } from "@/components/forms/form-settings-view";
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
    title: `Settings - ${form?.name}`,
  };
}

export default function SettingsPage({ params: { orgId, formId } }: Props) {
  return <FormSettingsView orgId={orgId} formId={formId} />;
}
