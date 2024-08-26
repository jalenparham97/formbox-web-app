"use client";

import { useAuthUser } from "@/queries/user.queries";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { useOrgMemberRole } from "@/queries/org.queries";
import {
  useDomainById,
  useDomainVerifyMutation,
} from "@/queries/domain.queries";
import { ViewAlert } from "@/components/ui/viewer-alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconCheck, IconCopy } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DomainActionsMenu } from "@/components/domains/domain-actions-menu";
import { type DomainOutput } from "@/types/domain.types";
import { formatDate } from "@/utils/format-date";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useClipboard } from "@/hooks/use-clipboard";
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

interface Props {
  id: string;
  orgId: string;
}

export function DomainView({ id, orgId }: Props) {
  const { copy, copied } = useClipboard();
  const user = useAuthUser();
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);
  const domain = useDomainById(id);

  const verifyMutation = useDomainVerifyMutation(orgId);

  const handleVerify = async () => {
    await verifyMutation.mutateAsync({ id });
  };

  return (
    <MaxWidthWrapper className="py-10">
      {userRole?.role === "viewer" && (
        <div className="mb-6">
          <ViewAlert />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {domain.isLoading && (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href={`/dashboard/${orgId}/domains`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <IconArrowLeft size={16} />
                  </Button>
                </Link>
                <Skeleton className="h-[32px] w-64 rounded-lg shadow-sm" />
              </div>
            </div>
          )}
          {!domain.isLoading && (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href={`/dashboard/${orgId}/domains`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <IconArrowLeft size={16} />
                  </Button>
                </Link>
                <h1 className="text-xl font-semibold sm:text-2xl">
                  {domain?.data?.name}
                </h1>
              </div>
            </div>
          )}
        </div>

        {!domain.isLoading && (
          <div className="flex items-center space-x-4">
            {domain?.data?.status !== "verified" && (
              <Button
                onClick={handleVerify}
                loading={verifyMutation.isPending}
                variant={
                  domain?.data?.status === "not_started" ? "default" : "outline"
                }
              >
                {domain?.data?.status === "not_started"
                  ? "Verify DNS Records"
                  : "Refresh"}
              </Button>
            )}
            <DomainActionsMenu domain={domain?.data as DomainOutput} />
          </div>
        )}
      </div>

      <div className="mt-12">
        {domain?.isLoading && (
          <div className="flex items-center space-x-10">
            <Skeleton className="h-[48px] w-40 rounded-xl" />
            <Skeleton className="h-[48px] w-40 rounded-xl" />
          </div>
        )}

        {!domain.isLoading && (
          <div className="flex items-center space-x-10">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-gray-900">
                Created
              </p>
              <p className="text-sm text-gray-600">
                {formatDate(domain?.data?.createdAt as Date)}
              </p>
            </div>
            <div className="space-y-2 ">
              <p className="text-xs font-semibold uppercase text-gray-900">
                Status
              </p>
              <Badge
                variant={
                  domain?.data?.status &&
                  getDomainBadgeVariant(domain?.data?.status)
                }
              >
                {domain?.data?.status &&
                  getDomainBadgeText(domain?.data?.status)}
              </Badge>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12">
        {domain?.isLoading && (
          <Skeleton className="h-[330px] w-full rounded-xl" />
        )}

        {!domain.isLoading && (
          <Card className="p-10">
            <div>
              <p className="text-2xl font-semibold">DNS Records</p>
            </div>

            <div className="mt-8 w-full">
              <table className="min-w-full border-separate border-spacing-0 border-none text-left">
                <thead className="h-10 rounded-md bg-gray-100">
                  <tr className="">
                    <th className="h-8 border-b border-t border-gray-200 px-3 text-xs font-semibold text-gray-700 first:rounded-l-md first:border-l last:rounded-r-md last:border-r md:w-[270px]">
                      Hostname
                    </th>
                    <th className="h-8 border-b border-t border-gray-200 px-3 text-xs font-semibold text-gray-700 first:rounded-l-md first:border-l last:rounded-r-md last:border-r md:w-[70px]">
                      Type
                    </th>
                    <th className="h-8 border-b border-t border-gray-200 px-3 text-xs font-semibold text-gray-700 first:rounded-l-md first:border-l last:rounded-r-md last:border-r md:w-[100px]">
                      TTL
                    </th>
                    <th className="h-8 border-b border-t border-gray-200 px-3 text-xs font-semibold text-gray-700 first:rounded-l-md first:border-l last:rounded-r-md last:border-r md:w-[270px]">
                      Value
                    </th>
                    <th className="h-8 border-b border-t border-gray-200 px-3 text-xs font-semibold text-gray-700 first:rounded-l-md first:border-l last:rounded-r-md last:border-r">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {domain?.data?.records.map((record, index) => (
                    <tr key={index}>
                      <td className="h-12 truncate border-b border-gray-200 px-3 py-2 text-sm">
                        <button
                          className="focus-visible:ring-slate-7 disabled:hover:bg-slate-1 group -ml-2 inline-flex h-6 cursor-pointer select-none items-center justify-center gap-1 rounded border border-none pl-2 pr-2 text-xs font-semibold transition duration-200 ease-in-out focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
                          onClick={() => copy(record.name)}
                        >
                          <span className="block max-w-[200px] truncate text-sm font-normal text-gray-600">
                            {record.name}
                          </span>
                          <span className="opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
                            {copied ? (
                              <IconCheck size={18} className="text-green-600" />
                            ) : (
                              <IconCopy size={16} className="text-gray-600" />
                            )}
                          </span>
                        </button>
                      </td>
                      <td className="h-10 truncate border-b border-gray-200 px-3 py-2 text-sm text-gray-600">
                        {record.type}
                      </td>
                      <td className="h-10 truncate border-b border-gray-200 px-3 py-2 text-sm text-gray-600">
                        {record.ttl}
                      </td>
                      <td className="h-10 truncate border-b border-gray-200 px-3 py-2 text-sm">
                        <button
                          className="focus-visible:ring-slate-7 disabled:hover:bg-slate-1 group -ml-2 inline-flex h-6 cursor-pointer select-none items-center justify-center gap-1 rounded border border-none pl-2 pr-2 text-xs font-semibold transition duration-200 ease-in-out focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
                          onClick={() =>
                            copy(
                              record.type === "MX"
                                ? `${record.priority} ${record.value}`
                                : record.value,
                            )
                          }
                        >
                          <span className="block max-w-[200px] truncate text-sm font-normal text-gray-600">
                            {record.type === "MX"
                              ? `${record.priority} ${record.value}`
                              : record.value}
                          </span>
                          <span className="opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
                            {copied ? (
                              <IconCheck size={18} className="text-green-600" />
                            ) : (
                              <IconCopy size={16} className="text-gray-600" />
                            )}
                          </span>
                        </button>
                      </td>
                      <td className="h-10 truncate border-b border-gray-200 px-3 py-2 text-sm">
                        <span className="flex items-center gap-2">
                          <Badge
                            variant={
                              record.status &&
                              getDomainBadgeVariant(record.status)
                            }
                          >
                            {record.status && getDomainBadgeText(record.status)}
                          </Badge>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </MaxWidthWrapper>
  );
}
