import { FormSubmissionsView } from "@/components/forms/form-submissions-view";
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
    title: `Submissions - ${form?.name}`,
  };
}

export default function Page({ params: { formId, orgId } }: Props) {
  return <FormSubmissionsView formId={formId} orgId={orgId} />;
}
