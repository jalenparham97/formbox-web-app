"use client";

import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogProps,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { type IntegrationOutput } from "@/types/integration.types";
import { Autocomplete } from "../../ui/autocomplete";
import {
  useIntegrationUpdateMutation,
  useSlackChannels,
} from "@/queries/integration.queries";
import { useMemo, useState } from "react";
import Link from "next/link";
import { env } from "@/env";

interface Props extends DialogProps {
  onClose: () => void;
  integration: IntegrationOutput | null | undefined;
}

export function SlackManageIntegrationDialog({
  open,
  onClose,
  integration,
}: Props) {
  const [channelId, setChannelId] = useState(integration?.slackChannelId || "");

  const channels = useSlackChannels(integration?.connectionId as string);

  const updateMutation = useIntegrationUpdateMutation();

  const channelOptions = useMemo(() => {
    return channels?.data?.map((channel) => ({
      label: `#${channel.name}`,
      value: channel.id,
    }));
  }, [channels.data]);

  const onChannelChange = (option: unknown) => {
    const channelId = (option as { value: string }).value;
    setChannelId(channelId);
  };

  const closeModal = () => {
    onClose();
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!integration) return;
    await updateMutation.mutateAsync({
      id: integration.id,
      slackChannelId: channelId,
    });
    closeModal();
  };

  if (integration?.type !== "slack") return null;

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Connect with Slack</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Send messages to your Slack channels for new submissions.{" "}
          <Link
            className="text-blue-500 hover:underline hover:underline-offset-4"
            href={`${env.NEXT_PUBLIC_DOCS_URL}/integrations/slack`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn about the Slack integration
          </Link>
          .
        </DialogDescription>

        <form onSubmit={onSubmit} className="mt-3">
          <div className="space-y-6">
            <Input
              label="Slack workspace"
              autoFocus={false}
              allowAutoComplete={false}
              value={integration?.slackTeamName ?? ""}
              readOnly
            />
            <Autocomplete
              label="Select Slack channel or DM"
              placeholder="Select Slack channel or DM"
              description="If you don't see a channel or DM, you need to invite Formbox's Slack bot to the conversation by typing '/invite @formbox' in the Slack channel or DM."
              defaultValue={channelOptions?.find(
                (channel) => channel.value === integration?.slackChannelId,
              )}
              isLoading={channels.isLoading}
              options={channelOptions}
              onChange={onChannelChange}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              className="mt-2 sm:mt-0"
              onClick={closeModal}
              type="button"
            >
              Close
            </Button>
            <Button loading={updateMutation.isPending} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
