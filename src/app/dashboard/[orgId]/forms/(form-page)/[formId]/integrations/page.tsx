import { FormIntegrationsView } from "@/components/forms/form-integrations-view";
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
    title: `Integrations - ${form?.name}`,
  };
}

export default function IntegrationsPage({ params: { orgId, formId } }: Props) {
  return <FormIntegrationsView orgId={orgId} formId={formId} />;
}
