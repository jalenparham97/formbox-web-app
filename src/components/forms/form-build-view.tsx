"use client";

import { useFormById } from "@/queries/form.queries";
import { Loader } from "../ui/loader";
import type {
  FormBorderStyle,
  FormElementSubType,
  FormField,
  FormOutput,
  FormPageMode,
} from "@/types/form.types";
import { FormFieldElement } from "./form-field-element";
import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import {
  IconAt,
  IconCheck,
  IconChevronDown,
  IconCircleCheck,
  IconHash,
  IconHeading,
  IconMapPin,
  IconPageBreak,
  IconPhone,
  IconPlus,
  IconSquareCheck,
  IconStar,
  IconUpload,
  IconUser,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import { Calendar } from "lucide-react";
import { cn } from "@/utils/tailwind-helpers";
import { Card } from "../ui/card";
import TextareaAutosize from "react-textarea-autosize";
import { isEmpty, isEqual } from "radash";
import { DragDropContext, type DropResult, Droppable } from "@hello-pangea/dnd";
import { HeadingElement } from "./elements/heading-element";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Divider } from "../ui/divider";
import { EmailElement } from "./elements/email-element";
import { LongAnswerElement } from "./elements/long-answer-element";
import { MultipleChoiceElement } from "./elements/multiple-choice-element";
import { NumberElement } from "./elements/number-element";
import { PageElement } from "./elements/page-element";
import { PhoneNumberElement } from "./elements/phone-number-element";
import { ShortAnswerElement } from "./elements/short-answer-element";
import { SingleChoiceElement } from "./elements/single-choice-element";
import { useFormStore } from "@/stores/form.store";
import { nanoid } from "@/libs/nanoid";
import { useEffect, useState } from "react";
import { useScrollIntoView } from "@mantine/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RadioGroup } from "@headlessui/react";
import { Skeleton } from "../ui/skeleton";
import { FormColorPicker } from "./form-color-picker";
import Link from "next/link";
import { type ColorResult } from "react-color";
import { useRouter, useSearchParams } from "next/navigation";
import { FormBuilderPreview } from "./form-builder-preview";
import { useDialog } from "@/hooks/use-dialog";
import { ImageUploader } from "../ui/image-uploader";
import {
  useFileDeleteMutation,
  useFileUploadUrlMutation,
} from "@/queries/storage.queries";
import { env } from "@/env";
import { DropdownElement } from "./elements/dropdown-element";
import { DateElement } from "./elements/date-element";
import { RatingElement } from "./elements/rating-element";
import { UploadElement } from "./elements/upload-element";
import { Textarea } from "../ui/textarea";
import { Feature, hasFeatureAccess } from "@/utils/has-feature-access";
import { useOrgById } from "@/queries/org.queries";
import BubbleEditor from "../ui/rich-text-editor-bubble";

const reorder = (list: FormField[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed as FormField);
  return result;
};

interface Props {
  formId: string;
  orgId: string;
}

