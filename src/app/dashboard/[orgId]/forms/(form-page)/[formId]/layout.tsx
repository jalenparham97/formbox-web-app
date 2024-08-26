import { FormPageLayout } from "@/components/forms/form-page-layout";

interface Props {
  children: React.ReactNode;
  params: { formId: string; orgId: string };
}

export default function FormLayout({
  children,
  params: { formId, orgId },
}: Props) {
  return (
    <FormPageLayout formId={formId} orgId={orgId}>
      {children}
    </FormPageLayout>
  );
}
