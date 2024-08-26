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
  useExcelWorkbooks,
  useIntegrationUpdateMutation,
} from "@/queries/integration.queries";
import { Autocomplete } from "@/components/ui/autocomplete";
import { useMemo, useState } from "react";

interface Props extends DialogProps {
  onClose: () => void;
  integration: IntegrationOutput | null | undefined;
}

export function ExcelManageIntegrationDialog({
  open,
  onClose,
  integration,
}: Props) {
  const [bookId, setBookId] = useState(integration?.spreadsheetId || "");

  const workbooks = useExcelWorkbooks(integration?.connectionId as string);

  const updateMutation = useIntegrationUpdateMutation();

  const workbookOptions = useMemo(() => {
    return workbooks?.data?.map((workbooks) => ({
      label: workbooks.name,
      value: workbooks.id,
    }));
  }, [workbooks.data]);

  const onListChange = (option: unknown) => {
    const bookId = (option as { value: string }).value;
    setBookId(bookId);
  };

  const closeModal = () => {
    onClose();
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!integration) return;
    await updateMutation.mutateAsync({
      id: integration.id,
      spreadsheetId: bookId,
      excelWebUrl: workbooks?.data?.find((workbook) => workbook.id === bookId)
        ?.webUrl,
    });
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect with Excel</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Send your Formbox form submissions straight to an Excel spreadsheet.{" "}
          <Link
            className="text-blue-500 hover:underline hover:underline-offset-4"
            href={`${env.NEXT_PUBLIC_DOCS_URL}/integrations/google-sheets`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn about the Excel integration
          </Link>
          .
        </DialogDescription>

        <form onSubmit={onSubmit} className="mt-3">
          <div className="space-y-6">
            <Autocomplete
              label="Excel Spreadsheet Workbook"
              defaultValue={workbookOptions?.find(
                (workbook) => workbook.value === integration?.spreadsheetId,
              )}
              options={workbookOptions}
              onChange={onListChange}
              isLoading={workbooks.isLoading}
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
