"use client";

import { useFormById, useFormUpdateMutation } from "@/queries/form.queries";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  IconApps,
  IconArrowLeft,
  IconDeviceFloppy,
  IconExternalLink,
  IconHammer,
  IconInbox,
  IconSettings,
  IconShare,
} from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/tailwind-helpers";
import { useFormStore } from "@/stores/form.store";
import { useEffect } from "react";
import {
  type FormBorderStyle,
  type FormPageMode,
  type FormOutput,
} from "@/types/form.types";
import { isEmpty, isEqual, pick } from "radash";
import Error from "@/app/dashboard/[orgId]/domains/error";
import { useFileDeleteMutation } from "@/queries/storage.queries";
import { env } from "@/env";

interface Props {
  children: React.ReactNode;
  formId: string;
  orgId: string;
}

export default function FormBuilderLayout({ children, formId, orgId }: Props) {
  const { form, setForm } = useFormStore();
  const formData = useFormById(
    { id: formId, orgId },
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    setForm(formData?.data as FormOutput);
  }, [formData?.data, setForm]);

  const deleteFileMutation = useFileDeleteMutation({
    errorMessaege: "An error occured while trying to update this form.",
  });

  const handleUpdateMutation = useFormUpdateMutation(orgId, {
    showToast: true,
    toastMessage: "Form updated",
  });

  async function handleSave() {
    if (!form) return;
    try {
      if (isEmpty(form?.headerImage)) {
        await deleteImage(formData?.data?.headerImage);
      }
      if (isEmpty(form?.logo)) {
        await deleteImage(formData?.data?.logo);
      }

      const updateData = pick(form, [
        "name",
        "fields",
        "submitButtonText",
        "headerTitle",
        "headerDescription",
        "pageMode",
        "inputBorderStyle",
        "buttonBorderStyle",
        "buttonBackgroundColor",
        "backgroundColor",
        "accentColor",
        "buttonTextColor",
        "textColor",
        "headerImage",
        "logo",
        "tpBackgroundColor",
        "tpButtonBackgroundColor",
        "tpTextColor",
        "tpButtonColor",
        "tpHeader",
        "tpMessage",
        "tpButtonText",
        "tpButtonUrl",
      ]);
      await handleUpdateMutation.mutateAsync({
        id: formId,
        ...updateData,
        pageMode: form.pageMode as FormPageMode,
        buttonBorderStyle: form.buttonBorderStyle as FormBorderStyle,
        inputBorderStyle: form.inputBorderStyle as FormBorderStyle,
      });
    } catch (error) {
      console.log(Error);
      setForm(formData?.data as FormOutput);
    }
  }

  const deleteImage = async (image: string | null | undefined) => {
    if (!image) return;

    if (!image.startsWith(env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL)) return;

    const fileKey = image.split("/").pop() as string;

    try {
      return await deleteFileMutation.mutateAsync({ fileKey });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative h-full">
      <div className="p-4 text-center text-base text-gray-500 md:hidden">
        <p>
          The form builder is not not yet optimnized for mobile. Please use a
          desktop browser to build your form.
        </p>
      </div>
      <div className="fixed z-50 hidden w-full border-y border-gray-200 bg-white md:block">
        <div className="mx-auto px-4">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              {formData.isLoading && (
                <div className="flex items-center">
                  <Skeleton className="h-[32px] w-64 rounded-lg shadow-sm" />
                </div>
              )}
              {!formData.isLoading && (
                <div className="flex items-center">
                  <div className="flex items-center space-x-3">
                    <Link href={`/dashboard/${orgId}/forms/${formId}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <IconArrowLeft size={16} />
                      </Button>
                    </Link>
                    <h1 className="text-xl font-semibold sm:text-2xl">
                      {formData?.data?.name}
                    </h1>
                    <div>
                      {!formData?.data?.isClosed && (
                        <Badge variant="green">Active</Badge>
                      )}
                      {formData?.data?.isClosed && (
                        <Badge variant="red">Closed</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              <div className="">
                <BuilderNavTab
                  href={`/dashboard/${orgId}/forms/${formId}/build`}
                  label="Build"
                  leftIcon={<IconHammer size={16} />}
                />
                <BuilderNavTab
                  href={`/dashboard/${orgId}/forms/${formId}`}
                  label="Submissions"
                  leftIcon={<IconInbox size={16} />}
                />
                <BuilderNavTab
                  href={`/dashboard/${orgId}/forms/${formId}/share`}
                  label="Share"
                  leftIcon={<IconShare size={16} />}
                />
                <BuilderNavTab
                  href={`/dashboard/${orgId}/forms/${formId}/integrations`}
                  label="Integrations"
                  leftIcon={<IconApps size={16} />}
                />
                <BuilderNavTab
                  href={`/dashboard/${orgId}/forms/${formId}/settings`}
                  label="Settings"
                  leftIcon={<IconSettings size={16} />}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Button
                  leftIcon={<IconDeviceFloppy size={16} />}
                  disabled={isEqual(formData.data, form)}
                  loading={handleUpdateMutation.isPending}
                  onClick={handleSave}
                  className="disabled:bg-gray-200 disabled:text-gray-500"
                >
                  Save changes
                </Button>
                <Link
                  href={`/forms/${formId}`}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <Button
                    variant="outline"
                    leftIcon={<IconExternalLink size={16} />}
                  >
                    Open form
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden h-full md:block">{children}</div>
    </div>
  );
}

interface NavTabProps {
  href: string;
  label: string;
  leftIcon?: React.ReactNode;
  [x: string]: unknown;
}

export function BuilderNavTab({ href, label, leftIcon }: NavTabProps) {
  const pathname = usePathname();
  const isRouteMatch = pathname === href;

  return (
    <Link href={href}>
      <button
        className={cn(
          "h-[65px] px-4 py-2 text-sm font-medium hover:bg-gray-100",
          isRouteMatch && "border-b-2 border-gray-900",
        )}
      >
        <div className="flex h-full items-center">
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          <span>{label}</span>
        </div>
      </button>
    </Link>
  );
}
