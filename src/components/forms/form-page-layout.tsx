"use client";

import Link from "next/link";
import {
  IconArrowLeft,
  IconExternalLink,
  IconPencil,
} from "@tabler/icons-react";
import { NavTabs, NavTab } from "@/components/ui/nav-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { Badge } from "@/components/ui/badge";
import { useFormById } from "@/queries/form.queries";
import { useOrgMemberRole } from "@/queries/org.queries";
import { useAuthUser } from "@/queries/user.queries";
import { ViewAlert } from "../ui/viewer-alert";

interface Props {
  children: React.ReactNode;
  orgId: string;
  formId: string;
}

export function FormPageLayout({ children, formId, orgId }: Props) {
  const user = useAuthUser();
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);
  const form = useFormById({ id: formId, orgId });

  return (
    <MaxWidthWrapper className="pb-20 pt-10">
      {userRole?.role === "viewer" && (
        <div className="mb-6">
          <ViewAlert />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {form.isLoading && (
            <div className="flex w-full items-center justify-between">
              <Skeleton className="h-[32px] w-64 rounded-lg shadow-sm" />
            </div>
          )}
          {!form.isLoading && (
            <div className="">
              <Link href={`/dashboard/${orgId}/forms`} className="sm:hidden">
                <Button
                  variant="secondary"
                  size="icon"
                  className="mb-2 h-8 w-8"
                >
                  <IconArrowLeft size={16} />
                </Button>
              </Link>
              <div className="flex items-center md:space-x-3">
                <Link
                  href={`/dashboard/${orgId}/forms`}
                  className="hidden sm:block"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <IconArrowLeft size={16} />
                  </Button>
                </Link>
                <h1 className="text-xl font-semibold sm:text-2xl">
                  {form?.data?.name}
                </h1>
                <div className="hidden space-x-2 sm:inline-block">
                  {!form?.data?.isClosed && (
                    <Badge variant="green">Active</Badge>
                  )}
                  {form?.data?.isClosed && <Badge variant="red">Closed</Badge>}
                  {form?.data?.type === "hosted" && (
                    <Badge variant="yellow">Hosted</Badge>
                  )}
                  {form?.data?.type === "endpoint" && (
                    <Badge variant="blue">Endpoint</Badge>
                  )}
                </div>
              </div>
              <div className="mt-2 space-x-2 sm:hidden">
                {!form?.data?.isClosed && <Badge variant="green">Active</Badge>}
                {form?.data?.isClosed && <Badge variant="red">Closed</Badge>}
                {form?.data?.type === "hosted" && (
                  <Badge variant="yellow">Hosted</Badge>
                )}
                {form?.data?.type === "endpoint" && (
                  <Badge variant="blue">Endpoint</Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {form?.data?.type === "hosted" && (
          <>
            <div className="hidden space-x-2 sm:block">
              <Link
                href={`/forms/${formId}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button
                  variant="outline"
                  leftIcon={<IconExternalLink size={16} />}
                >
                  Open form
                </Button>
              </Link>
              <Link href={`/dashboard/${orgId}/forms/${formId}/build`}>
                <Button variant="default" leftIcon={<IconPencil size={16} />}>
                  Edit
                </Button>
              </Link>
            </div>

            <div className="space-x-2 sm:hidden">
              <Link
                href={`/forms/${formId}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button variant="outline" size={"icon"}>
                  <IconExternalLink size={16} />
                </Button>
              </Link>
              <Link href={`/dashboard/${orgId}/forms/${formId}/build`}>
                <Button variant="default" size={"icon"}>
                  <IconPencil size={16} />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <NavTabs className="">
          {/* <NavTab
            href={`/dashboard/${orgId}/forms/${formId}`}
            label="Summary"
          /> */}
          <NavTab
            href={`/dashboard/${orgId}/forms/${formId}`}
            label="Submissions"
          />
          {form?.data?.type === "endpoint" && (
            <NavTab
              href={`/dashboard/${orgId}/forms/${formId}/setup`}
              label="Setup"
            />
          )}
          {form?.data?.type === "hosted" && (
            <NavTab
              href={`/dashboard/${orgId}/forms/${formId}/share`}
              label="Share"
            />
          )}
          <NavTab
            href={`/dashboard/${orgId}/forms/${formId}/integrations`}
            label="Integrations"
          />
          <NavTab
            href={`/dashboard/${orgId}/forms/${formId}/settings`}
            label="Settings"
          />
        </NavTabs>

        <div className="pt-6">{children}</div>
      </div>
    </MaxWidthWrapper>
  );
}
