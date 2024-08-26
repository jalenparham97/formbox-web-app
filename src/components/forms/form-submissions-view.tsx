"use client";

import {
  SegmentedControls,
  SegmentedControlsContent,
  SegmentedControlsList,
  SegmentedControlsTrigger,
} from "@/components/ui/segmented-controls";
import { SubmissionInboxView } from "./submission-inbox-view";
import { SubmissionSpamView } from "./submission-spam-view";
import { useAuthUser } from "@/queries/user.queries";
import { useOrgMemberRole } from "@/queries/org.queries";

interface Props {
  formId: string;
  orgId: string;
}

export function FormSubmissionsView({ formId, orgId }: Props) {
  const user = useAuthUser();
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);

  return (
    <SegmentedControls defaultValue="inbox" className="w-full">
      <SegmentedControlsList>
        <SegmentedControlsTrigger value="inbox">Inbox</SegmentedControlsTrigger>
        <SegmentedControlsTrigger value="spam">Spam</SegmentedControlsTrigger>
      </SegmentedControlsList>
      <SegmentedControlsContent value="inbox" className="mt-6">
        <SubmissionInboxView formId={formId} userRole={userRole?.role} />
      </SegmentedControlsContent>
      <SegmentedControlsContent value="spam" className="mt-6">
        <SubmissionSpamView formId={formId} userRole={userRole?.role} />
      </SegmentedControlsContent>
    </SegmentedControls>
  );
}
