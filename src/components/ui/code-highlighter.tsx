"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useClipboard } from "@/hooks/use-clipboard";
import { Button } from "./button";

interface CodeHighlighterProps {
  code: string;
  language: string;
}

export function CodeHighlighter({ code, language }: CodeHighlighterProps) {
  const { copy, copied } = useClipboard();

  const copyCodeToClipboard = () => {
    copy(code);
  };

  return (
    <div className="relative rounded-xl">
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          fontSize: 14,
          borderRadius: 14,
        }}
      >
        {code}
      </SyntaxHighlighter>
      <Button
        className="absolute right-1 top-1 hover:bg-transparent"
        size="icon"
        variant="ghost"
        onClick={copyCodeToClipboard}
      >
        {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
      </Button>
    </div>
  );
}
