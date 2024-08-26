"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  type DialogProps,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useOrgAddMutation } from "@/queries/org.queries";
import { type OrgCreateFields } from "@/types/org.types";

const schema = z.object({
  name: z.string().min(1, "Organization name is a required field."),
});

interface Props extends DialogProps {
  onClose: () => void;
}

export function OrgCreateDialog({ open, onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ name: string }>({
    resolver: zodResolver(schema),
  });

  const orgCreateMutation = useOrgAddMutation();

  const closeModal = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: OrgCreateFields) => {
    await orgCreateMutation.mutateAsync({ name: data.name });
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new organization</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Add a new organization to manage your team and forms.
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Organization name"
              {...register("name")}
              error={errors.name !== undefined}
              errorMessage={errors?.name?.message}
              allowAutoComplete={false}
            />
          </div>

          <DialogFooter className="mt-6 space-y-2 sm:space-y-0">
            <Button
              variant="outline"
              className="mt-2 sm:mt-0"
              onClick={closeModal}
              type="button"
            >
              Close
            </Button>
            <Button loading={orgCreateMutation.isPending} type="submit">
              Create organization
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
