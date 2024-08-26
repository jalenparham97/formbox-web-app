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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { integrationUpdateSchema } from "@/utils/schemas";
import {
  type IntegrationUpdateFields,
  type IntegrationOutput,
} from "@/types/integration.types";
import Link from "next/link";
import { env } from "@/env";
import {
  useIntegrationAddMutation,
  useIntegrationUpdateMutation,
} from "@/queries/integration.queries";

interface Props extends DialogProps {
  onClose: () => void;
  integration: IntegrationOutput | null | undefined;
  formId: string;
  orgId: string;
}

export function WebhookManageIntegrationDialog({
  open,
  onClose,
  integration,
  formId,
  orgId,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IntegrationUpdateFields>({
    resolver: zodResolver(integrationUpdateSchema),
  });

  const createMutation = useIntegrationAddMutation();
  const updateMutation = useIntegrationUpdateMutation();

  const closeModal = () => {
    onClose();
  };

  const onSubmit = async (data: IntegrationUpdateFields) => {
    if (!integration?.webhookUrl) {
      await createMutation.mutateAsync({
        formId: integration?.formId || formId,
        orgId: integration?.orgId || orgId,
        type: "webhook",
        webhookUrl: data.webhookUrl,
        connectionId: "",
      });
    } else {
      await updateMutation.mutateAsync({
        ...data,
        id: integration?.id as string,
        webhookUrl: data.webhookUrl || (integration?.webhookUrl as string),
      });
    }
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a webhook endpoint</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Webhooks allow you to receive HTTP POST requests to a URL for new form
          submissions.{" "}
          <Link
            className="text-blue-500 hover:underline hover:underline-offset-4"
            href={`${env.NEXT_PUBLIC_DOCS_URL}/integrations/webhooks`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn about Webhooks
          </Link>
          .
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="space-y-6">
            <Input
              label="Endpoint URL"
              placeholder="https://example.com/webhook"
              defaultValue={integration?.webhookUrl ?? ""}
              {...register("webhookUrl")}
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
            <Button loading={isSubmitting} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
