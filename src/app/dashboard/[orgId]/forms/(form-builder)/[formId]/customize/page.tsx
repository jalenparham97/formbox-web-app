import { FormDesignView } from "@/components/forms/form-design-view";
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
    title: `Design - ${form?.name}`,
  };
}

export default function DesignPage({ params: { formId } }: Props) {
  return <FormDesignView formId={formId} />;
}
