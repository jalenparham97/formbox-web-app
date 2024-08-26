import type { FormOutput, FormField } from "@/types/form.types";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { IconArrowLeft, IconCircleCheck } from "@tabler/icons-react";
import { cn } from "@/utils/tailwind-helpers";
import { isEmpty } from "radash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { DatePicker } from "../ui/date-picker";
import { Rating } from "../ui/Rating";
import { FileUploader } from "../ui/file-uploader";
import Link from "next/link";
import { Logo } from "../ui/logo";
import { useSearchParams } from "next/navigation";

interface Props {
  form: FormOutput;
}

export function FormBuilderPreview({ form }: Props) {
  const [currentFieldGroupIndex, setCurrentFieldGroupIndex] = useState(0);
  const [currentFields, setCurrentFields] = useState<FormField[]>();

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") as string;

  useEffect(() => {
    const fields = fieldGroups(form)[currentFieldGroupIndex];
    setCurrentFields(fields);
  }, [form, currentFieldGroupIndex]);

  /**
   * Create field groups (or Page) using page breaks if any
   */
  function fieldGroups(form: FormOutput) {
    if (!form?.fields?.length) return [];
    const groups = [];
    let currentGroup: FormField[] = [];
    form.fields.forEach((field) => {
      currentGroup.push(field);
      if (field.type === "fb-page-break") {
        groups.push(currentGroup);
        currentGroup = [];
      }
    });
    groups.push(currentGroup);
    return groups;
  }

  function getPreviousPage() {
    setCurrentFieldGroupIndex((prevIndex) => prevIndex - 1);
  }

  function getNextPage() {
    setCurrentFieldGroupIndex((prevIndex) => prevIndex + 1);
  }

  /**
   * Returns true if we're on the last page
   */
  function isLastPage() {
    const fields = fieldGroups(form);
    return currentFieldGroupIndex === fields.length - 1 || fields.length === 0;
  }

  const buttonBorderStyles = {
    "rounded-full": form?.buttonBorderStyle === "full",
    "rounded-lg": form?.buttonBorderStyle === "rounded",
    "rounded-none": form?.buttonBorderStyle === "flat",
  };

  const inputBorderStyles = {
    "rounded-full": form?.inputBorderStyle === "full",
    "rounded-lg": form?.inputBorderStyle === "rounded",
    "rounded-none": form?.inputBorderStyle === "flat",
  };

  const selectContentInputBorderStyles = {
    "rounded-lg":
      form?.inputBorderStyle === "rounded" || form?.inputBorderStyle === "full",
    "rounded-none": form?.inputBorderStyle === "flat",
  };

  const inputBorderStylesTextarea = {
    "rounded-[16px]": form?.inputBorderStyle === "full",
    "rounded-lg": form?.inputBorderStyle === "rounded",
    "rounded-none": form?.inputBorderStyle === "flat",
  };
  const inputBorderStylesCheckbox = {
    rounded:
      form?.inputBorderStyle === "full" || form?.inputBorderStyle === "rounded",
    "rounded-none": form?.inputBorderStyle === "flat",
  };

  const accentColorStyle = {
    "--accent-color": form?.accentColor,
  } as React.CSSProperties;

  const twAccentColorStyle = {
    "--tw-ring-color": form?.accentColor,
  } as React.CSSProperties;

  const hasHeaderImage = !isEmpty(form?.headerImage);
  const hasLogoImage = !isEmpty(form?.logo);

  return (
    <div
      className={cn("h-full w-full")}
      style={{ backgroundColor: form?.backgroundColor }}
    >
      {form.pageMode === "full" && hasHeaderImage && (
        <div
          className="h-[375px] w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${form?.headerImage})`,
          }}
        ></div>
      )}
      <div className="relative mx-auto max-w-3xl px-5">
        <div className={cn("px-10 pb-36 pt-5")}>
          {form.pageMode === "compact" && hasHeaderImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form?.headerImage as string}
              alt=""
              className="mb-8 h-[270px] w-full"
            />
          )}
          {hasLogoImage && (
            <div
              className={cn(
                form?.pageMode === "full" &&
                  hasHeaderImage &&
                  "-mt-[90px] md:-mt-[95px] lg:-mt-[115px]",
                form?.pageMode === "compact" && hasHeaderImage && "-mt-24 ml-5",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form?.logo}
                alt={"Logo"}
                className={cn(
                  "h-28 w-28 rounded-full object-cover object-center",
                )}
              />
            </div>
          )}

          {mode === "success" && (
            <div
              className={cn(
                "text-center",
                hasLogoImage && "mt-8",
                !hasHeaderImage &&
                  "mt-40 flex h-full w-full flex-col items-center justify-center md:mt-52",
              )}
              style={{ color: form?.textColor }}
            >
              <IconCircleCheck size={60} className="mx-auto" />
              <h2 className="mt-6 text-2xl font-semibold lg:text-3xl">
                {form?.tpHeader || "Thanks for completing this form!"}
              </h2>
              <p className="mt-6 font-light lg:text-xl">
                {form?.tpMessage ||
                  "Made with Formbox, the easiest way to create forms for free."}
              </p>

              <Link
                href={form?.tpButtonUrl || "https://formbox.app"}
                target="_blank"
              >
                <Button className="mt-8" variant="secondary">
                  {form?.tpButtonText || "Create your own form"}
                </Button>
              </Link>

              {!form?.removeFormboxBranding && (
                <Link
                  href="https://formbox.app"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="mt-10">
                    <Button variant="outline" size="xs">
                      <div className="flex items-center space-x-2 text-gray-900">
                        <span>Powered by</span>{" "}
                        <span>
                          <Logo className="w-20" noLink />
                        </span>
                      </div>
                    </Button>
                  </div>
                </Link>
              )}
            </div>
          )}

          {mode !== "success" && (
            <>
              {/* {currentFieldGroupIndex === 0 && ( */}
              <div className={cn(hasLogoImage && "mt-8")}>
                {form?.headerTitle && (
                  <h2
                    className="text-4xl font-semibold"
                    style={{ color: form?.textColor }}
                  >
                    {form?.headerTitle}
                  </h2>
                )}
                {form?.headerDescription && (
                  <div
                    className={cn(
                      "prose mt-4 max-w-none sm:prose prose-headings:m-0 prose-p:m-0  prose-strong:text-current prose-ul:marker:text-gray-900 prose-li:marker:text-gray-900 hover:prose-a:underline",
                      form?.textColor === "#000000" && "prose-a:text-blue-600",
                      form?.textColor !== "#000000" && "prose-a:text-current",
                    )}
                    style={{ color: form?.textColor }}
                    dangerouslySetInnerHTML={{ __html: form.headerDescription }}
                  ></div>
                )}
              </div>
              {/* )} */}

              {currentFieldGroupIndex > 0 && (
                <div className="mt-8">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={getPreviousPage}
                    leftIcon={<IconArrowLeft size={16} />}
                    className={cn(buttonBorderStyles)}
                  >
                    Previous
                  </Button>
                </div>
              )}

              <form className="mt-8 space-y-10">
                <div className="space-y-8">
                  {currentFields?.map((field) => {
                    if (field.subtype === "short_answer") {
                      return (
                        <Input
                          key={field.id}
                          label={field.label}
                          description={field.description}
                          value=""
                          required={field.required}
                          allowAutoComplete={false}
                          className={cn(inputBorderStyles, "accent-color")}
                          style={accentColorStyle}
                          styles={{
                            label: { color: form?.textColor },
                            description: {
                              color:
                                form?.textColor !== "#000000"
                                  ? form?.textColor
                                  : "",
                            },
                          }}
                        />
                      );
                    }
                    if (field.subtype === "email") {
                      return (
                        <Input
                          key={field.id}
                          label={field.label}
                          description={field.description}
                          value=""
                          type="email"
                          required={field.required}
                          allowAutoComplete={false}
                          className={cn(inputBorderStyles, "accent-color")}
                          style={accentColorStyle}
                          styles={{
                            label: { color: form?.textColor },
                            description: {
                              color:
                                form?.textColor !== "#000000"
                                  ? form?.textColor
                                  : "",
                            },
                          }}
                        />
                      );
                    }
                    if (field.subtype === "long_answer") {
                      return (
                        <Textarea
                          key={field.id}
                          label={field.label}
                          description={field.description}
                          value=""
                          required={field.required}
                          className={cn(
                            inputBorderStylesTextarea,
                            "accent-color",
                          )}
                          style={accentColorStyle}
                          styles={{
                            label: { color: form?.textColor },
                            description: {
                              color:
                                form?.textColor !== "#000000"
                                  ? form?.textColor
                                  : "",
                            },
                          }}
                        />
                      );
                    }
                    if (field.subtype === "number") {
                      return (
                        <Input
                          key={field.id}
                          label={field.label}
                          description={field.description}
                          value=""
                          type="number"
                          required={field.required}
                          className={cn(inputBorderStyles, "accent-color")}
                          allowAutoComplete={false}
                          styles={{
                            label: { color: form?.textColor },
                            description: {
                              color:
                                form?.textColor !== "#000000"
                                  ? form?.textColor
                                  : "",
                            },
                          }}
                          classNames={{ label: "text-base" }}
                        />
                      );
                    }
                    if (field.subtype === "phone") {
                      return (
                        <Input
                          key={field.id}
                          label={field.label}
                          description={field.description}
                          value=""
                          required={field.required}
                          className={cn(inputBorderStyles, "accent-color")}
                          allowAutoComplete={false}
                          style={accentColorStyle}
                          styles={{
                            label: { color: form?.textColor },
                            description: {
                              color:
                                form?.textColor !== "#000000"
                                  ? form?.textColor
                                  : "",
                            },
                          }}
                          classNames={{ label: "text-base" }}
                        />
                      );
                    }
                    if (field.subtype === "single_choice") {
                      return (
                        <RadioGroup
                          key={field.id}
                          label={field?.label}
                          description={field?.description}
                          styles={{
                            label: { color: form?.textColor },
                            description: {
                              color:
                                form?.textColor !== "#000000"
                                  ? form?.textColor
                                  : "",
                            },
                          }}
                          classNames={{ label: "text-base" }}
                          className="space-y-2"
                        >
                          {field?.options?.map((option) => (
                            <div
                              className="flex items-center space-x-2"
                              key={option.id}
                            >
                              <RadioGroupItem
                                value={option.value}
                                id={option.id}
                                className="border-gray-300 bg-white"
                                style={{
                                  color: form?.accentColor,
                                  ...twAccentColorStyle,
                                }}
                              />
                              <label
                                className="text-sm"
                                htmlFor={option.id}
                                style={{ color: form?.textColor }}
                              >
                                {option.value}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      );
                    }

                    if (field.subtype === "multiple_choice") {
                      return (
                        <div className="space-y-2" key={field.id}>
                          <div>
                            <Label style={{ color: form?.textColor }}>
                              {field?.label}
                            </Label>
                            {field.showDescription && (
                              <p className="block text-sm text-gray-500">
                                {field.description}
                              </p>
                            )}
                          </div>
                          <div className="mt-[4px] space-y-4">
                            {field?.options?.map((option) => (
                              <div
                                className="flex items-center space-x-2"
                                key={option.id}
                              >
                                <input
                                  type="checkbox"
                                  value=""
                                  id={option.id}
                                  className={cn(
                                    "accent-color h-[18px] w-[18px] cursor-pointer rounded border-gray-300 text-primary outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                    inputBorderStylesCheckbox,
                                  )}
                                  style={{
                                    color: form?.accentColor,
                                    ...twAccentColorStyle,
                                  }}
                                />
                                <label
                                  className="text-sm"
                                  htmlFor={option.id}
                                  style={{ color: form?.textColor }}
                                >
                                  {option.value}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    if (field.subtype === "dropdown") {
                      return (
                        <div key={field.id}>
                          <Label style={{ color: form?.textColor }}>
                            {field?.label}
                          </Label>
                          {field.showDescription && (
                            <p
                              className="text-sm text-gray-500"
                              style={{
                                color:
                                  form?.textColor !== "#000000"
                                    ? form?.textColor
                                    : "",
                              }}
                            >
                              {field.description}
                            </p>
                          )}
                          <Select>
                            <SelectTrigger
                              className={cn("mt-[5px]", inputBorderStyles)}
                              style={{ ...twAccentColorStyle }}
                            >
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent
                              className={cn(selectContentInputBorderStyles)}
                            >
                              {field?.options?.map((option) => (
                                <SelectItem
                                  value={option.value}
                                  key={option.id}
                                  className={cn(selectContentInputBorderStyles)}
                                >
                                  {option.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }

                    if (field.subtype === "date") {
                      return (
                        <div key={field.id}>
                          <DatePicker
                            label={field?.label}
                            description={field?.description}
                            className={cn(inputBorderStyles)}
                            style={{ ...twAccentColorStyle }}
                            styles={{
                              description: {
                                color:
                                  form?.textColor !== "#000000"
                                    ? form?.textColor
                                    : "",
                              },
                            }}
                          />
                        </div>
                      );
                    }

                    if (field.subtype === "rating") {
                      return (
                        <div key={field.id}>
                          <div className="space-y-2">
                            <div>
                              <Label
                                className="cursor-pointer"
                                style={{ color: form?.textColor }}
                              >
                                {field?.label}
                              </Label>
                              {field?.description && (
                                <p
                                  className="mb-1 block text-sm text-gray-500"
                                  style={{
                                    color:
                                      form?.textColor !== "#000000"
                                        ? form?.textColor
                                        : "",
                                  }}
                                >
                                  {field?.description}
                                </p>
                              )}
                            </div>
                            <div className="mt-[4px] space-y-2">
                              <Rating ratingCount={field.ratingCount} />
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (field.subtype === "file_upload") {
                      return (
                        <div key={field.id}>
                          <Label
                            className="cursor-pointer"
                            style={{ color: form?.textColor }}
                          >
                            {field?.label}
                          </Label>
                          {field.showDescription && (
                            <p
                              className="text-sm text-gray-500"
                              style={{
                                color:
                                  form?.textColor !== "#000000"
                                    ? form?.textColor
                                    : "",
                              }}
                            >
                              {field.description}
                            </p>
                          )}
                          <div className="mt-[5px]">
                            <FileUploader
                              className={cn(inputBorderStylesTextarea)}
                              style={{ ...twAccentColorStyle }}
                            />
                          </div>
                        </div>
                      );
                    }

                    if (field.subtype === "heading") {
                      return (
                        <div className="mt-16" key={field.id}>
                          <div className="prose prose-headings:mb-2">
                            <h2 style={{ color: form?.textColor }}>
                              {field?.label}
                            </h2>
                            {field.showDescription && (
                              <p style={{ color: form?.textColor }}>
                                {field.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>

                {!isLastPage() && (
                  <div className="flex items-center justify-center">
                    <Button
                      size="lg"
                      type="button"
                      onClick={getNextPage}
                      style={
                        {
                          color: form?.buttonTextColor,
                          backgroundColor: form?.buttonBackgroundColor,
                          ...twAccentColorStyle,
                        } as React.CSSProperties
                      }
                      className={cn(buttonBorderStyles)}
                    >
                      Next
                    </Button>
                  </div>
                )}

                {isLastPage() && (
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      size="lg"
                      type="button"
                      style={
                        {
                          color: form?.buttonTextColor,
                          backgroundColor: form?.buttonBackgroundColor,
                          ...twAccentColorStyle,
                        } as React.CSSProperties
                      }
                      className={cn(buttonBorderStyles)}
                    >
                      {form?.submitButtonText}
                    </Button>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
