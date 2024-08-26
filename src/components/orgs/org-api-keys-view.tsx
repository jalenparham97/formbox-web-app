"use client";
import { Card } from "@/components/ui/card";
import { useOrgMemberRole } from "@/queries/org.queries";
import { useAuthUser } from "@/queries/user.queries";
import {
  IconCheck,
  IconCopy,
  IconEye,
  IconEyeOff,
  IconKey,
  IconPlus,
} from "@tabler/icons-react";
import { isEmpty } from "radash";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useApiKeys } from "@/queries/api-keys.queries";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/ui/empty-state";
import { useDialog } from "@/hooks/use-dialog";
import { OrgApiKeyCreateDialog } from "./org-api-key-create-dialog";
import { formatDate } from "@/utils/format-date";
import { ApiKeyActionsMenu } from "@/components/orgs/org-api-key-actions-menu";
import { useToggle } from "@/hooks/use-toggle";
import { useClipboard } from "@/hooks/use-clipboard";
import { ApiKeysOutput } from "@/types/api-key.types";
import Link from "next/link";
import { env } from "@/env";

interface Props {
  orgId: string;
}

export function OrgAPIKeysView({ orgId }: Props) {
  const [apiKeyModal, apiKeyModalHandler] = useDialog();
  const user = useAuthUser();
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);

  const apiKeys = useApiKeys(orgId);

  return (
    <div>
      <Card>
        <div className="flex items-center justify-between space-x-16 px-7 pt-7">
          <div>
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-semibold">API Keys</h3>
            </div>
            <p className="mt-2 text-gray-600">
              These API keys allow other apps to access your forms and
              submissions using our API. Use it with caution - do not share your
              API key with others, or expose it in the browser or other
              client-side code.{" "}
              <Link
                className="text-blue-500 hover:underline hover:underline-offset-4"
                href={`${env.NEXT_PUBLIC_DOCS_URL}/api-reference`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </Link>
            </p>
          </div>
          <div className="hidden md:inline-block">
            {userRole?.role === "viewer" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="cursor-not-allowed">
                    <Button leftIcon={<IconPlus size={16} />} disabled>
                      Create API key
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Only members with the Admin or Member role can create API
                      keys.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {userRole?.role !== "viewer" && (
              <Button
                leftIcon={<IconPlus size={16} />}
                onClick={apiKeyModalHandler.open}
              >
                Create API key
              </Button>
            )}
          </div>
        </div>

        <div className="mt-5 px-7 md:hidden">
          {userRole?.role === "viewer" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="cursor-not-allowed">
                  <Button leftIcon={<IconPlus size={16} />} disabled>
                    Create API key
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Only members with the Admin or Member role can create API
                    keys.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {userRole?.role !== "viewer" && (
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={apiKeyModalHandler.open}
            >
              Create API key
            </Button>
          )}
        </div>

        <Divider className="mt-7" />

        <div>
          {apiKeys.isLoading && (
            <div className="flex items-center justify-center p-12">
              <Loader />
            </div>
          )}

          {!apiKeys.isLoading && (
            <>
              {!isEmpty(apiKeys.data) && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-7">Name</TableHead>
                      <TableHead className="px-7">Key</TableHead>
                      <TableHead className="table-cell px-7">Created</TableHead>
                      <TableHead className="px-7 text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.data?.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="truncate px-7 font-medium">
                          {apiKey.name}
                        </TableCell>
                        <TableCell className="px-7">
                          <ApiKeyTableCell
                            apiKey={apiKey}
                            userRole={userRole?.role}
                          />
                        </TableCell>
                        <TableCell className="table-cell truncate px-7">
                          {formatDate(apiKey.createdAt, "MMM DD, YYYY")}
                        </TableCell>
                        <TableCell className="px-7 text-right">
                          <ApiKeyActionsMenu
                            apiKey={apiKey}
                            disabled={userRole?.role === "viewer"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {isEmpty(apiKeys.data) && (
                <div className="mx-auto w-full px-12 pb-24 pt-16 lg:max-w-2xl">
                  <EmptyState
                    title="No API keys yet"
                    subtitle="Create an API key to access your forms and submissions using our API."
                    icon={<IconKey size={50} className="text-dark-500" />}
                    actionButton={
                      <>
                        {userRole?.role === "viewer" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="cursor-not-allowed">
                                <Button
                                  leftIcon={<IconPlus size={16} />}
                                  disabled
                                >
                                  Create API key
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Only members with the Admin or Member role can
                                  create API keys.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {userRole?.role !== "viewer" && (
                          <Button
                            leftIcon={<IconPlus size={16} />}
                            onClick={apiKeyModalHandler.open}
                          >
                            Create API key
                          </Button>
                        )}
                      </>
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <OrgApiKeyCreateDialog
        open={apiKeyModal}
        onClose={apiKeyModalHandler.close}
        orgId={orgId}
      />
    </div>
  );
}

interface ApiKeyTableCellProps {
  apiKey: ApiKeysOutput[0];
  userRole: string | undefined;
}

function ApiKeyTableCell({ apiKey, userRole }: ApiKeyTableCellProps) {
  const [showApiKey, toggleShowApiKey] = useToggle(false);
  const { copy, copied } = useClipboard();

  return (
    <div className="flex items-center space-x-4">
      <div className="font-mono text-sm">
        {showApiKey ? apiKey.key : apiKey.partialKey}
      </div>
      <div className="flex items-center space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-500"
                onClick={toggleShowApiKey}
                disabled={userRole === "viewer"}
              >
                {showApiKey ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showApiKey ? "Hide" : "View"} API key</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-500"
                onClick={() => copy(apiKey.key)}
                disabled={userRole === "viewer"}
              >
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy API key"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
