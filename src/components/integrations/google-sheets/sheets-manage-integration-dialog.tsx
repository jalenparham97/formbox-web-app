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
import { useIntegrationUpdateMutation } from "@/queries/integration.queries";

interface Props extends DialogProps {
  onClose: () => void;
  integration: IntegrationOutput | null | undefined;
}

export function SheetsManageIntegrationDialog({
  open,
  onClose,
  integration,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IntegrationUpdateFields>({
    resolver: zodResolver(integrationUpdateSchema),
    defaultValues: {
      id: integration?.id,
    },
  });

  const updateMutation = useIntegrationUpdateMutation();

  const closeModal = () => {
    onClose();
  };

  const onSubmit = async (data: IntegrationUpdateFields) => {
    await updateMutation.mutateAsync({
      ...data,
      spreadsheetId:
        data.spreadsheetId || (integration?.spreadsheetId as string),
    });
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect with Google Sheets</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Send your Formbox form submissions straight to Google Sheets.{" "}
          <Link
            className="text-blue-500 hover:underline hover:underline-offset-4"
            href={`${env.NEXT_PUBLIC_DOCS_URL}/integrations/google-sheets`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn about the Google Sheets integration
          </Link>
          .
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="space-y-6">
            <Input
              label="Spreadsheet Link"
              autoFocus={false}
              allowAutoComplete={false}
              value={`https://docs.google.com/spreadsheets/d/${integration?.spreadsheetId}`}
              readOnly
              className="cursor-default overflow-x-scroll"
            />
            <Input
              label="Spreadsheet ID"
              description="Enter the ID of the spreadsheet you want to connect to. You can find this in the URL of your spreadsheet."
              defaultValue={integration?.spreadsheetId ?? ""}
              {...register("spreadsheetId")}
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
