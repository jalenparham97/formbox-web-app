import FormBuilderLayout from "@/components/forms/form-builder-layout";

interface Props {
  children: React.ReactNode;
  params: { formId: string; orgId: string };
}

export default function FormLayout({
  children,
  params: { formId, orgId },
}: Props) {
  return (
    <FormBuilderLayout formId={formId} orgId={orgId}>
      {children}
    </FormBuilderLayout>
  );
}
