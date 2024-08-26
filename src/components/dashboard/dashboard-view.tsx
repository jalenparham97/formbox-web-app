"use client";

import { useDialog } from "@/hooks/use-dialog";
import {
  IconClipboardText,
  IconFileDescription,
  IconInbox,
  IconPlus,
} from "@tabler/icons-react";
import { isEmpty } from "radash";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/ui/empty-state";
import { PageTitle } from "@/components/ui/page-title";
import { SearchInput } from "@/components/ui/search-input";
import { useDebouncedState } from "@/hooks/use-debounced-state";
import { Button } from "@/components/ui/button";
import { useOrgById, useOrgMemberRole } from "@/queries/org.queries";
import { Badge } from "@/components/ui/badge";
import { FormCreateDialog } from "../forms/form-create-dialog";
import { useInfiniteForms } from "@/queries/form.queries";
import {
  type FormsOutput,
  type FormOutput,
  type InfiniteFormsData,
} from "@/types/form.types";
import { Skeleton } from "@/components/ui/skeleton";
import { FormCardActionsMenu } from "../forms/form-card-actions-menu";
import { LimitReachedModal } from "@/components/ui/limit-reached-modal";
import { useAuthUser } from "@/queries/user.queries";
import { AdminRequiredTooltip } from "@/components/ui/admin-required-tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const loadingItems = new Array(5).fill("");

export const formatForms = (forms: InfiniteFormsData) => {
  let data: FormsOutput["data"][0][] = [];
  if (forms) {
    for (const page of forms.pages) {
      data = [...data, ...page.data];
    }
    return data.map((form) => ({
      ...form,
    }));
  }
  return data;
};

interface Props {
  orgId: string;
}

export function DashboardView({ orgId }: Props) {
  const { ref, inView } = useInView();
  const [searchString, setSearchString] = useDebouncedState("", 250);
  const [formCreateDialog, formCreateDialogHandler] = useDialog();
  const [limitReachedModal, limitReachedModalHandlers] = useDialog();
  const [formType, setFormType] = useState("all");

  const user = useAuthUser();

  const org = useOrgById(orgId);
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);

  const forms = useInfiniteForms({ orgId, searchString, type: formType });

  useEffect(() => {
    if (forms.hasNextPage && inView) {
      forms.fetchNextPage();
    }
  }, [inView, forms]);

  const data = useMemo(() => formatForms(forms.data), [forms.data]);

  const openCreateFormModal = () => {
    return formCreateDialogHandler.open();
  };

  const noSearchResults = isEmpty(data) && !isEmpty(searchString);

  return (
    <MaxWidthWrapper className="py-10">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <PageTitle>Forms</PageTitle>
          <div>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={openCreateFormModal}
              disabled={userRole?.role === "viewer"}
            >
              Create form
            </Button>
          </div>
        </div>
        <div className="mt-6 flex items-center space-x-2">
          <div className="w-full">
            <SearchInput
              placeholder="Search forms"
              defaultValue={searchString}
              onChange={(event) => setSearchString(event.currentTarget.value)}
              className="w-full"
            />
          </div>
          <Select defaultValue="all" onValueChange={setFormType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Form type</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="hosted">Hosted</SelectItem>
                <SelectItem value="endpoint">Endpoint</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {forms?.isLoading && (
        <div className="mt-6 space-y-4">
          {loadingItems.map((_, index) => (
            <Skeleton key={index} className="h-[78px] w-full rounded-xl" />
          ))}
        </div>
      )}

      {!forms.isLoading && (
        <>
          <div className="mt-6 space-y-4">
            {!isEmpty(data) && (
              <>
                {data?.map((form) => (
                  <div key={form?.id}>
                    <Card className="border border-gray-200 p-3 shadow-sm hover:border-gray-300 md:p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <Link href={`/dashboard/${orgId}/forms/${form?.id}`}>
                            <p className="truncate text-xl font-semibold">
                              {form?.name}
                            </p>
                          </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-6">
                            <div className="hidden items-center space-x-1 text-gray-600 md:flex">
                              <IconInbox size={18} />{" "}
                              <span>{form?._count?.submissions}</span>
                            </div>
                            <div className="hidden space-x-2 sm:inline-block">
                              {!form?.isClosed && (
                                <Badge variant="green">Active</Badge>
                              )}
                              {form?.isClosed && (
                                <Badge variant="red">Closed</Badge>
                              )}
                              {form?.type === "hosted" && (
                                <Badge variant="yellow">Hosted</Badge>
                              )}
                              {form?.type === "endpoint" && (
                                <Badge variant="blue">Endpoint</Badge>
                              )}
                            </div>
                          </div>
                          <FormCardActionsMenu
                            form={form as FormOutput}
                            disabled={userRole?.role === "viewer"}
                          />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between sm:hidden">
                        <div className="space-x-2">
                          {!form?.isClosed && (
                            <Badge variant="green">Active</Badge>
                          )}
                          {form?.isClosed && (
                            <Badge variant="red">Closed</Badge>
                          )}
                          {form?.type === "hosted" && (
                            <Badge variant="yellow">Hosted</Badge>
                          )}
                          {form?.type === "endpoint" && (
                            <Badge variant="blue">Endpoint</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <IconInbox size={18} />{" "}
                          <span>{form?._count?.submissions}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </>
            )}
          </div>

          {isEmpty(data) && !noSearchResults && (
            <div className="mt-6 rounded-xl border border-gray-300 p-44">
              <EmptyState
                title="No forms yet"
                subtitle="Get started by creating a new form."
                icon={<IconFileDescription size={40} />}
                actionButton={
                  <>
                    {userRole?.role === "viewer" ? (
                      <AdminRequiredTooltip message="You need to be a Admin or Member to create a form">
                        <Button
                          leftIcon={<IconPlus size={16} />}
                          onClick={openCreateFormModal}
                          disabled
                        >
                          Create form
                        </Button>
                      </AdminRequiredTooltip>
                    ) : (
                      <Button
                        leftIcon={<IconPlus size={16} />}
                        onClick={openCreateFormModal}
                      >
                        Create form
                      </Button>
                    )}
                  </>
                }
              />
            </div>
          )}
        </>
      )}

      {!forms?.isLoading && noSearchResults && (
        <div className="mt-6 rounded-xl border border-gray-300 p-44">
          <EmptyState
            title="No search results"
            subtitle="Please check the spelling or filter criteria"
            icon={<IconClipboardText size={40} />}
          />
        </div>
      )}

      <div ref={ref} className="flex items-center justify-center">
        {forms.isFetchingNextPage && <Loader className="mt-5" />}
      </div>

      <FormCreateDialog
        open={formCreateDialog}
        onClose={formCreateDialogHandler.close}
        orgId={orgId}
      />

      <LimitReachedModal
        title="You have reached your forms limit"
        description="Please upgrade your account to create more forms."
        open={limitReachedModal}
        onClose={limitReachedModalHandlers.close}
        href={`/dashboard/${orgId}/settings/subscription`}
      />
    </MaxWidthWrapper>
  );
}
