"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import {
  type IntegrationOutput,
  type IntegrationType,
} from "@/types/integration.types";
import { createConnection } from "@/libs/nango/client";

import GoogleSheetLogo from "@/images/google-sheets-logo.svg";
import ExcelLogo from "@/images/excel-logo.svg";
import AirTableLogo from "@/images/airtable-logo.svg";
import NotionLogo from "@/images/notion-logo.svg";
import SlackLogo from "@/images/slack-logo.svg";
import MailChimpLogo from "@/images/mailchimp-logo.svg";
import WebhookLogo from "@/images/webhooks-logo.svg";
import ZapierLogo from "@/images/zapier-logo.svg";
import {
  useIntegrationAddMutation,
  useIntegrationUpdateMutation,
  useIntegrations,
} from "@/queries/integration.queries";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuthUser } from "@/queries/user.queries";
import { useOrgById, useOrgMemberRole } from "@/queries/org.queries";
import { useIntegrationStore } from "@/stores/integrations.store";
import { Skeleton } from "@/components/ui/skeleton";
import { type OrgOutput } from "@/types/org.types";
import { IntegrationCardActionsMenu } from "@/components/integrations/integration-card-actions-menu";
import { AirtableIntegrationCardActionsMenu } from "@/components/integrations/airtable/airtable-integration-card-actions-menu";
import { GoogleSheetActionsMenu } from "@/components/integrations/google-sheets/sheets-integration-card-actions-menu";
import { WebhookManageIntegrationDialog } from "../integrations/webhook/webhook-manage-integration-dialog";
import { toast } from "sonner";
import { ExcelIntegrationCardActionsMenu } from "../integrations/excel/excel-integration-card-actions-menu";

const loadingItems = Array.from({ length: 6 });
interface Props {
  orgId: string;
  formId: string;
}

