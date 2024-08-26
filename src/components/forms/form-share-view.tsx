"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useClipboard } from "@/hooks/use-clipboard";
import { env } from "@/env";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { fullPageEmbedCode, inlineEmbedCode } from "@/utils/code-examples";
import { CodeHighlighter } from "../ui/code-highlighter";

interface Props {
  formId: string;
}

export function FormShareView({ formId }: Props) {
  const { copy, copied } = useClipboard();
  const [embedOption, setEmbedOption] = useState("inline");

  const formEndpointUrl = `${env.NEXT_PUBLIC_APP_URL}/forms/${formId}`;

  const copyFormEndpointUrl = () => {
    copy(formEndpointUrl);
  };

  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Share Link</h3>
            <p className="mt-2 max-w-xl text-gray-600">
              Your form is now ready to be shared. Copy this link to share your
              form on messaging apps, social media, or via email.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mt-2">
            <Card className="mt-3 flex w-full items-center justify-between py-2 pl-3 pr-2 lg:w-[500px]">
              <p className="text-sm sm:text-base">{formEndpointUrl}</p>
            </Card>
            <Button
              className="mt-3"
              onClick={copyFormEndpointUrl}
              leftIcon={
                copied ? <IconCheck size={16} /> : <IconCopy size={16} />
              }
            >
              Copy link
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div>
          <h3 className="text-xl font-semibold">Embed Form</h3>
          <p className="mt-2 max-w-lg text-gray-600">
            Use these options to embed your form into your own website.
          </p>
        </div>
        <div className="mt-4">
          <Select defaultValue={embedOption} onValueChange={setEmbedOption}>
            <SelectTrigger className="w-[210px]">
              <SelectValue placeholder="Select an embed option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="inline">Inline embed</SelectItem>
                <SelectItem value="full">Full page</SelectItem>
                <SelectItem value="popup" disabled>
                  Popup (Comming soon)
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {embedOption === "inline" && (
          <div className="mt-6">
            <div>
              <p className="text-gray-600">
                Paste the below code snippet in your page where you want to show
                it:
              </p>
            </div>
            <div className="mt-4">
              <CodeHighlighter
                code={inlineEmbedCode(formEndpointUrl)}
                language="html"
              />
            </div>
          </div>
        )}
        {embedOption === "full" && (
          <div className="mt-6">
            <div>
              <p className="text-gray-600">
                Paste the below code snippet in a new page:
              </p>
            </div>
            <div className="mt-4">
              <CodeHighlighter
                code={fullPageEmbedCode(formEndpointUrl)}
                language="html"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