export function FormBuildView({ formId, orgId }: Props) {
  const router = useRouter();
  const { form, setForm } = useFormStore();
  const [defaultMode, setDefaultMode] = useState("builder");
  const [selectedId, setSelectedId] = useState("");
  const [logoUploaderOpen, logoUploaderHandler] = useDialog();
  const [headerUploaderOpen, headerUploaderHanlder] = useDialog();
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  const { data: formData, isLoading } = useFormById(
    { id: formId, orgId },
    {
      refetchOnWindowFocus: false,
    },
  );

  const org = useOrgById(orgId);

  const deleteFileMutation = useFileDeleteMutation();
  const uploadUrlMutation = useFileUploadUrlMutation();

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") as string;

  useEffect(() => {
    if (mode === null) {
      router.push(
        `/dashboard/${orgId}/forms/${formId}/build?mode=${defaultMode}`,
      );
    } else {
      setDefaultMode(mode);
    }
  }, [defaultMode, formId, mode, orgId, router]);

  const insertElement = (fields: FormField[], subtype: FormElementSubType) => {
    const newFields = [...fields];
    const fieldId = nanoid();
    const element: FormField = {
      id: fieldId,
      label: "Untitled Question",
      subtype,
      type: "text",
      required: false,
      description: "",
      showDescription: false,
      options: [],
    };

    const pages =
      form?.fields.filter((field) => field.subtype === "page") || [];

    if (
      subtype === "multiple_choice" ||
      subtype === "single_choice" ||
      subtype === "dropdown"
    ) {
      element.options = [
        { id: nanoid(), value: "Option 1" },
        { id: nanoid(), value: "Option 2" },
        { id: nanoid(), value: "Option 3" },
      ];
    }

    if (subtype === "email") {
      element.label = "Email";
      element.type = "email";
      element.required = true;
    }

    if (subtype === "name") {
      element.label = "Full name";
      element.subtype = "short_answer";
      element.required = true;
    }

    if (subtype === "phone") {
      element.label = "Phone number";
      element.type = "tel";
    }

    if (subtype === "address") {
      element.label = "Address";
      element.subtype = "short_answer";
    }

    if (subtype === "website") {
      element.label = "Website";
      element.subtype = "short_answer";
    }

    if (subtype === "heading") {
      element.label = "Untitled Heading";
    }

    const isPage = subtype === "page";

    if (isPage) {
      element.type = "fb-page-break";
      element.label = `Page ${pages?.length === 0 ? 2 : pages?.length + 2}`;
    }

    if (selectedId && !isPage) {
      newFields.splice(
        newFields.findIndex((el) => el.id === selectedId) + 1,
        0,
        element,
      );
    } else {
      newFields.push(element);
    }

    setSelectedId(fieldId);
    scrollIntoView();
    return newFields;
  };

  const addHeadingElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "heading"),
      });
    }
  };
  const addShortAnswerElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "short_answer"),
      });
    }
  };
  const addLongAnswerElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "long_answer"),
      });
    }
  };
  const addEmailElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "email"),
      });
    }
  };
  const addNameElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "name"),
      });
    }
  };
  const addAddressElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "address"),
      });
    }
  };
  const addWebsiteElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "website"),
      });
    }
  };
  const addNumberElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "number"),
      });
    }
  };
  const addPhoneNumberElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "phone"),
      });
    }
  };
  const addDateElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "date"),
      });
    }
  };
  const addSingleChoiceElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "single_choice"),
      });
    }
  };
  const addMultipleChoiceElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "multiple_choice"),
      });
    }
  };
  const addDropdownElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "dropdown"),
      });
    }
  };
  const addRatingElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "rating"),
      });
    }
  };
  const addFileUploadElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "file_upload"),
      });
    }
  };
  const addPageElement = () => {
    if (form) {
      return setForm({
        ...form,
        fields: insertElement(form.fields, "page"),
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const fields = reorder(
      form?.fields as FormField[],
      result.source.index,
      result.destination.index,
    );
    setForm({ ...(form as FormOutput), fields });
    setSelectedId(result.draggableId);
  };

  const updateSubmitButtonText = (
    e: React.SyntheticEvent<HTMLInputElement>,
  ) => {
    const { value } = e.currentTarget;
    setForm({ ...(form as FormOutput), submitButtonText: value });
  };

  const handleTPHeaderChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setForm({ ...(form as FormOutput), tpHeader: value });
  };

  const handleTPMessageChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    setForm({ ...(form as FormOutput), tpMessage: value });
  };

  const handleTPButtonTextChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setForm({ ...(form as FormOutput), tpButtonText: value });
  };

  const handleTPButtonUrlChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setForm({ ...(form as FormOutput), tpButtonUrl: value });
  };

  const updateFormHeaderTitle = (
    e: React.SyntheticEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = e.currentTarget;
    setForm({ ...(form as FormOutput), headerTitle: value });
  };

  const updateFormHeaderDescription = (content: string) => {
    setForm({ ...(form as FormOutput), headerDescription: content });
  };

  const updateFormPageMode = (pageMode: FormPageMode) => {
    setForm({ ...(form as FormOutput), pageMode });
  };

  const updateBackgroundColor = (color: ColorResult) => {
    setForm({ ...(form as FormOutput), backgroundColor: color.hex });
  };

  const updateTextColor = (color: ColorResult) => {
    setForm({ ...(form as FormOutput), textColor: color.hex });
  };

  const updateButtonBackgroundColor = (color: ColorResult) => {
    setForm({ ...(form as FormOutput), buttonBackgroundColor: color.hex });
  };

  const updateButtonTextColor = (color: ColorResult) => {
    setForm({ ...(form as FormOutput), buttonTextColor: color.hex });
  };

  const updateAccentColor = (color: ColorResult) => {
    setForm({ ...(form as FormOutput), accentColor: color.hex });
  };

  const updateButtonBorderStyle = (borderStyle: FormBorderStyle) => {
    setForm({ ...(form as FormOutput), buttonBorderStyle: borderStyle });
  };

  const updateInputBorderStyle = (borderStyle: FormBorderStyle) => {
    setForm({ ...(form as FormOutput), inputBorderStyle: borderStyle });
  };

  function updateModeState(mode: "builder" | "style" | "success") {
    return router.push(
      `/dashboard/${orgId}/forms/${formId}/build?mode=${mode}`,
    );
  }

  const deleteImage = async (image: string | null | undefined) => {
    if (!image) return;

    if (!image.startsWith(env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL)) return;

    const fileKey = image.split("/").pop() as string;

    try {
      return await deleteFileMutation.mutateAsync({ fileKey });
    } catch (error) {
      console.log(error);
    }
  };

  const onFileUpload = async (file: File, imageKey: "headerImage" | "logo") => {
    const fileKey = `${form?.id}-${nanoid()}-${file.name}`;
    const { uploadUrl } = await uploadUrlMutation.mutateAsync({
      fileKey,
    });
    if (uploadUrl) {
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "multiport/formdata" },
        body: file,
      });
      setForm({
        ...(form as FormOutput),
        [imageKey]: `${env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL}/${fileKey}`,
      });
    }
  };

  const onUrlUpload = async (url: string, imageKey: "logo" | "headerImage") => {
    setForm({ ...(form as FormOutput), [imageKey]: url });
  };

  async function updateImageUrl(
    imageUrl: string,
    imageKey: "logo" | "headerImage",
  ) {
    if (!isEqual(formData, form)) {
      await deleteImage(form?.[imageKey]);
    }
    setForm({ ...(form as FormOutput), [imageKey]: imageUrl });
  }

  const hasAccess = (feature: Feature) => {
    return hasFeatureAccess(org.data?.stripePlan, feature);
  };

  return (
    <div className="h-full">
      <div className="flex h-full flex-col">
        {isLoading && (
          <div className="mt-72 flex w-full items-center justify-center">
            <Loader />
          </div>
        )}

        {!isLoading && form && (
          <div className="relative h-full">
            {/* Sidebar editor */}
            <div className="mt-[130px] hidden h-full lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-[380px] lg:flex-col">
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className=" flex grow flex-col gap-y-4 overflow-y-scroll border-r border-gray-200 bg-white">
                <div className="relative h-full">
                  <Tabs
                    className="relative min-h-full w-full"
                    value={defaultMode}
                  >
                    <TabsList className="sticky top-0 z-50 grid w-full grid-cols-3 space-x-0">
                      <TabsTrigger
                        className="bg-white py-2 hover:bg-gray-100 [&>*]:hover:text-gray-900"
                        value="builder"
                        onClick={() => updateModeState("builder")}
                      >
                        Elements
                      </TabsTrigger>
                      <TabsTrigger
                        className="bg-white py-2 hover:bg-gray-100 [&>*]:hover:text-gray-900"
                        value="style"
                        onClick={() => updateModeState("style")}
                      >
                        Style
                      </TabsTrigger>
                      <TabsTrigger
                        className="bg-white py-2 hover:bg-gray-100 [&>*]:hover:text-gray-900"
                        value="success"
                        onClick={() => updateModeState("success")}
                      >
                        Success page
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="success" className="mt-3 h-full pb-48">
                      {!hasAccess("Customize thank you page") && (
                        <div className="mb-3 px-4">
                          <div className="flex w-full items-center justify-between rounded-md bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            <p>Upgrade to access this feature</p>
                            <Link
                              href={`/dashboard/${orgId}/settings/subscription`}
                            >
                              <Button
                                variant="link"
                                size="sm"
                                className="text-blue-700"
                              >
                                Upgrade
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                      <div className="space-y-4 px-4">
                        <div>
                          <h4 className="text-lg font-semibold">
                            Success thank you page
                          </h4>
                          <p className="text-gray-600">
                            Customize the text and button your users will see
                            when they submit a form.
                          </p>
                        </div>
                        <Input
                          label="Heading"
                          value={form?.tpHeader}
                          onChange={handleTPHeaderChange}
                          disabled={!hasAccess("Customize thank you page")}
                        />
                        <Textarea
                          label="Message"
                          value={form?.tpMessage}
                          onChange={handleTPMessageChange}
                          disabled={!hasAccess("Customize thank you page")}
                        />
                        <Input
                          label="Button text"
                          value={form?.tpButtonText}
                          onChange={handleTPButtonTextChange}
                          disabled={!hasAccess("Customize thank you page")}
                        />
                        <Input
                          label="Button URL"
                          value={form?.tpButtonUrl}
                          onChange={handleTPButtonUrlChange}
                          disabled={!hasAccess("Customize thank you page")}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="builder" className="mt-3 h-full pb-48">
                      <div className="space-y-6">
                        <div>
                          <div className="px-4">
                            <h4 className="text-lg font-semibold">
                              Form elements
                            </h4>
                            <p className="text-gray-600">
                              Select a new element type to add to the form.
                            </p>
                          </div>
                          <div className="mt-3 border-y border-gray-200 bg-gray-50 p-4">
                            <p className="font-medium">Essentials</p>
                          </div>
                          <div className="mt-6 space-y-3 px-4">
                            <FormFieldElement
                              icon={<CgDetailsLess size="20px" />}
                              name="Short answer"
                              onClick={addShortAnswerElement}
                            />
                            <FormFieldElement
                              icon={<CgDetailsMore size="20px" />}
                              name="Long answer"
                              onClick={addLongAnswerElement}
                            />
                            <FormFieldElement
                              icon={<IconHash size="20px" />}
                              name="Number"
                              onClick={addNumberElement}
                            />
                            <FormFieldElement
                              icon={<Calendar size="20px" />}
                              name="Date"
                              onClick={addDateElement}
                            />
                            <FormFieldElement
                              icon={<IconCircleCheck size="20px" />}
                              name="Single choice"
                              onClick={addSingleChoiceElement}
                            />
                            <FormFieldElement
                              icon={<IconSquareCheck size="20px" />}
                              name="Multiple choice"
                              onClick={addMultipleChoiceElement}
                            />
                            <FormFieldElement
                              icon={<IconChevronDown size="20px" />}
                              name="Dropdown list"
                              onClick={addDropdownElement}
                            />
                            <FormFieldElement
                              icon={<IconHeading size="20px" />}
                              name="Heading"
                              onClick={addHeadingElement}
                            />
                            <FormFieldElement
                              icon={<IconPageBreak size="20px" />}
                              name="Page"
                              onClick={addPageElement}
                            />
                          </div>
                          <div className="mt-6 border-y border-gray-200 bg-gray-50 p-4">
                            <p className="font-medium">Contact Details</p>
                          </div>
                          <div className="mt-6 space-y-3 px-4">
                            <FormFieldElement
                              icon={<IconUser size="20px" />}
                              name="Full name"
                              onClick={addNameElement}
                            />
                            <FormFieldElement
                              icon={<IconAt size="20px" />}
                              name="Email address"
                              onClick={addEmailElement}
                            />
                            <FormFieldElement
                              icon={<IconPhone size="20px" />}
                              name="Phone number"
                              onClick={addPhoneNumberElement}
                            />
                            <FormFieldElement
                              icon={<IconMapPin size="20px" />}
                              name="Address"
                              onClick={addAddressElement}
                            />
                            <FormFieldElement
                              icon={<IconWorld size="20px" />}
                              name="Website"
                              onClick={addWebsiteElement}
                            />
                          </div>
                          <div className="mt-6 border-y border-gray-200 bg-gray-50 p-4">
                            <p className="font-medium">Other</p>
                          </div>
                          <div className="mt-6 space-y-3 px-4">
                            <FormFieldElement
                              icon={<IconStar size="20px" />}
                              name="Rating"
                              onClick={addRatingElement}
                            />
                            <FormFieldElement
                              icon={<IconUpload size="20px" />}
                              name="File upload"
                              onClick={addFileUploadElement}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="style"
                      className="mt-3 h-full px-4 pb-48"
                    >
                      <div>
                        <h4 className="text-lg font-semibold">Header image</h4>
                        <div className="mt-2">
                          {form?.headerImage ? (
                            <Card className="p-1">
                              <div className="flex w-full items-center justify-between">
                                <div className="w-[90%] pl-1">
                                  <Link
                                    href={form?.headerImage}
                                    className="hover:underline hover:underline-offset-4"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <p className="truncate text-sm">
                                      {form?.headerImage}
                                    </p>
                                  </Link>
                                </div>
                                <div>
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-7 w-7"
                                    onClick={() =>
                                      updateImageUrl("", "headerImage")
                                    }
                                  >
                                    <IconX size={16} />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ) : (
                            <Button
                              variant="secondary"
                              leftIcon={<IconPlus size={16} />}
                              onClick={headerUploaderHanlder.open}
                            >
                              Add header image
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="mt-8">
                        <h4 className="text-lg font-semibold">Logo</h4>
                        <div className="mt-2">
                          {form?.logo ? (
                            <Card className="p-1">
                              <div className="flex w-full items-center justify-between">
                                <div className="w-[90%] pl-1">
                                  <Link
                                    href={form?.logo}
                                    className="hover:underline hover:underline-offset-4"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <p className="truncate text-sm">
                                      {form?.logo}
                                    </p>
                                  </Link>
                                </div>
                                <div>
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-7 w-7"
                                    onClick={() => updateImageUrl("", "logo")}
                                  >
                                    <IconX size={16} />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ) : (
                            <Button
                              variant="secondary"
                              leftIcon={<IconPlus size={16} />}
                              onClick={logoUploaderHandler.open}
                            >
                              Add logo
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="mt-8">
                        <h4 className="text-lg font-semibold">Layout</h4>
                        <div className="mt-2">
                          <RadioGroup
                            value={form?.pageMode}
                            onChange={(value: FormPageMode) =>
                              updateFormPageMode(value)
                            }
                          >
                            <div className="grid grid-cols-2 gap-y-6 sm:gap-x-4">
                              <RadioGroup.Option
                                value={"compact"}
                                className={({ checked }) =>
                                  cn(
                                    checked
                                      ? "border-primary ring-1 ring-primary"
                                      : "border-gray-300",
                                    "relative flex cursor-pointer items-center rounded-lg border bg-white p-3 shadow-sm focus:outline-none",
                                  )
                                }
                              >
                                {({ checked }) => (
                                  <>
                                    <span className="flex flex-1">
                                      <span className="flex flex-col">
                                        <RadioGroup.Label
                                          as="span"
                                          className="block text-sm text-gray-900"
                                        >
                                          Compact
                                        </RadioGroup.Label>
                                      </span>
                                    </span>
                                    <IconCheck
                                      className={cn(
                                        !checked ? "invisible" : "",
                                        "h-4 w-4 text-primary",
                                      )}
                                      aria-hidden="true"
                                    />
                                  </>
                                )}
                              </RadioGroup.Option>
                              <RadioGroup.Option
                                value={"full"}
                                className={({ checked }) =>
                                  cn(
                                    checked
                                      ? "border-primary ring-1 ring-primary"
                                      : "border-gray-300",
                                    "relative flex cursor-pointer items-center rounded-lg border bg-white p-3 shadow-sm focus:outline-none",
                                  )
                                }
                              >
                                {({ checked }) => (
                                  <>
                                    <span className="flex flex-1">
                                      <span className="flex flex-col">
                                        <RadioGroup.Label
                                          as="span"
                                          className="block text-sm text-gray-900"
                                        >
                                          Full page
                                        </RadioGroup.Label>
                                      </span>
                                    </span>
                                    <IconCheck
                                      className={cn(
                                        !checked ? "invisible" : "",
                                        "h-4 w-4 text-primary",
                                      )}
                                      aria-hidden="true"
                                    />
                                  </>
                                )}
                              </RadioGroup.Option>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h4 className="text-lg font-semibold">Colors</h4>
                        <div className="mt-2">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <p className="text-gray-600">Background</p>
                              <FormColorPicker
                                color={
                                  form?.backgroundColor?.toLowerCase() || ""
                                }
                                onColorChange={updateBackgroundColor}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-600">Text</p>
                              <FormColorPicker
                                color={form?.textColor?.toLowerCase() || ""}
                                onColorChange={updateTextColor}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-600">Button background</p>
                              <FormColorPicker
                                color={
                                  form?.buttonBackgroundColor?.toLowerCase() ||
                                  ""
                                }
                                onColorChange={updateButtonBackgroundColor}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-600">Button text</p>
                              <FormColorPicker
                                color={
                                  form?.buttonTextColor?.toLowerCase() || ""
                                }
                                onColorChange={updateButtonTextColor}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-600">Accent</p>
                              <FormColorPicker
                                color={form?.accentColor?.toLowerCase() || ""}
                                onColorChange={updateAccentColor}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h4 className="text-lg font-semibold">Button style</h4>
                        <div className="mt-2">
                          <RadioGroup
                            value={form?.buttonBorderStyle}
                            onChange={(value: FormBorderStyle) =>
                              updateButtonBorderStyle(value)
                            }
                          >
                            <div className="grid grid-cols-3 gap-y-6 sm:gap-x-4">
                              <RadioGroup.Option
                                value={"flat"}
                                className={({ checked }) =>
                                  cn(
                                    checked
                                      ? "border-primary ring-1 ring-primary"
                                      : "border-gray-300",
                                    "relative cursor-pointer items-center rounded-lg border bg-white p-3 shadow-sm focus:outline-none",
                                  )
                                }
                              >
                                {() => (
                                  <>
                                    <span className="flex flex-1">
                                      <Skeleton
                                        className="h-6 w-full rounded-none"
                                        animatePulse={false}
                                      />
                                    </span>
                                  </>
                                )}
                              </RadioGroup.Option>
                              <RadioGroup.Option
                                value={"rounded"}
                                className={({ checked }) =>
                                  cn(
                                    checked
                                      ? "border-primary ring-1 ring-primary"
                                      : "border-gray-300",
                                    "relative cursor-pointer items-center rounded-lg border bg-white p-3 shadow-sm focus:outline-none",
                                  )
                                }
                              >
                                {() => (
                                  <>
                                    <span className="flex flex-1">
                                      <Skeleton
                                        className="h-6 w-full rounded-md"
                                        animatePulse={false}
                                      />
                                    </span>
                                  </>
                                )}
                              </RadioGroup.Option>
                              <RadioGroup.Option
                                value={"full"}
                                className={({ checked }) =>
                                  cn(
                                    checked
                                      ? "border-primary ring-1 ring-primary"
                                      : "border-gray-300",
                                    "relative cursor-pointer items-center rounded-lg border bg-white p-3 shadow-sm focus:outline-none",
                                  )
                                }
                              >
                                {() => (
                                  <>
                                    <span className="flex flex-1">
                                      <Skeleton
                                        className="h-6 w-full rounded-full"
                                        animatePulse={false}
                                      />
                                    </span>
                                  </>
                                )}
                              </RadioGroup.Option>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h4 className="text-lg font-semibold">Input style</h4>
                        <div className="mt-2">
                          <RadioGroup
                            value={form?.inputBorderStyle}
                            onChange={(value: FormBorderStyle) =>
                              updateInputBorderStyle(value)
                            }
                          >
                            <div className="grid grid-cols-3 gap-y-6 sm:gap-x-4">
                              <RadioGroup.Option
                                value={"flat"}
                                className={({ checked }) =>
                                  cn(
                                    checked
                                      ? "border-primary ring-1 ring-primary"
                                      : "border-gray-300",
                                    "relative cursor-pointer items-center rounded-lg border bg-white p-3 shadow-sm focus:outline-none",
                                  )
                                }
                              >
                                {() => (
                                  <>
                                    <span className="flex flex-1">
                                      <Skeleton
                                        className="h-6 w-full rounded-none"
                                        animatePulse={false}
                                      />
                                    </span>
                                  </>
                                )}
                              </RadioGroup.Option>
                              <RadioGroup.Option
                                value={"rounded"}
                                className={({ checked }) =>
                                  cn(
                                    checked
                                      ? "border-primary ring-1 ring-primary"
                                      : "border-gray-300",
                                    "relative cursor-pointer items-center rounded-lg border bg-white p-3 shadow-sm focus:outline-none",
                                  )
                                }
                              >
                                {() => (
                                  <>
                                    <span className="flex flex-1">
                                      <Skeleton
                                        className="h-6 w-full rounded-md"
                                        animatePulse={false}
                                      />
                                    </span>
                                  </>
                                )}
                              </RadioGroup.Option>
                              <RadioGroup.Option
                                value={"full"}
                                className={({ checked }) =>
                                  cn(
                                    checked
                                      ? "border-primary ring-1 ring-primary"
                                      : "border-gray-300",
                                    "relative cursor-pointer items-center rounded-lg border bg-white p-3 shadow-sm focus:outline-none",
                                  )
                                }
                              >
                                {() => (
                                  <>
                                    <span className="flex flex-1">
                                      <Skeleton
                                        className="h-6 w-full rounded-full"
                                        animatePulse={false}
                                      />
                                    </span>
                                  </>
                                )}
                              </RadioGroup.Option>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            {mode === "style" && form && (
              <div className="h-full pt-[65px] lg:pl-[380px]">
                <FormBuilderPreview form={form} />
              </div>
            )}

            {mode === "success" && form && (
              <div className="h-full pt-[65px] lg:pl-[380px]">
                <FormBuilderPreview form={form} />
              </div>
            )}

            {mode === "builder" && (
              <>
                {/* Main Builder Preview */}
                <div className={"pb-[40px] pt-[100px] lg:pl-[380px]"}>
                  <main className="h-full">
                    <div className="px-4 sm:px-6 lg:px-10">
                      <div className="mx-auto max-w-3xl">
                        {/* Form Editor */}
                        <div className="w-full">
                          <div className="w-full space-y-4">
                            {/* Form Heading Title and Description */}
                            <Card className="w-full border-gray-300">
                              <div className="w-full p-5">
                                <div className="flex w-full flex-col">
                                  <TextareaAutosize
                                    value={form?.headerTitle || ""}
                                    className="resize-none border-none text-3xl font-semibold focus:ring-0"
                                    placeholder="Form title"
                                    onChange={updateFormHeaderTitle}
                                    rows={1}
                                  />
                                  <BubbleEditor
                                    onContentUpdate={
                                      updateFormHeaderDescription
                                    }
                                    defaultContent={form.headerDescription}
                                    inputClassName="py-[8px] px-[12px] prose max-w-none prose-sm sm:prose prose-li:marker:text-gray-900 prose-ul:marker:text-gray-900 prose-p:m-0 prose-headings:m-0 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                                    placeholder="Form description (optional)"
                                  />
                                </div>
                              </div>
                            </Card>
                            {isEmpty(form?.fields) && (
                              <Card className="border-gray-300 p-5">
                                <div className="space-y-2 py-2 text-center">
                                  <h4 className="text-lg font-semibold">
                                    Start building!
                                  </h4>
                                  <p className="text-gray-600">
                                    Select elements from the right panel to add
                                    them to your form.
                                  </p>
                                </div>
                              </Card>
                            )}
                            {!isEmpty(form?.fields) && (
                              <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppable">
                                  {(provided, _snapshot) => (
                                    <>
                                      <div
                                        className="space-y-4"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {form?.fields?.map((field, i) => {
                                          return renderElement(
                                            field,
                                            i,
                                            setSelectedId,
                                            setForm,
                                            form as FormOutput,
                                            selectedId,
                                          );
                                        })}
                                        {provided.placeholder}
                                      </div>
                                      <div ref={targetRef}></div>
                                    </>
                                  )}
                                </Droppable>
                              </DragDropContext>
                            )}
                            <Card className="border-gray-300 p-5">
                              <div className="">
                                <Button size="lg" className="w-full">
                                  {form?.submitButtonText}
                                </Button>
                                <Divider className="mt-5" />
                                <div className="mt-3">
                                  <Input
                                    label="Submit button text"
                                    value={form?.submitButtonText}
                                    onChange={updateSubmitButtonText}
                                  />
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <ImageUploader
        open={headerUploaderOpen}
        onClose={headerUploaderHanlder.close}
        submit={(url: string) => onUrlUpload(url, "headerImage")}
        onUpload={(file: File) => onFileUpload(file, "headerImage")}
      />

      <ImageUploader
        open={logoUploaderOpen}
        onClose={logoUploaderHandler.close}
        submit={(url: string) => onUrlUpload(url, "logo")}
        onUpload={(file: File) => onFileUpload(file, "logo")}
        showUnsplash={false}
      />
    </div>
  );
}

type FieldsLabelMap = {
  heading: React.JSX.Element;
  short_answer: React.JSX.Element;
  long_answer: React.JSX.Element;
  multiple_choice: React.JSX.Element;
  single_choice: React.JSX.Element;
  number: React.JSX.Element;
  date: React.JSX.Element;
  rating: React.JSX.Element;
  file_upload: React.JSX.Element;
  email: React.JSX.Element;
  phone: React.JSX.Element;
  page: React.JSX.Element;
};

function renderElement(
  field: FormField,
  index: number,
  setSelectedId: (fieldId: any) => void,
  setForm: (form: FormOutput) => void,
  form: FormOutput,
  selectedId?: string,
) {
  const fieldsMap = {
    heading: (
      <HeadingElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
    short_answer: (
      <ShortAnswerElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
    long_answer: (
      <LongAnswerElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
    multiple_choice: (
      <MultipleChoiceElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
    single_choice: (
      <SingleChoiceElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
    dropdown: (
      <DropdownElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
    number: (
      <NumberElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
    date: (
      <DateElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
    rating: (
      <RatingElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
    file_upload: (
      <UploadElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
    email: (
      <EmailElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
    phone: (
      <PhoneNumberElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
    page: (
      <PageElement
        element={field}
        index={index}
        key={field.id}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setForm={setForm}
        form={form}
      />
    ),
  } as const;

  return fieldsMap[field.subtype as keyof FieldsLabelMap];
}
