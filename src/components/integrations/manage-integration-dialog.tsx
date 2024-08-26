import {
  type IntegrationType,
  type IntegrationOutput,
} from "@/types/integration.types";
import { AirtableManageIntegrationDialog } from "@/components/integrations/airtable/airtable-manage-integration-dialog";
import { SlackManageIntegrationDialog } from "@/components/integrations/slack/slack-manage-integration-dialog";
import { SheetsManageIntegrationDialog } from "@/components/integrations/google-sheets/sheets-manage-integration-dialog";
import { MailchimpManageIntegrationDialog } from "@/components/integrations/mailchimp/mailchimp-manage-integration-dialog";
import { ExcelManageIntegrationDialog } from "@/components/integrations/excel/excel-manage-integration-dialog";

type ManageIntegrationDialogProps = {
  open: boolean;
  onClose: () => void;
  type: IntegrationType;
  integration: IntegrationOutput | null | undefined;
};

export function ManageIntegrationDialog({
  open,
  onClose,
  type,
  integration,
}: ManageIntegrationDialogProps) {
  switch (type) {
    case "slack":
      return (
        <SlackManageIntegrationDialog
          open={open}
          onClose={onClose}
          integration={integration}
        />
      );
    case "google-sheets":
      return (
        <SheetsManageIntegrationDialog
          open={open}
          onClose={onClose}
          integration={integration}
        />
      );
    case "excel":
      return (
        <ExcelManageIntegrationDialog
          open={open}
          onClose={onClose}
          integration={integration}
        />
      );
    case "airtable":
      return (
        <AirtableManageIntegrationDialog
          open={open}
          onClose={onClose}
          integration={integration}
        />
      );
    case "mailchimp":
      return (
        <MailchimpManageIntegrationDialog
          open={open}
          onClose={onClose}
          integration={integration}
        />
      );
    default:
      return null;
  }
}
