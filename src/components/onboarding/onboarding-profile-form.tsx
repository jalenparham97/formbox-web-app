"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { nanoid } from "@/libs/nanoid";
import { useFileUploadUrlMutation } from "@/queries/storage.queries";
import { useUser, useUserUpdateMutation } from "@/queries/user.queries";
import type { UserNameFields, UserWithAccounts } from "@/types/user.types";
import { getInitials } from "@/utils/get-initials";
import { UserSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { useDialog } from "@/hooks/use-dialog";
import { useRouter } from "next/navigation";
import { IconUpload } from "@tabler/icons-react";

interface Props {
  initialData?: UserWithAccounts;
}

export function OnboardingProfileForm({ initialData }: Props) {
  const router = useRouter();
  const [logoUploaderOpen, logoUploaderHandler] = useDialog();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserNameFields>({ resolver: zodResolver(UserSchema) });

  const { user } = useUser(initialData);

  const uploadUrlMutation = useFileUploadUrlMutation();
  const userUpdateMutation = useUserUpdateMutation({ showToast: false });

  const onSubmit = async (data: UserNameFields) => {
    try {
      const name = data.name || user?.name;
      await userUpdateMutation.mutateAsync({ name });
      router.push("/onboarding/create-org");
    } catch (error) {
      console.log(error);
    }
  };

  const onFileUpload = async (file: File) => {
    const fileKey = `${user?.id}-${nanoid()}-${file.name}`;
    const { uploadUrl } = await uploadUrlMutation.mutateAsync({
      fileKey,
    });
    if (uploadUrl) {
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "multiport/formdata" },
        body: file,
      });
      await userUpdateMutation.mutateAsync({
        image: `${env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL}/${fileKey}`,
      });
    }
  };

  const onUrlUpload = async (url: string) => {
    await userUpdateMutation.mutateAsync({
      image: url,
    });
  };

  return (
    <div>
      <form className="max-w-md" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="">
            <label
              htmlFor="photo"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Photo
            </label>
            <div className="mt-2 flex items-center gap-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="uppercase text-white">
                  {getInitials(user?.name, 1) || getInitials(user?.email, 1)}
                </AvatarFallback>
              </Avatar>

              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={logoUploaderHandler.open}
                  leftIcon={<IconUpload size={16} />}
                >
                  {user?.image ? "Change" : "Upload"}
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Input
              label="Full name"
              defaultValue={user?.name || ""}
              {...register("name")}
              error={errors?.name !== undefined}
              errorMessage={errors?.name?.message}
            />
          </div>

          <div className="">
            <Input
              label="Email address"
              value={user?.email || ""}
              disabled
              className=""
            />
          </div>
        </div>
        <div className="mt-10">
          <Button
            type="submit"
            loading={userUpdateMutation.isPending}
            className="w-full"
          >
            Continue
          </Button>
        </div>
      </form>

      <ImageUploader
        open={logoUploaderOpen}
        onClose={logoUploaderHandler.close}
        submit={onUrlUpload}
        onUpload={onFileUpload}
        showUnsplash={false}
      />
    </div>
  );
}
