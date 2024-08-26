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
import { type DomainAddFields } from "@/types/domain.types";
import { domainCreateSchema } from "@/utils/schemas";
import { useDomainAddMutation } from "@/queries/domain.queries";

interface Props extends DialogProps {
  orgId: string;
  onClose: () => void;
}

export function DomainAddDialog({ open, onClose, orgId }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DomainAddFields>({
    resolver: zodResolver(domainCreateSchema),
    defaultValues: {
      orgId,
    },
  });

  const addDomainMutation = useDomainAddMutation();

  const closeModal = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: DomainAddFields) => {
    await addDomainMutation.mutateAsync(data);
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new domain</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Send your form notification emails from a custom domain.
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Domain name"
              {...register("name")}
              placeholder="Domain host e.g. company.com, mail.company.com"
              allowAutoComplete={false}
              error={errors.name !== undefined}
              errorMessage={errors?.name?.message}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={closeModal} type="button">
              Close
            </Button>
            <Button loading={isSubmitting} type="submit">
              Add domain
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
