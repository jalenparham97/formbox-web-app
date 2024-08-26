"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
} from "@/components/ui/dialog";
import { useApiKeyUpdateMutation } from "@/queries/api-keys.queries";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/utils/tailwind-helpers";
import { type ApiKeysOutput } from "@/types/api-key.types";
import { API_SCOPES } from "@/utils/constants";

const schema = z.object({
  name: z.string().min(1, "Name is a required field."),
  scope: z.string().min(1, "Please select an access permission."),
});

interface Props extends DialogProps {
  apiKey: ApiKeysOutput[0];
  onClose: () => void;
  orgId: string;
}

export function OrgApiKeyEditDialog({ apiKey, open, onClose, orgId }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const apiKeyUpdateMutation = useApiKeyUpdateMutation(orgId);

  const closeModal = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await apiKeyUpdateMutation.mutateAsync({
      name: data.name,
      scope: data.scope,
      id: apiKey.id,
    });
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update API key</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="space-y-6">
            <div>
              <Input
                label="Name"
                {...register("name")}
                defaultValue={apiKey.name || ""}
                error={errors.name !== undefined}
                errorMessage={errors?.name?.message}
                allowAutoComplete={false}
              />
            </div>
            <div>
              <Controller
                rules={{
                  required: {
                    value: true,
                    message: `Access permissions is required`,
                  },
                }}
                control={control}
                name="scope"
                defaultValue={apiKey.scopes[0]}
                render={({ field: { onChange } }) => (
                  <div>
                    <Label>Permissions</Label>
                    <Select
                      onValueChange={onChange}
                      defaultValue={apiKey.scopes[0]}
                    >
                      <SelectTrigger
                        className={cn(
                          "mt-[5px]",
                          errors["scope"]?.message &&
                            "accent-color border-red-500 focus:!border-red-500",
                        )}
                      >
                        <SelectValue placeholder="Select an access permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={API_SCOPES.api.read}>
                          Read access - Read only
                        </SelectItem>
                        <SelectItem value={API_SCOPES.api.full}>
                          Full access - Read and write
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors["scope"]?.message && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors["scope"]?.message as string}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <DialogFooter className="mt-8 space-y-2 sm:space-y-0">
            <Button
              variant="outline"
              className="mt-2 sm:mt-0"
              onClick={closeModal}
              type="button"
            >
              Close
            </Button>
            <Button loading={apiKeyUpdateMutation.isPending} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
