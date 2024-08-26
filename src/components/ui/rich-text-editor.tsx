"use client";

import TipTapLink from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useState } from "react";
import { Button } from "./button";
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconExternalLink,
  IconH1,
  IconH2,
  IconH3,
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
import { cn } from "@/utils/tailwind-helpers";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";
import { isEmpty } from "radash";
import Link from "next/link";

interface Props {
  onContentUpdate: (content: string) => void;
  defaultContent?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

export function RichTextEditor({
  onContentUpdate,
  defaultContent,
  label,
  error,
  errorMessage,
}: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [linkEditMode, setLinkEditMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "prose max-w-none prose-sm sm:prose-sm prose-li:marker:text-gray-900 prose-ul:marker:text-gray-900 border-t border-gray-300 px-3 pb-3 pt-1.5 text-gray-900 placeholder:text-gray-400 min-h-[150px] max-h-[250px] overflow-y-scroll focus:outline-none prose-p:m-0 prose-headings:m-0 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
      },
    },
    extensions: [
      StarterKit,
      TextStyle,
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

  const toggleAlignment = useCallback(
    (alignment: string) => {
      if (editor?.isActive({ textAlign: alignment })) {
        editor.chain().focus().unsetTextAlign().run();
        return;
      }

      editor?.chain().focus().setTextAlign(alignment).run();
    },
    [editor],
  );

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
    <div>
      {label && (
        <label className={cn("mb-[5px] block text-sm font-medium leading-6")}>
          {label}
        </label>
      )}
      <div
        className={cn(
          "w-full rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary",
          error && "ring-red-500 focus:!ring-red-500",
        )}
      >
        <div className="flex items-center px-1.5 py-1.5">
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
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={cn(
              "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
              editor?.isActive("heading", { level: 1 }) && "bg-gray-200/80",
            )}
          >
            <IconH1 size={16} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={cn(
              "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
              editor?.isActive("heading", { level: 2 }) && "bg-gray-200/80",
            )}
          >
            <IconH2 size={16} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={cn(
              "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
              editor?.isActive("heading", { level: 3 }) && "bg-gray-200/80",
            )}
          >
            <IconH3 size={16} />
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
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => toggleAlignment("left")}
            className={cn(
              "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
              editor?.isActive({ textAlign: "left" }) && "bg-gray-200/80",
            )}
          >
            <IconAlignLeft size={16} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => toggleAlignment("center")}
            className={cn(
              "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
              editor?.isActive({ textAlign: "center" }) && "bg-gray-200/80",
            )}
          >
            <IconAlignCenter size={16} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => toggleAlignment("right")}
            className={cn(
              "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
              editor?.isActive({ textAlign: "right" }) && "bg-gray-200/80",
            )}
          >
            <IconAlignRight size={16} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => toggleAlignment("justify")}
            className={cn(
              "mr-1 h-[30px] w-[30px] hover:bg-gray-200/80",
              editor?.isActive({ textAlign: "justify" }) && "bg-gray-200/80",
            )}
          >
            <IconAlignJustified size={16} />
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
                "flex w-[400px] items-center space-x-2 p-2",
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
        <EditorContent editor={editor} />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
