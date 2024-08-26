"use client";

import { useCallback, useState } from "react";
import {
  IconBold,
  IconExternalLink,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconPencil,
  IconQuote,
  IconStrikethrough,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TipTapLink from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { isEmpty } from "radash";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/utils/tailwind-helpers";
import Link from "next/link";
import { Button } from "./button";

interface Props {
  onContentUpdate: (content: string) => void;
  defaultContent?: string;
  inputClassName?: string;
  placeholder?: string;
}

export default function BubbleEditor({
  onContentUpdate,
  defaultContent,
  inputClassName,
  placeholder,
}: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [linkEditMode, setLinkEditMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cn("border-none focus:ring-0 outline-none", inputClassName),
      },
    },
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
        showOnlyWhenEditable: false,
      }),
      TipTapLink.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: defaultContent,
    onUpdate({ editor }) {
      onContentUpdate(editor.getHTML());
    },
  });

  const setLink = () => {
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl, target: "_blank" })
      .run();

    setIsPopoverOpen(false);
    setLinkEditMode(false);
  };

  const unsetLink = useCallback(() => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkEditMode(false);
  }, [editor]);

  const isLinkActive = editor?.isActive("link");

  return (
    <>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, hideOnClick: false }}
          className={`bubble-menu flex w-[245px] justify-between rounded-lg border border-solid border-gray-300 bg-white shadow-xl`}
        >
          <div className="flex items-center px-1 py-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={cn(
                "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
                editor?.isActive("bold") && "bg-gray-200/80",
              )}
            >
              <IconBold size={16} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={cn(
                "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
                editor?.isActive("italic") && "bg-gray-200/80",
              )}
            >
              <IconItalic size={16} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={cn(
                "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
                editor?.isActive("strike") && "bg-gray-200/80",
              )}
            >
              <IconStrikethrough size={16} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={cn(
                "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
                editor?.isActive("blockquote") && "bg-gray-200/80",
              )}
            >
              <IconQuote size={16} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={cn(
                "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
                editor?.isActive("bulletList") && "bg-gray-200/80",
              )}
            >
              <IconList size={16} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={cn(
                "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
                editor?.isActive("orderedList") && "bg-gray-200/80",
              )}
            >
              <IconListNumbers size={16} />
            </Button>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "mr-1 h-[30px] w-[30px] data-[state=open]:bg-gray-200/80 hover:bg-gray-200/80",
                    isLinkActive && "bg-gray-200/80",
                  )}
                  type="button"
                >
                  <IconLink size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={cn(
                  "z-[10000] flex w-[400px] items-center space-x-2 p-2",
                  !isEmpty(editor?.getAttributes("link").href) &&
                    !linkEditMode &&
                    "w-[140px]",
                )}
              >
                {!isEmpty(editor?.getAttributes("link").href) &&
                  !linkEditMode && (
                    <>
                      <Link
                        href={editor?.getAttributes("link").href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-9 w-9"
                        >
                          <IconExternalLink size={16} />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => setLinkEditMode(true)}
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9"
                      >
                        <IconPencil size={16} />
                      </Button>
                      <Button
                        onClick={unsetLink}
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9"
                      >
                        <IconTrash size={16} className="text-red" />
                      </Button>
                    </>
                  )}
                {(isEmpty(editor?.getAttributes("link").href) ||
                  linkEditMode) && (
                  <>
                    <div className="flex-1">
                      <Input
                        placeholder="https://example.com"
                        defaultValue={
                          editor?.getAttributes("link").href as string
                        }
                        onChange={(e) => setLinkUrl(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button onClick={setLink}>Insert</Button>
                      <Button
                        onClick={() => {
                          setIsPopoverOpen(false);
                          setLinkEditMode(false);
                        }}
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9"
                      >
                        <IconX size={16} />
                      </Button>
                    </div>
                  </>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </>
  );
}
