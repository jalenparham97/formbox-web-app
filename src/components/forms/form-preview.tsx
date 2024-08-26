"use client";
import type {
  FormFile,
  FormOutput,
  FormField,
  FormOption,
} from "@/types/form.types";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { IconArrowLeft, IconCircleCheck } from "@tabler/icons-react";
import { cn } from "@/utils/tailwind-helpers";
import { isEmpty } from "radash";
import { Controller, useForm } from "react-hook-form";
import {
  EMAIL_REGEX,
  NUMBER_REGEX,
  PHONE_NUMBER_REGEX,
} from "@/utils/constants";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { env } from "@/env";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Logo } from "../ui/logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { DatePicker } from "../ui/date-picker";
import { formatDate } from "date-fns";
import { Rating } from "../ui/Rating";
import { FileUploader } from "../ui/file-uploader";

async function createSubmission(
  answers: Record<string, string | string[]>,
  formId: string,
  file?: FormFile,
) {
  const answersToSubmit = Object.entries(answers).reduce(
    (acc, [key, value]) => {
      if (key === file?.formFieldName) {
        return acc;
      }
      return { ...acc, [key]: value };
    },
    {},
  );
  return await fetch(`${env.NEXT_PUBLIC_SUBMISSIONS_API_URL}/s/${formId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      ...answersToSubmit,
      ...(file && { fileUpload: file }),
    }),
  });
}

function processAnswers(
  data: Record<string, string | string[]>,
  form: FormOutput,
) {
  const answers = Object.entries(data)
    .map(([key, value]) => {
      const label = form?.fields.find((field) => field.id === key)
        ?.label as string;
      return {
        [label]: value,
      };
    })
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
  return answers;
}

interface Props {
  form: FormOutput;
  redirect?: () => void;
}

export function FormPreview({ form, redirect }: Props) {
  const localStorage = useLocalStorage();
  const [currentFieldGroupIndex, setCurrentFieldGroupIndex] = useState(0);
  const [currentFields, setCurrentFields] = useState<FormField[]>();
  const [file, setFile] = useState<FormFile>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const submissionCreateMutation = useMutation({
    mutationFn: async (data: Record<string, string | string[]>) =>
      await createSubmission(processAnswers(data, form), form.id, file),
  });

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

  async function onSubmit(data: Record<string, string | string[]>) {
    try {
      const result = await submissionCreateMutation.mutateAsync(data);

      if (redirect && result.ok) {
        redirect();
      }
      // clearItemsFromLocalStorage(form?.fields);
    } catch (error) {
      console.log(error);
    }
  }

  function clearItemsFromLocalStorage(fields: FormField[]) {
    for (const field of fields) {
      localStorage?.removeItem(field.id);
    }
  }

  function saveAnswerToLocalStorage(value: string, field: FormField) {
    if (form?.saveAnswers && localStorage) {
      if (field.subtype !== "multiple_choice") {
        return localStorage?.setItem(field.id, value);
      }

      if (field.subtype === "multiple_choice") {
        const item: string[] = JSON.parse(
          localStorage?.getItem(field.id || "") || JSON.stringify([]),
        );
        if (item.includes(value)) {
          const storageValue = JSON.stringify(
            item.filter((val) => val !== value),
          );
          return localStorage.setItem(field.id, storageValue);
        }
        return localStorage.setItem(field.id, JSON.stringify([...item, value]));
      }
    }
  }

  function getCheckedValue(option: FormOption, field: FormField) {
    const item: string[] = JSON.parse(
      localStorage?.getItem(field.id || "") || JSON.stringify([]),
    );
    return item.includes(option.value);
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
      {form?.pageMode === "full" && hasHeaderImage && (
        <div
          className="h-[350px] w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${form?.headerImage})`,
          }}
        ></div>
      )}
      <div className="relative mx-auto px-5">
        <div className={cn("mx-auto max-w-3xl px-5 pb-36 pt-5 md:px-[70px]")}>
          {form?.pageMode === "compact" && hasHeaderImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form?.headerImage as string}
              alt=""
              className="mb-12 h-[270px] w-full"
            />
          )}
          {hasLogoImage && (
            <div
              className={cn(
                form?.pageMode === "full" &&
                  hasHeaderImage &&
                  "-mt-[90px] md:-mt-[95px] lg:-mt-[95px]",
                form?.pageMode === "compact" && hasHeaderImage && "-mt-24 ml-5",
                !hasHeaderImage &&
                  submissionCreateMutation.isSuccess &&
                  "hidden",
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

          {submissionCreateMutation.isSuccess && !form.useCustomRedirect && (
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

          {!submissionCreateMutation.isSuccess && (
            <>
              {currentFields && (
                <div className={cn(hasLogoImage && "mt-8")}>
                  {form?.headerTitle && (
                    <h2
                      className="text-3xl font-semibold"
                      style={{ color: form?.textColor }}
                    >
                      {form?.headerTitle}
                    </h2>
                  )}
                  {form?.headerDescription && (
                    <div
                      className={cn(
                        "prose mt-4 max-w-none sm:prose prose-headings:m-0 prose-p:m-0  prose-strong:text-current prose-ul:marker:text-gray-900 prose-li:marker:text-gray-900 hover:prose-a:underline",
                        form?.textColor === "#000000" &&
                          "prose-a:text-blue-600",
                        form?.textColor !== "#000000" && "prose-a:text-current",
                      )}
                      style={{ color: form?.textColor }}
                      dangerouslySetInnerHTML={{
                        __html: form.headerDescription,
                      }}
                    ></div>
                  )}
                </div>
              )}

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

              <form
                className="mt-8 space-y-10"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div className="space-y-6">
                  {currentFields?.map((field) => {
                    if (field.subtype === "short_answer") {
                      return (
                        <Input
                          key={field.id}
                          label={field.label}
                          description={field.description}
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
                          required={field.required}
                          {...register(`${field.id}`, {
                            required: {
                              value: field.required,
                              message: `${field.label} is required`,
                            },
                            // value: localStorage?.getItem(field.id) || "",
                            // onChange: (e: React.FormEvent<HTMLInputElement>) =>
                            //   saveAnswerToLocalStorage(
                            //     e.currentTarget.value,
                            //     field
                            //   ),
                          })}
                          error={errors[`${field.id}`]?.message !== undefined}
                          errorMessage={
                            errors[`${field.id}`]?.message as string
                          }
                        />
                      );
                    }
                    if (field.subtype === "email") {
                      return (
                        <Input
                          key={field.id}
                          label={field.label}
                          description={field.description}
                          type="email"
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
                          required={field.required}
                          {...register(`${field.id}`, {
                            required: {
                              value: field.required,
                              message: `${field.label} is required`,
                            },
                            pattern: {
                              value: EMAIL_REGEX,
                              message: "Please enter a valid email address",
                            },
                            // value: localStorage?.getItem(field.id) || "",
                            // onChange: (e: React.FormEvent<HTMLInputElement>) =>
                            //   saveAnswerToLocalStorage(
                            //     e.currentTarget.value,
                            //     field
                            //   ),
                          })}
                          error={errors[`${field.id}`]?.message !== undefined}
                          errorMessage={errors[`${field.id}`]?.message as any}
                        />
                      );
                    }
                    if (field.subtype === "long_answer") {
                      return (
                        <Textarea
                          key={field.id}
                          label={field.label}
                          description={field.description}
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
                          classNames={{
                            description: cn(
                              form?.textColor !== "#000000" && "text-current",
                            ),
                          }}
                          required={field.required}
                          {...register(`${field.id}`, {
                            required: {
                              value: field.required,
                              message: `${field.label} is required`,
                            },
                            // value: localStorage?.getItem(field.id) || "",
                            // onChange: (
                            //   e: React.FormEvent<HTMLTextAreaElement>
                            // ) =>
                            //   saveAnswerToLocalStorage(
                            //     e.currentTarget.value,
                            //     field
                            //   ),
                          })}
                          error={errors[`${field.id}`]?.message !== undefined}
                          errorMessage={errors[`${field.id}`]?.message as any}
                        />
                      );
                    }
                    if (field.subtype === "number") {
                      return (
                        <Input
                          key={field.id}
                          label={field.label}
                          description={field.description}
                          type="number"
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
                          required={field.required}
                          {...register(`${field.id}`, {
                            required: {
                              value: field.required,
                              message: `${field.label} is required`,
                            },
                            pattern: {
                              value: NUMBER_REGEX,
                              message: "Please enter a valid number",
                            },
                            // value: localStorage?.getItem(field.id) || "",
                            // onChange: (e: React.FormEvent<HTMLInputElement>) =>
                            //   saveAnswerToLocalStorage(
                            //     e.currentTarget.value,
                            //     field
                            //   ),
                          })}
                          error={errors[`${field.id}`]?.message !== undefined}
                          errorMessage={
                            errors[`${field.id}`]?.message as string
                          }
                        />
                      );
                    }
                    if (field.subtype === "phone") {
                      return (
                        <Input
                          key={field.id}
                          label={field.label}
                          description={field.description}
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
                          required={field.required}
                          {...register(`${field.id}`, {
                            required: {
                              value: field.required,
                              message: `${field.label} is required`,
                            },
                            pattern: {
                              value: PHONE_NUMBER_REGEX,
                              message: "Please enter a valid phone number",
                            },
                            // value: localStorage?.getItem(field.id) || "",
                            // onChange: (e: React.FormEvent<HTMLInputElement>) =>
                            //   saveAnswerToLocalStorage(
                            //     e.currentTarget.value,
                            //     field
                            //   ),
                          })}
                          error={errors[`${field.id}`]?.message !== undefined}
                          errorMessage={
                            errors[`${field.id}`]?.message as string
                          }
                        />
                      );
                    }
                    if (field.subtype === "single_choice") {
                      return (
                        <Controller
                          key={field.id}
                          rules={{
                            required: {
                              value: field.required,
                              message: `${field.label} is required`,
                            },
                            // value: localStorage?.getItem(field.id) || "",
                          }}
                          control={control}
                          name={field.id}
                          render={({ field: { onChange } }) => (
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
                              defaultValue={
                                localStorage?.getItem(field.id) || ""
                              }
                              onValueChange={(value) => {
                                onChange(value);
                                // saveAnswerToLocalStorage(value, field);
                              }}
                              required={field.required}
                              error={
                                errors[`${field.id}`]?.message !== undefined
                              }
                              errorMessage={
                                errors[`${field.id}`]?.message as string
                              }
                            >
                              {field?.options?.map((option) => (
                                <div
                                  className="flex items-center space-x-2"
                                  key={option.id}
                                >
                                  <RadioGroupItem
                                    value={option.value}
                                    id={option.id}
                                    className="border-gray-300 bg-white data-[state=checked]:border-[color:var(--accent-color)]"
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
                          )}
                        />
                      );
                    }

                    if (field.subtype === "dropdown") {
                      return (
                        <Controller
                          key={field.id}
                          rules={{
                            required: {
                              value: field.required,
                              message: `${field.label} is required`,
                            },
                            // value: localStorage?.getItem(field.id) || "",
                          }}
                          control={control}
                          name={field.id}
                          render={({ field: { onChange } }) => (
                            <div key={field.id}>
                              <Label>{field?.label}</Label>
                              {field.showDescription && (
                                <p
                                  className={cn("text-sm text-gray-500")}
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
                              <Select
                                onValueChange={onChange}
                                required={field.required}
                              >
                                <SelectTrigger
                                  className={cn(
                                    "mt-[5px]",
                                    errors[`${field.id}`]?.message &&
                                      "accent-color border-red-500 focus:!border-red-500",
                                    inputBorderStyles,
                                  )}
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
                                      className={cn(
                                        selectContentInputBorderStyles,
                                      )}
                                    >
                                      {option.value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors[`${field.id}`]?.message && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors[`${field.id}`]?.message as string}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      );
                    }

                    if (field.subtype === "date") {
                      return (
                        <Controller
                          key={field.id}
                          rules={{
                            required: {
                              value: field.required,
                              message: `${field.label} is required`,
                            },
                            // value: localStorage?.getItem(field.id) || "",
                          }}
                          control={control}
                          name={field.id}
                          render={({ field: { onChange } }) => (
                            <div key={field.id}>
                              <DatePicker
                                label={field?.label}
                                description={field?.description}
                                onChange={(date) => {
                                  onChange(formatDate(date, "PPP"));
                                }}
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
                              {errors[`${field.id}`]?.message && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors[`${field.id}`]?.message as string}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      );
                    }

                    if (field.subtype === "rating") {
                      return (
                        <Controller
                          key={field.id}
                          rules={{
                            required: {
                              value: field.required,
                              message: `${field.label} is required`,
                            },
                          }}
                          control={control}
                          name={field.id}
                          render={({ field: { onChange } }) => (
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
                                <div className="mt-[5px] space-y-2">
                                  <Rating
                                    ratingCount={field.ratingCount}
                                    onChange={onChange}
                                  />
                                </div>
                              </div>
                              {errors[`${field.id}`]?.message && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors[`${field.id}`]?.message as string}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      );
                    }

                    if (field.subtype === "file_upload") {
                      return (
                        <Controller
                          key={field.id}
                          rules={{
                            required: {
                              value: field.required,
                              message: `${field.label} is required`,
                            },
                          }}
                          control={control}
                          name={field.id}
                          render={({ field: { onChange } }) => (
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
                                <div className="mt-[5px] space-y-2">
                                  <FileUploader
                                    className={cn(inputBorderStylesTextarea)}
                                    style={{ ...twAccentColorStyle }}
                                    orgId={form?.orgId}
                                    onUploadComplete={(file) => {
                                      onChange(file.name);
                                      setFile({
                                        name: file?.name,
                                        type: file?.type,
                                        url: file.url,
                                        size: file?.size,
                                        formFieldName: field.label,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                              {errors[`${field.id}`]?.message && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors[`${field.id}`]?.message as string}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      );
                    }

                    if (field.subtype === "multiple_choice") {
                      return (
                        <div className="space-y-2" key={field.id}>
                          <div>
                            <label
                              className="block text-base font-medium leading-6"
                              style={{ color: form?.textColor }}
                            >
                              {field?.label}
                            </label>
                            {field.showDescription && (
                              <p
                                className="block text-sm text-gray-500"
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
                          </div>
                          <div className="mt-[4px] space-y-4">
                            {field?.options?.map((option) => (
                              <div
                                className="flex items-center space-x-2"
                                key={option.id}
                              >
                                <input
                                  type="checkbox"
                                  id={option.id}
                                  className={cn(
                                    "accent-color h-[18px] w-[18px] cursor-pointer rounded border-gray-300 text-primary outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                    inputBorderStylesCheckbox,
                                  )}
                                  style={{
                                    color: form?.accentColor,
                                    ...twAccentColorStyle,
                                  }}
                                  defaultChecked={getCheckedValue(
                                    option,
                                    field,
                                  )}
                                  value={option.value}
                                  {...register(field.id, {
                                    required: {
                                      value: field.required,
                                      message: `${field.label} is required`,
                                    },
                                    // onChange: (
                                    //   e: React.FormEvent<HTMLInputElement>
                                    // ) =>
                                    //   saveAnswerToLocalStorage(
                                    //     e.currentTarget.value,
                                    //     field
                                    //   ),
                                  })}
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
                          {errors[`${field.id}`]?.message !== undefined && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors[`${field.id}`]?.message as string}
                            </p>
                          )}
                        </div>
                      );
                    }

                    if (field.subtype === "heading") {
                      return (
                        <div
                          key={field.id}
                          className="prose space-y-2 prose-headings:m-0 prose-headings:font-semibold prose-p:m-0"
                          style={{ color: form?.textColor }}
                        >
                          <h2>{field.label}</h2>
                          {field.showDescription && <p>{field.description}</p>}
                        </div>
                      );
                    }
                  })}
                </div>

                {!isLastPage() && currentFields && (
                  <div className="flex items-center justify-center">
                    <Button
                      size="lg"
                      type="button"
                      onClick={handleSubmit(getNextPage)}
                      style={
                        {
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

                {isLastPage() && currentFields && (
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      size="lg"
                      type="button"
                      style={
                        {
                          backgroundColor: form?.buttonBackgroundColor,
                          ...twAccentColorStyle,
                        } as React.CSSProperties
                      }
                      className={cn(buttonBorderStyles)}
                      onClick={handleSubmit(onSubmit)}
                      loading={isSubmitting}
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
