"use client";

import { IconDownload, IconFileDownload } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  formId: string;
  isSpam: string;
}

export function SubmissionExportMenu({ formId, isSpam }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" leftIcon={<IconDownload size={16} />}>
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[170px]">
        <Link
          href={`/api/exports/submissions/${formId}?format=csv&isSpam=${isSpam}`}
          download={true}
          target="_blank"
        >
          <DropdownMenuItem>
            <IconFileDownload className="mr-2 h-4 w-4" />
            <span>Download CSV</span>
          </DropdownMenuItem>
        </Link>
        <Link
          href={`/api/exports/submissions/${formId}?format=json&isSpam=${isSpam}`}
          download={true}
          target="_blank"
        >
          <DropdownMenuItem>
            <IconFileDownload className="mr-2 h-4 w-4" />
            <span>Download JSON</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
