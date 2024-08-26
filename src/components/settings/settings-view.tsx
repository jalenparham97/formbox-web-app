"use client";

import { useAuthUser, useUserUpdateMutation } from "@/queries/user.queries";
import { PageTitle } from "../ui/page-title";
import { type UserNameFields } from "@/types/user.types";
import { UserSchema } from "@/utils/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFileDeleteMutation,
  useFileUploadUrlMutation,
} from "@/queries/storage.queries";
import { nanoid } from "@/libs/nanoid";
import { env } from "@/env";
import { useDialog } from "@/hooks/use-dialog";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";
import { Divider } from "../ui/divider";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { ImageUploader } from "../ui/image-uploader";
import { IconArrowLeft, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { SettingsChangeEmailDialog } from "./settings-change-email-dialog";
import { api } from "@/trpc/react";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function SettingsView({ searchParams }: Props) {
  const [logoUploaderOpen, logoUploaderHandler] = useDialog();
  const [changeEmailModal, changeEmailModalHandler] = useDialog();
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState(
    (searchParams?.error as string) || "",
  );
  const { register, handleSubmit } = useForm<UserNameFields>({
    resolver: zodResolver(UserSchema),
  });

  const user = useAuthUser();

  const uploadUrlMutation = useFileUploadUrlMutation();
  const deleteFileMutation = useFileDeleteMutation();
  const userUpdateMutation = useUserUpdateMutation();

  const sendEmailVerificationMutation =
    api.user.sendEmailVerificationToken.useMutation({
      onSuccess: () => {
        setShowEmailSent(true);
      },
    });

  const onSubmit = async (data: UserNameFields) => {
    try {
      const name = data.name || user?.name;
      await userUpdateMutation.mutateAsync({ name });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCurrentUserImage = async (
    userImage: string | null | undefined,
  ) => {
    if (!userImage) return;

    if (!userImage.startsWith(env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL)) return;

    const fileKey = userImage.split("/").pop() as string;

    try {
      return await deleteFileMutation.mutateAsync({ fileKey });
    } catch (error) {
      console.log(error);
    }
  };

  const onFileUpload = async (file: File) => {
    await deleteCurrentUserImage(user?.image);

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
    await deleteCurrentUserImage(user?.image);

    await userUpdateMutation.mutateAsync({
      image: url,
    });
  };

  const handleUpdateEmail = async (email: string) => {
    setNewEmail(email);
    await sendEmailVerificationMutation.mutateAsync({ email });
  };

  const isEmailVerificationError =
    emailError?.toLowerCase() === "emailverificationexpired";

  let errorMessage = "";
  let errorMessageTitle = "";

  if (searchParams?.error) {
    errorMessage = isEmailVerificationError
      ? "Email verification links expire after one hour. Please try changing your email again to get a new link."
      : "An error occurred when verifying your email. Please try changing your email again.";

    errorMessageTitle = isEmailVerificationError
      ? "Your link has expired."
      : "Email verification failed.";
  }

  return (
    <MaxWidthWrapper className="py-10">
      <header className="mx-auto">
        <Link className="sm:hidden" href="/organizations">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<IconArrowLeft size={16} />}
          >
            Organizations
          </Button>
        </Link>
        <div className="mt-4 flex items-center justify-between sm:mt-0">
          <PageTitle>Settings</PageTitle>
        </div>
      </header>

      <div className="flexitems-center mt-6 justify-between">
        <div className="w-full space-y-8">
          <Card className="w-full">
            <div className="p-6">
              <div>
                <h2 className="text-lg font-semibold">Avatar</h2>
                <p className="mt-2 max-w-[600px] text-gray-600">
                  This is your avatar. Click on the upload button to add a new
                  photo.
                </p>
                <div className="mt-6 flex items-center gap-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="uppercase text-white">
                      {getInitials(user?.name, 1) ||
                        getInitials(user?.email, 1)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={logoUploaderHandler.open}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            <div className="p-6">
              <p className="text-gray-600">
                An avatar is optional but strongly recommended.
              </p>
            </div>
          </Card>

          <Card className="w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6">
                <div>
                  <h2 className="text-lg font-semibold">Display name</h2>
                  <p className="mt-2 text-gray-600">
                    Please enter your full name, or a display name you are
                    comfortable with.
                  </p>
                </div>
                <div className="mt-5">
                  {!user && (
                    <Skeleton className="h-[36px] rounded-lg md:w-[420px]" />
                  )}
                  {user && (
                    <Input
                      className="md:w-[420px]"
                      defaultValue={user?.name || ""}
                      {...register("name")}
                    />
                  )}
                </div>
              </div>
              <Divider />
              <div className="p-6">
                <Button type="submit" loading={userUpdateMutation.isPending}>
                  Save changes
                </Button>
              </div>
            </form>
          </Card>

          <Card className="w-full">
            <div className="p-6">
              <div>
                <h2 className="text-lg font-semibold">Email</h2>
                <p className="mt-2 text-gray-600">
                  Please enter the email address you want to use to log in with
                  Formbox.
                </p>
              </div>
              <div className="mt-5">
                {!user && (
                  <Skeleton className="h-[36px] rounded-lg md:w-[420px]" />
                )}
                {user && (
                  <Input
                    className="md:w-[420px]"
                    defaultValue={user?.email || ""}
                    disabled
                  />
                )}
              </div>

              <div className="sm:col-span-5">
                {showEmailSent && (
                  <Alert className="relative mt-6">
                    <AlertTitle>Check your email</AlertTitle>
                    <AlertDescription>
                      <p className="text-gray-900">
                        We&apos;ve sent an email to{" "}
                        <span className="font-semibold">{newEmail}</span>. To
                        verify this change, click the link in the email. The
                        link is valid for 1 hour.
                      </p>
                    </AlertDescription>
                    <Button
                      size="icon"
                      type="button"
                      className="absolute right-1 top-1 h-8 w-8"
                      variant="ghost"
                      onClick={() => setShowEmailSent(false)}
                    >
                      <IconX className="h-4 w-4" />
                    </Button>
                  </Alert>
                )}

                {emailError && (
                  <Alert className="relative mt-6">
                    <AlertTitle>{errorMessageTitle}</AlertTitle>
                    <AlertDescription>
                      <p className="text-gray-900">{errorMessage}</p>
                    </AlertDescription>
                    <Button
                      size="icon"
                      type="button"
                      className="absolute right-1 top-1 h-8 w-8"
                      variant="ghost"
                      onClick={() => setEmailError("")}
                    >
                      <IconX className="h-4 w-4" />
                    </Button>
                  </Alert>
                )}
              </div>
            </div>
            <Divider />
            <div className="p-6">
              <Button type="button" onClick={changeEmailModalHandler.open}>
                Change email
              </Button>
            </div>
          </Card>

          {/* <Card className="w-full">
            <div className="p-6">
              <div>
                <h2 className="text-lg font-semibold">Delete account</h2>
                <p className="mt-2 max-w-[600px] text-gray-600">
                  Permanently delete your account, organizations, workspaces,
                  and all associated forms plus thier submissions. This action
                  cannot be undone - please proceed with caution.
                </p>
              </div>
            </div>
            <Divider />
            <div className="p-6">
              <Button variant="destructive">Delete account</Button>
            </div>
          </Card> */}
        </div>

        <SettingsChangeEmailDialog
          open={changeEmailModal}
          onClose={changeEmailModalHandler.close}
          submit={handleUpdateEmail}
        />

        <ImageUploader
          open={logoUploaderOpen}
          onClose={logoUploaderHandler.close}
          submit={onUrlUpload}
          onUpload={onFileUpload}
          showUnsplash={false}
        />
      </div>
    </MaxWidthWrapper>
  );
}
