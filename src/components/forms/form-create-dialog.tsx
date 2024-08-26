"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogProps,
} from "../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { type FormCreateFields } from "@/types/form.types";
import { formCreateSchema } from "@/utils/schemas";
import { useFormAddMutation } from "@/queries/form.queries";
import { useState } from "react";
import { cn } from "@/utils/tailwind-helpers";
import { useOrgById } from "@/queries/org.queries";

interface Props extends DialogProps {
  orgId: string;
  onClose: () => void;
}

export function FormCreateDialog({ open, onClose, orgId }: Props) {
  const [formType, setFormType] = useState<"endpoint" | "hosted">("endpoint");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormCreateFields>({
    resolver: zodResolver(formCreateSchema),
    defaultValues: {
      orgId,
    },
  });

  const org = useOrgById(orgId);

  function pickType(type: "endpoint" | "hosted") {
    setFormType(type);
  }

  const createFormMutation = useFormAddMutation();

  const closeModal = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormCreateFields) => {
    await createFormMutation.mutateAsync({ ...data, type: formType });
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new form</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Choose the type of form you want to create.
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Form name"
              {...register("name")}
              allowAutoComplete={false}
              error={errors.name !== undefined}
              errorMessage={errors?.name?.message}
            />
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between space-x-2">
              <button
                className="w-full"
                onClick={() => pickType("endpoint")}
                type="button"
              >
                <div
                  className={cn(
                    "space-y-2 rounded-lg p-5 text-center hover:bg-gray-100",
                    formType === "endpoint"
                      ? "border-2 border-gray-900 bg-gray-100"
                      : "border border-gray-300",
                  )}
                >
                  <h4 className="font-semibold">Endpoint</h4>
                  <p className="text-sm text-gray-600">
                    Collect submissions from your HTML form.
                  </p>
                </div>
              </button>
              <button
                className="w-full"
                onClick={() => pickType("hosted")}
                type="button"
              >
                <div
                  className={cn(
                    "space-y-2 rounded-lg p-5 text-center hover:bg-gray-100",
                    formType === "hosted"
                      ? "border-2 border-gray-900 bg-gray-100"
                      : "border border-gray-300",
                  )}
                >
                  <h4 className="font-semibold">Hosted</h4>
                  <p className="text-sm text-gray-600">
                    Use our form builder to create a hosted form.
                  </p>
                </div>
              </button>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              className="mt-2 sm:mt-0"
              onClick={closeModal}
              type="button"
            >
              Close
            </Button>
            <Button loading={isSubmitting} type="submit">
              Create form
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
