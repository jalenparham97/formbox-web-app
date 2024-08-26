import { FormShareView } from "@/components/forms/form-share-view";
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
    title: `Share - ${form?.name}`,
  };
}

export default function SharePage({ params: { formId } }: Props) {
  return <FormShareView formId={formId} />;
}
