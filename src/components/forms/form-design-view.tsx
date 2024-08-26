"use client";

import { useFormStore } from "@/stores/form.store";

interface Props {
  formId: string;
}

export function FormDesignView({ formId }: Props) {
  const { form } = useFormStore();

  console.log("form design view: ", form);

  return <div>Form Design View</div>;
}
