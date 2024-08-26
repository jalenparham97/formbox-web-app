import { create } from "zustand";
import { type FormOutput } from "@/types/form.types";

type FormStateStore = {
  form: FormOutput | null;
  setForm: (form: FormOutput) => void;
};

export const useFormStore = create<FormStateStore>()((set) => ({
  form: null,
  setForm: (form) => set({ form }),
}));