export function FormIntegrationsView({ orgId, formId }: Props) {
  const user = useAuthUser();
  const integrationStore = useIntegrationStore();
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);

  const org = useOrgById(orgId);
  const { data: connectedIntegrations, isLoading } = useIntegrations(formId);

  const integrations = useMemo(() => {
    return [
      {
        id: "google-sheets",
        name: "Google Sheets",
        description: "Send submissions to a spreadsheet.",
        image: GoogleSheetLogo,
        class: "w-8",
        comingSoon: false,
      },
      {
        id: "excel",
        name: "Microsoft Excel",
        description: "Send submissions to a spreadsheet.",
        image: ExcelLogo,
        class: "w-12",
        comingSoon: false,
      },
      {
        id: "airtable",
        name: "Airtable",
        description: "Send submissions to Airtable.",
        image: AirTableLogo,
        class: "w-10",
        comingSoon: false,
      },
      {
        id: "webhook",
        name: "Webhook",
        description: "Send webhook requests for submissions.",
        image: WebhookLogo,
        class: "w-10 rounded-lg",
        comingSoon: false,
      },
      {
        id: "mailchimp",
        name: "Mailchimp",
        description: "Add responses as subscribers in Mailchimp",
        image: MailChimpLogo,
        class: "w-10",
        comingSoon: false,
      },
      {
        id: "slack",
        name: "Slack",
        description: "Send Slack messages for new submissions.",
        image: SlackLogo,
        class: "w-10",
        comingSoon: false,
      },
      {
        id: "notion",
        name: "Notion",
        description: "Send submissions to Notion.",
        image: NotionLogo,
        class: "w-10",
        comingSoon: true,
      },
      {
        id: "zapier",
        name: "Zapier",
        description: "Send submissions to all your favorite apps.",
        image: ZapierLogo,
        class: "w-10 rounded-lg",
        comingSoon: true,
      },
    ];
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Integrations</h3>
          <p className="mt-2 max-w-lg text-gray-600">
            Make Formbox even more powerful by using these tools. Check out our
            roadmap for upcoming integrations and to request new ones.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-2 xl:grid-cols-3">
          {isLoading && (
            <>
              {loadingItems.map((_, index) => (
                <Skeleton key={index} className="h-[200px] w-full rounded-xl" />
              ))}
            </>
          )}

          {!isLoading && (
            <>
              {integrations.map((integration) => (
                <IntegrationCard
                  key={integration.name}
                  type={integration.id as IntegrationType}
                  name={integration.name}
                  description={integration.description}
                  image={integration.image}
                  className={integration.class}
                  formId={formId}
                  orgId={orgId}
                  comingSoon={integration.comingSoon}
                  isConnected={connectedIntegrations?.data.some(
                    (i) => i.type === integration.id,
                  )}
                  userRole={userRole?.role}
                  org={org?.data as OrgOutput}
                  connectedIntegration={connectedIntegrations?.data.find(
                    (i) => i.type === integration.id,
                  )}
                  totalIntegrations={connectedIntegrations?.total}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <WebhookManageIntegrationDialog
        open={integrationStore.webhook.isOpen}
        onClose={integrationStore.webhook.close}
        integration={connectedIntegrations?.data.find(
          (integration) => integration.type === "webhook",
        )}
        orgId={orgId}
        formId={formId}
      />
    </div>
  );
}

interface IntegrationCardProps {
  type: IntegrationType;
  name: string;
  description: string;
  image: string;
  className: string;
  formId: string;
  orgId: string;
  isConnected?: boolean;
  comingSoon?: boolean;
  connectedIntegration?: IntegrationOutput;
  totalIntegrations?: number;
  userRole?: string;
  org: OrgOutput;
}

function IntegrationCard({
  type,
  name,
  description,
  image,
  className,
  formId,
  orgId,
  org,
  isConnected,
  comingSoon,
  connectedIntegration,
  userRole,
  totalIntegrations = 0,
}: IntegrationCardProps) {
  const [isEnabled, setIsEnabled] = useState<boolean | undefined>(false);
  const integrationStore = useIntegrationStore();

  useEffect(() => {
    setIsEnabled(connectedIntegration?.isEnabled);
  }, [connectedIntegration?.isEnabled]);

  const createMutation = useIntegrationAddMutation();
  const updateMutation = useIntegrationUpdateMutation();

  async function handleConnect() {
    const orgPlan = org?.stripePlan || "free";

    if (orgPlan === "free" && totalIntegrations === 2) {
      toast.error("You can only connect up to 2 integrations.");
      return;
    }

    if (type === "webhook") {
      integrationStore.webhook.open();
      return;
    }

    const { connection, error } = await createConnection(type, formId);

    if (error) return;

    const integration = await createMutation.mutateAsync({
      formId,
      orgId,
      type,
      connectionId: connection?.connectionId as string,
    });

    if (type === "slack") {
      integrationStore.slack.open();
    }
    if (type === "airtable") {
      integrationStore.airtable.open();
    }
    if (type === "mailchimp") {
      integrationStore.mailchimp.open();
    }
    if (type === "excel") {
      integrationStore.excel.open();
    }

    return integration;
  }

  async function handleIntegrationUpdate(checked: boolean) {
    setIsEnabled(checked);
    return await updateMutation.mutateAsync({
      id: connectedIntegration?.id as string,
      isEnabled: checked,
    });
  }

  return (
    <>
      {org?.name === "Saginaw STEM" && type === "excel" && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src={image}
                alt=""
                className={className}
                width={100}
                height={100}
              />
              <CardTitle>{name}</CardTitle>
            </div>
            {comingSoon && (
              <Badge variant="blue" className="text-xs">
                Coming soon
              </Badge>
            )}
            {!comingSoon && isConnected && (
              <Switch
                title="Enable/Disable Integration"
                checked={isEnabled}
                onCheckedChange={handleIntegrationUpdate}
                disabled={userRole === "viewer"}
              />
            )}
          </div>
          <CardContent className="mt-5">
            <p className="truncate text-gray-600">{description}</p>
          </CardContent>
          <CardFooter className="mt-5 flex items-center justify-between">
            {isConnected && (
              <>
                <Badge variant="green">Connected</Badge>
                {renderActionMenu(type, connectedIntegration, userRole)}
              </>
            )}
            {!isConnected && (
              <>
                <Button
                  variant="outline"
                  leftIcon={<IconPlus size={16} />}
                  onClick={handleConnect}
                  loading={createMutation.isPending}
                  disabled={comingSoon || userRole === "viewer"}
                >
                  {createMutation.isPending ? "Connecting" : "Connect"}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      )}

      {type !== "excel" && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src={image}
                alt=""
                className={className}
                width={100}
                height={100}
              />
              <CardTitle>{name}</CardTitle>
            </div>
            {comingSoon && (
              <Badge variant="blue" className="text-xs">
                Coming soon
              </Badge>
            )}
            {!comingSoon && isConnected && (
              <Switch
                title="Enable/Disable Integration"
                checked={isEnabled}
                onCheckedChange={handleIntegrationUpdate}
                disabled={userRole === "viewer"}
              />
            )}
          </div>
          <CardContent className="mt-5">
            <p className="truncate text-gray-600">{description}</p>
          </CardContent>
          <CardFooter className="mt-5 flex items-center justify-between">
            {isConnected && (
              <>
                <Badge variant="green">Connected</Badge>
                {renderActionMenu(type, connectedIntegration, userRole)}
              </>
            )}
            {!isConnected && (
              <>
                <Button
                  variant="outline"
                  leftIcon={<IconPlus size={16} />}
                  onClick={handleConnect}
                  loading={createMutation.isPending}
                  disabled={comingSoon || userRole === "viewer"}
                >
                  {createMutation.isPending ? "Connecting" : "Connect"}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
}

type ActionMenuMap = {
  "google-sheets": React.JSX.Element;
  slack: React.JSX.Element;
  airtable: React.JSX.Element;
  notion: React.JSX.Element;
  mailchimp: React.JSX.Element;
  github: React.JSX.Element;
};

const renderActionMenu = (
  integrationType: IntegrationType,
  connectedIntegration: IntegrationOutput | null | undefined,
  userRole: string | undefined,
) => {
  const actionMenuMap = {
    "google-sheets": (
      <GoogleSheetActionsMenu
        integration={connectedIntegration}
        disabled={userRole === "viewer"}
      />
    ),
    excel: (
      <ExcelIntegrationCardActionsMenu integration={connectedIntegration} />
    ),
    slack: <IntegrationCardActionsMenu integration={connectedIntegration} />,
    airtable: (
      <AirtableIntegrationCardActionsMenu integration={connectedIntegration} />
    ),
    zapier: <IntegrationCardActionsMenu integration={connectedIntegration} />,
    webhook: <IntegrationCardActionsMenu integration={connectedIntegration} />,
    notion: <IntegrationCardActionsMenu integration={connectedIntegration} />,
    mailchimp: (
      <IntegrationCardActionsMenu integration={connectedIntegration} />
    ),
    github: <IntegrationCardActionsMenu integration={connectedIntegration} />,
  } as const;

  return actionMenuMap[integrationType as keyof ActionMenuMap];
};
