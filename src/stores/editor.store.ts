// import { type FormField, type Form } from "@prisma/client";
// import { create } from "zustand";

// type FormStore = {
//   formState: Form | null;
//   selectedElement: FormField | null;
//   setSelectedElement: (field: FormField) => void;
//   setFormState: (form: Form) => void;
//   addElement: (field: FormField, index: number) => void;
//   removeElement: (id: string) => void;
// };

// export const useFormStore = create<FormStore>()((set) => ({
//   formState: null,
//   selectedElement: null,
//   setFormState: (formState) => set({ formState }),
//   setSelectedElement: (selectedElement) => set({ selectedElement }),
//   addElement: (field, index) => {
//     set(({ formState }) => {
//       if (formState) {
//         const newFields = [...formState.fields];
//         newFields.splice(index, 0, field);
//         formState.fields = newFields;
//         return { formState };
//       }
//       return { formState: null };
//     });
//   },
//   removeElement: (id) => {
//     set(({ formState }) => {
//       if (formState) {
//         const newFields = formState?.fields.filter((field) => field.id !== id);
//         formState.fields = newFields;
//         return { formState };
//       }
//       return { formState: null };
//     });
//   },
// }));
