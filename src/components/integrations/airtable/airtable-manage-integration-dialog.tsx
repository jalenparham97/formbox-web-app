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
  useAirtableBases,
  useAirtableTables,
  useIntegrationUpdateMutation,
} from "@/queries/integration.queries";
import { Autocomplete } from "@/components/ui/autocomplete";
import { useMemo, useState } from "react";

interface Props extends DialogProps {
  onClose: () => void;
  integration: IntegrationOutput | null | undefined;
}

export function AirtableManageIntegrationDialog({
  open,
  onClose,
  integration,
}: Props) {
  const [baseId, setBaseId] = useState("");
  const [tableId, setTableId] = useState("");

  const bases = useAirtableBases(integration?.connectionId as string);
  const tables = useAirtableTables(
    integration?.connectionId as string,
    (baseId || integration?.airtableBaseId) as string,
  );

  const updateMutation = useIntegrationUpdateMutation();

  const baseOptions = useMemo(() => {
    return bases?.data?.map((base) => ({
      label: base.name,
      value: base.id,
    }));
  }, [bases.data]);

  const tableOptions = useMemo(() => {
    return tables?.data?.map((table) => ({
      label: table.name,
      value: table.id,
    }));
  }, [tables.data]);

  const onBaseChange = (option: unknown) => {
    const baseId = (option as { value: string }).value;
    setBaseId(baseId);
  };

  const onTableChange = (option: unknown) => {
    const tableId = (option as { value: string }).value;
    setTableId(tableId);
  };

  const closeModal = () => {
    onClose();
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync({
      id: integration?.id as string,
      airtableBaseId: baseId || (integration?.airtableBaseId as string),
      airtableTableId: tableId || (integration?.airtableTableId as string),
    });
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect with Airtable</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Send your Formbox form submissions straight to Airtable.{" "}
          <Link
            className="text-blue-500 hover:underline hover:underline-offset-4"
            href={`${env.NEXT_PUBLIC_DOCS_URL}/integrations/airtable`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn about the Airtable integration
          </Link>
          .
        </DialogDescription>

        <form onSubmit={onSubmit} className="mt-3">
          <div className="space-y-6">
            <Autocomplete
              label="Select a Base"
              defaultValue={baseOptions?.find(
                (base) => base.value === integration?.airtableBaseId,
              )}
              options={baseOptions}
              onChange={onBaseChange}
            />
            <Autocomplete
              label="Select a Table"
              defaultValue={tableOptions?.find(
                (table) => table.value === integration?.airtableTableId,
              )}
              options={tableOptions}
              onChange={onTableChange}
              isLoading={tables.isLoading}
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
