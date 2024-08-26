"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { type OrgCreateFields } from "@/types/org.types";
import { OrgCreateSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useOrgAddMutation } from "@/queries/org.queries";

export function OnboardingOrgCreateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrgCreateFields>({ resolver: zodResolver(OrgCreateSchema) });

  const orgCreateMutation = useOrgAddMutation();

  const onSubmit = async (data: OrgCreateFields) => {
    await orgCreateMutation.mutateAsync({ name: data.name });
  };

  return (
    <div>
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

        <div className="mt-10">
          <Button
            type="submit"
            loading={orgCreateMutation.isPending}
            className="w-full"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
