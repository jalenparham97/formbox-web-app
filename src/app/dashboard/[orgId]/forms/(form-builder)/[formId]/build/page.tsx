import { FormBuildView } from "@/components/forms/form-build-view";
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
    title: `Build - ${form?.name}`,
  };
}

export default function BuildPage({ params: { formId, orgId } }: Props) {
  return <FormBuildView formId={formId} orgId={orgId} />;
}
