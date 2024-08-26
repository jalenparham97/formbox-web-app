"use client";

import { type SubmissionOutput } from "@/types/submission.types";
import {
  IconClock,
  IconDownload,
  IconFileSpreadsheet,
  IconFileText,
  IconInbox,
  IconPhoto,
} from "@tabler/icons-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { SubmissionCardActionsMenu } from "./submission-card-actions-menu";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/utils/tailwind-helpers";
import { Badge } from "@/components/ui/badge";
import { Roles } from "@/types/utility.types";
import { formatFileSize } from "@/utils/format-file-size";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  type ImageMimeType,
  type DocumentMimeType,
  type SpreadsheetMimeType,
  IMAGE_MIME_TYPE,
  DOCUMENT_MIME_TYPE,
  SPREADSHEET_MIME_TYPE,
} from "@/utils/constants";

const getEmail = (submission: SubmissionOutput) => {
  return (
    submission.answers?.find((answer) =>
      answer.label.toLowerCase().includes("email"),
    )?.value || "Anonymous"
  );
};

interface Props {
  submission: SubmissionOutput;
  userRole: string | undefined;
}

export function SubmissionCard({ submission, userRole }: Props) {
  async function downloadFile(fileUrl: string, fileName: string) {
    const image = await fetch(fileUrl);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Card key={submission.id} className="overflow-hidden">
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger
          asChild
          className="w-full cursor-pointer hover:bg-gray-100"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-6">
                {/* <div>
                  <Checkbox onClick={(e) => e.stopPropagation()} />
                </div> */}
                <div>
                  <p className="-mt-[3.5px] flex items-center space-x-2 text-gray-900">
                    <IconInbox size={16} />{" "}
                    <span className="font-semibold">
                      {getEmail(submission)}
                    </span>
                  </p>
                  <p className="mt-1 flex items-center space-x-2 text-sm text-gray-600">
                    <IconClock size={16} />{" "}
                    <span>
                      {formatDate(submission.createdAt, "MMM DD, YYYY h:mm A")}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {submission.isSpam && <Badge variant="yellow">Spam</Badge>}
                <SubmissionCardActionsMenu
                  submission={submission}
                  disabled={userRole === Roles.VIEWER}
                />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Divider />

          <div className="p-4">
            <div className="space-y-2 divide-y divide-gray-200">
              {submission.answers?.map((answer, i) => (
                <div key={answer.id}>
                  <div className={cn("space-y-1 pt-1", i === 0 && "pt-0")}>
                    <h4 className="font-medium text-gray-500">
                      {answer.label}
                    </h4>
                    <p>{answer.value}</p>
                  </div>
                </div>
              ))}
              {submission.files?.map((file) => (
                <div key={file.id}>
                  <div className="space-y-2 pt-2">
                    <h4 className="font-medium text-gray-500">
                      {file.formFieldName}
                    </h4>
                    <Card className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-gray-200/70 p-3.5">
                          {DOCUMENT_MIME_TYPE.includes(
                            file.type as DocumentMimeType,
                          ) && <IconFileText size={22} />}
                          {IMAGE_MIME_TYPE.includes(
                            file.type as ImageMimeType,
                          ) && <IconPhoto size={22} />}
                          {SPREADSHEET_MIME_TYPE.includes(
                            file.type as SpreadsheetMimeType,
                          ) && <IconFileSpreadsheet size={22} />}
                        </div>
                        <div className="space-y-1">
                          <Link
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <p className="font-semibold text-gray-900">
                              {file.name}
                            </p>
                          </Link>
                          <p className="text-sm text-gray-600">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          leftIcon={<IconDownload size={16} />}
                          onClick={() => downloadFile(file.url, file.name)}
                        >
                          Download
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
