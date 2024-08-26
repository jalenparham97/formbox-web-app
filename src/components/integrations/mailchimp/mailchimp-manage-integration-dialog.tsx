"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogProps,
} from "@/components/ui/dialog";
import { type IntegrationOutput } from "@/types/integration.types";
import Link from "next/link";
import { env } from "@/env";
import {
  useIntegrationUpdateMutation,
  useMailchimpLists,
} from "@/queries/integration.queries";
import { Autocomplete } from "@/components/ui/autocomplete";
import { useMemo, useState } from "react";

interface Props extends DialogProps {
  onClose: () => void;
  integration: IntegrationOutput | null | undefined;
}

export function MailchimpManageIntegrationDialog({
  open,
  onClose,
  integration,
}: Props) {
  const [mailchimpListId, setMailchimpListId] = useState(
    integration?.mailchimpListId || "",
  );

  const lists = useMailchimpLists(
    integration?.connectionId as string,
    integration?.mailchimpDC as string,
  );

  const updateMutation = useIntegrationUpdateMutation();

  const listOptions = useMemo(() => {
    return lists?.data?.map((list) => ({
      label: list.name,
      value: list.id,
    }));
  }, [lists.data]);

  const onListChange = (option: unknown) => {
    const listId = (option as { value: string }).value;
    setMailchimpListId(listId);
  };

  const closeModal = () => {
    onClose();
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!integration) return;
    await updateMutation.mutateAsync({ id: integration.id, mailchimpListId });
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect with Mailchimp</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Add your form responses as subscribers in your Mailchimp email list{" "}
          <Link
            className="text-blue-500 hover:underline hover:underline-offset-4"
            href={`${env.NEXT_PUBLIC_DOCS_URL}/integrations/mailchimp`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn about the Mailchimp integration
          </Link>
          .
        </DialogDescription>

        <form onSubmit={onSubmit} className="mt-3">
          <div className="space-y-6">
            <Autocomplete
              label="Mailchimp List"
              defaultValue={listOptions?.find(
                (list) => list.value === integration?.mailchimpListId,
              )}
              options={listOptions}
              onChange={onListChange}
              isLoading={lists.isLoading}
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
