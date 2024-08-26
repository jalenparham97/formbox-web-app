"use client";

import { IconPlus, IconWorld } from "@tabler/icons-react";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { PageTitle } from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/queries/user.queries";
import { useOrgMemberRole } from "@/queries/org.queries";
import { DomainAddDialog } from "./domain-add-dialog";
import { useDialog } from "@/hooks/use-dialog";
import { useInfiniteDomains } from "@/queries/domain.queries";
import { useInView } from "react-intersection-observer";
import { useDebouncedState } from "@/hooks/use-debounced-state";
import { useEffect, useMemo } from "react";
import {
  type DomainsOutput,
  type InfiniteDomainsData,
} from "@/types/domain.types";
import { isEmpty } from "radash";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../ui/empty-state";
import { AdminRequiredTooltip } from "../ui/admin-required-tooltip";
import { Card } from "../ui/card";
import Link from "next/link";
import { Loader } from "../ui/loader";
import { SearchInput } from "../ui/search-input";
import { cn } from "@/utils/tailwind-helpers";
import { DomainCardActionsMenu } from "./domain-card-actions-menu";
import { Badge } from "../ui/badge";
import { type DomainStatus } from "@prisma/client";

function getDomainBadgeVariant(status: DomainStatus) {
  if (status === "verified") {
    return "green";
  }

  if (status === "not_started") {
    return "gray";
  }

  if (status === "pending") {
    return "yellow";
  }

  return "red";
}

function getDomainBadgeText(status: DomainStatus) {
  if (status === "verified") {
    return "Verified";
  }

  if (status === "not_started") {
    return "Verification not started";
  }

  if (status === "pending") {
    return "Pending verification";
  }

  return "Verification failed";
}

const loadingItems = new Array(5).fill("");

export const formatDomains = (domains: InfiniteDomainsData) => {
  let data: DomainsOutput["data"][0][] = [];
  if (domains) {
    for (const page of domains.pages) {
      data = [...data, ...page.data];
    }
    return data.map((domain) => ({
      ...domain,
    }));
  }
  return data;
};

interface Props {
  orgId: string;
}

export function DomainsView({ orgId }: Props) {
  const { ref, inView } = useInView();
  const [domainAddDialog, domainAddDialogHandler] = useDialog();
  const [searchString, setSearchString] = useDebouncedState("", 250);

  const user = useAuthUser();
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);

  const domains = useInfiniteDomains({ orgId, searchString });

  useEffect(() => {
    if (domains.hasNextPage && inView) {
      domains.fetchNextPage();
    }
  }, [inView, domains]);

  const data = useMemo(() => formatDomains(domains.data), [domains.data]);

  const noSearchResults = isEmpty(data) && !isEmpty(searchString);

  return (
    <MaxWidthWrapper className="py-10">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <PageTitle>Domains</PageTitle>
          <div>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={domainAddDialogHandler.open}
              disabled={userRole?.role === "viewer"}
            >
              Add domain
            </Button>
          </div>
        </div>
        <div className="mt-6">
          <SearchInput
            placeholder="Search domains"
            defaultValue={searchString}
            onChange={(event) => setSearchString(event.currentTarget.value)}
            className="w-full"
          />
        </div>
      </div>

      {domains?.isLoading && (
        <div className="mt-6 space-y-4">
          {loadingItems.map((_, index) => (
            <Skeleton key={index} className="h-[78px] w-full rounded-xl" />
          ))}
        </div>
      )}

      {!domains.isLoading && (
        <>
          <div className="mt-6 space-y-4">
            {!isEmpty(data) && (
              <>
                {data?.map((domain) => (
                  <div key={domain?.id}>
                    <Card className="border border-gray-200 p-5 shadow-sm hover:border-gray-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <Link
                            href={`/dashboard/${orgId}/domains/${domain.id}`}
                          >
                            <p className="text-xl font-semibold">
                              {domain?.name}
                            </p>
                          </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={getDomainBadgeVariant(domain.status)}
                            >
                              {getDomainBadgeText(domain.status)}
                            </Badge>
                          </div>
                          <DomainCardActionsMenu
                            domain={domain}
                            disabled={userRole?.role === "viewer"}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </>
            )}
          </div>

          {isEmpty(data) && !noSearchResults && (
            <div className="mt-6 rounded-xl border border-gray-300 p-28">
              <EmptyState
                title="No domains yet"
                subtitle="Get started by adding a new domain."
                icon={<IconWorld size={40} />}
                actionButton={
                  <>
                    {userRole?.role === "viewer" ? (
                      <AdminRequiredTooltip message="You need to be an Admin or Member to add a domain">
                        <Button
                          leftIcon={<IconPlus size={16} />}
                          onClick={domainAddDialogHandler.open}
                          disabled
                        >
                          Add domain
                        </Button>
                      </AdminRequiredTooltip>
                    ) : (
                      <Button
                        leftIcon={<IconPlus size={16} />}
                        onClick={domainAddDialogHandler.open}
                      >
                        Add domain
                      </Button>
                    )}
                  </>
                }
              />
            </div>
          )}
        </>
      )}

      {!domains?.isLoading && noSearchResults && (
        <div className="mt-6 rounded-xl border border-gray-300 p-28">
          <EmptyState
            title="No search results"
            subtitle="Please check the spelling or filter criteria"
            icon={<IconWorld size={40} />}
          />
        </div>
      )}

      <div ref={ref} className="flex items-center justify-center">
        {domains.isFetchingNextPage && <Loader className="mt-5" />}
      </div>

      <DomainAddDialog
        open={domainAddDialog}
        onClose={domainAddDialogHandler.close}
        orgId={orgId}
      />
    </MaxWidthWrapper>
  );
}
