"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useClipboard } from "@/hooks/use-clipboard";
import {
  SegmentedControls,
  SegmentedControlsContent,
  SegmentedControlsList,
  SegmentedControlsTrigger,
} from "../ui/segmented-controls";
import {
  axiosExampleCode,
  fetchExampleCode,
  htmlExampleCode,
} from "@/utils/code-examples";
import { env } from "@/env";
import { CodeHighlighter } from "../ui/code-highlighter";

interface Props {
  formId: string;
}

export function FormSetupView({ formId }: Props) {
  const { copy, copied } = useClipboard();

  const formEndpointUrl = `${env.NEXT_PUBLIC_SUBMISSIONS_API_URL}/s/${formId}`;

  const copyFormEndpointUrl = () => {
    copy(formEndpointUrl);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Setup instructions</h3>
          <p className="mt-2 max-w-lg text-gray-600">
            Integrate your form endpoint on your website.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mt-2">
          <h3 className="font-semibold">Form endpoint URL</h3>
          <Card className="mt-3 flex w-full items-center justify-between py-2 pl-3 pr-2 lg:w-[480px]">
            <p className="text-sm sm:text-base">{formEndpointUrl}</p>
            <Button
              className="h-8 w-8 text-gray-500 hover:text-gray-900"
              variant="ghost"
              onClick={copyFormEndpointUrl}
            >
              {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            </Button>
          </Card>
        </div>

        <div className="mt-6">
          <div>
            <h3 className="font-semibold">Example code</h3>
            <p className="mt-2 text-gray-600">
              Use one of our pre-built code examples as a starting point.
            </p>
          </div>
          <div className="mt-5 w-full">
            <SegmentedControls defaultValue="html" className="w-full">
              <SegmentedControlsList>
                <SegmentedControlsTrigger value="html">
                  HTML
                </SegmentedControlsTrigger>
                <SegmentedControlsTrigger value="fetch">
                  Fetch
                </SegmentedControlsTrigger>
                <SegmentedControlsTrigger value="axios">
                  Axios
                </SegmentedControlsTrigger>
              </SegmentedControlsList>
              <SegmentedControlsContent value="html" className="">
                <CodeHighlighter
                  code={htmlExampleCode(formEndpointUrl)}
                  language="html"
                />
              </SegmentedControlsContent>
              <SegmentedControlsContent value="fetch">
                <CodeHighlighter
                  code={fetchExampleCode(formEndpointUrl)}
                  language="typescript"
                />
              </SegmentedControlsContent>
              <SegmentedControlsContent value="axios">
                <CodeHighlighter
                  code={axiosExampleCode(formEndpointUrl)}
                  language="typescript"
                />
              </SegmentedControlsContent>
            </SegmentedControls>
          </div>
        </div>
      </div>
    </div>
  );
}
