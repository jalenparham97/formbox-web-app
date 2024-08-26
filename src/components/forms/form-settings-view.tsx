"use client";

import { useDialog } from "@/hooks/use-dialog";
import {
  useFormById,
  useFormDeleteMutation,
  useFormUpdateMutation,
} from "@/queries/form.queries";
import { type FormOutput, type FormUpdateData } from "@/types/form.types";
import { useRouter } from "next/navigation";
import { isEqual, pick } from "radash";
import { useEffect, useState } from "react";
import { Paper } from "../ui/paper";
import { Divider } from "../ui/divider";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import { Input } from "../ui/input";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";
import { FormDeleteDialog } from "./form-delete-dialog";
import { FormRespondantEmailTemplateDialog } from "./form-respondant-email-template-dialog";
import { type Feature, hasFeatureAccess } from "@/utils/has-feature-access";
import { useOrgById, useOrgMemberRole } from "@/queries/org.queries";
import { Badge } from "../ui/badge";
import { useAuthUser } from "@/queries/user.queries";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { ColorPicker } from "../ui/color-picker";
import Link from "next/link";

function getEmailsToNotify(emails: string[]) {
  return emails.map((email) => email.trim()).join(", ");
}

interface Props {
  orgId: string;
  formId: string;
}

export function FormSettingsView({ orgId, formId }: Props) {
  const router = useRouter();
  const [deleteModal, deleteModalHandler] = useDialog();
  const [respondantEmailModal, respondantEmailModalHandler] = useDialog();
  const { data: formData } = useFormById(
    { id: formId, orgId },
    {
      refetchOnWindowFocus: false,
    },
  );

  const [form, setForm] = useState<FormOutput | null | undefined>(formData);

  useEffect(() => {
    setForm(formData);
  }, [formData]);

  const org = useOrgById(orgId);
  const user = useAuthUser();
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);

  const updateMutation = useFormUpdateMutation(orgId);
  const deleteMutation = useFormDeleteMutation(orgId);

  const handleDeleteForm = async () => {
    try {
      await deleteMutation.mutateAsync({ id: formId });
      router.push(`/dashboard/${orgId}/forms`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSettingsSave = async (data?: FormUpdateData) => {
    try {
      if (!form) return;
      const updateData = pick(form, [
        "name",
        "isClosed",
        "sendEmailNotifications",
        "sendRespondantEmailNotifications",
        "emailsToNotify",
        "limitResponses",
        "maxResponses",
        "submissionStorageDuration",
        "webhookEnabled",
        "removeFormboxBranding",
        "respondantEmailFromName",
        "respondantEmailSubject",
        "respondantEmailMessageHTML",
        "useCustomRedirect",
        "customSuccessUrl",
        "googleRecaptchaEnabled",
        "googleRecaptchaSecretKey",
        "allowedDomains",
        "customHoneypot",
        "showCustomClosedMessage",
        "closeMessageTitle",
        "closeMessageDescription",
        "useCustomThankYouPage",
        "tpBackgroundColor",
        "tpButtonBackgroundColor",
        "tpTextColor",
        "tpButtonColor",
        "tpHeader",
        "tpMessage",
        "tpButtonText",
        "tpButtonUrl",
      ]);
      await updateMutation.mutateAsync({ id: formId, ...updateData, ...data });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          name: inputValue,
        },
    );
  };

  const handleRemoveFormboxBrandingChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          removeFormboxBranding: !prevForm.removeFormboxBranding,
        },
    );
  };

  // const handleSaveAnswersChange = () => {
  //   setForm(
  //     (prevForm) =>
  //       prevForm && {
  //         ...prevForm,
  //         saveAnswers: !prevForm.saveAnswers,
  //       },
  //   );
  // };

  const handleEmailNotificationChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          sendEmailNotifications: !prevForm.sendEmailNotifications,
        },
    );
  };

  const handleCloseFormChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          isClosed: !prevForm.isClosed,
        },
    );
  };

  const handleRespondantEmailNotificationChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          sendRespondantEmailNotifications:
            !prevForm.sendRespondantEmailNotifications,
        },
    );
  };

  const handleLimitResponsesChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          limitResponses: !prevForm.limitResponses,
        },
    );
  };

  const handleMaxResponsesChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          maxResponses: Number(inputValue),
        },
    );
  };

  const handleCloseMessageChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          showCustomClosedMessage: !prevForm.showCustomClosedMessage,
        },
    );
  };

  const handleCloseMessageTitleChange = (
    e: React.FormEvent<HTMLInputElement>,
  ) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          closeMessageTitle: inputValue,
        },
    );
  };

  const handleCloseMessageDescriptionChange = (
    e: React.FormEvent<HTMLTextAreaElement>,
  ) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          closeMessageDescription: inputValue,
        },
    );
  };

  const handleUseCustomRedirectChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          useCustomRedirect: !prevForm.useCustomRedirect,
        },
    );
  };

  const handleSuccessUrlChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          customSuccessUrl: inputValue,
        },
    );
  };

  const handleUseCustomThankYouPageChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          useCustomThankYouPage: !prevForm.useCustomThankYouPage,
        },
    );
  };

  const handleAllowedDomainsChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          allowedDomains: inputValue,
        },
    );
  };

  const handleGoogleRecaptchaChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          googleRecaptchaEnabled: !prevForm.googleRecaptchaEnabled,
        },
    );
  };

  const handleGoogleRecaptchaKeyChange = (
    e: React.FormEvent<HTMLInputElement>,
  ) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          googleRecaptchaSecretKey: inputValue,
        },
    );
  };

  const handleCustomHoneypotChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          customHoneypot: inputValue,
        },
    );
  };

  const handleEmailsToNotifyChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          emailsToNotify: inputValue.split(",").map((email) => email.trim()),
        },
    );
  };
  const handleStorageDurationChange = (value: string) => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          submissionStorageDuration: value,
        },
    );
  };

  const handleTPHeaderChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          tpHeader: inputValue,
        },
    );
  };

  const handleTPButtonTextChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          tpButtonText: inputValue,
        },
    );
  };

  const handleTPMessageChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          tpMessage: inputValue,
        },
    );
  };

  const handleTPButtonUrlChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          tpButtonUrl: inputValue,
        },
    );
  };

  const handleTPButtonBackgroundColorChange = (
    e: React.FormEvent<HTMLInputElement>,
  ) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          tpButtonBackgroundColor: inputValue,
        },
    );
  };

  const handleTPButtonTextColorChange = (
    e: React.FormEvent<HTMLInputElement>,
  ) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          tpButtonColor: inputValue,
        },
    );
  };

  const handleTPTextColorChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          tpTextColor: inputValue,
        },
    );
  };

  const handleTPBackgroundColorChange = (
    e: React.FormEvent<HTMLInputElement>,
  ) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          tpBackgroundColor: inputValue,
        },
    );
  };

  const hasAccess = (feature: Feature) => {
    return hasFeatureAccess(org.data?.stripePlan, feature);
  };

  return (
    <div className="pb-[80px]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Settings</h3>
          <p className="mt-2 text-gray-600">Manage your form settings.</p>
        </div>
      </div>

      <div className="mt-6">
        <Paper>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">General</h3>
            </div>
          </div>
          <Divider />
          <div className="px-4 py-5 sm:px-6">
            <div className="space-y-3 sm:flex sm:items-center sm:justify-between sm:space-x-16 sm:space-y-0">
              <div className="space-y-1">
                <h4 className="font-semibold">Form name</h4>
                <p className="text-sm text-gray-600">
                  Only visible to you and your teammates.
                </p>
              </div>
              <div>
                <Input
                  className="sm:w-[400px]"
                  defaultValue={form?.name}
                  onChange={handleNameChange}
                  disabled={userRole?.role === "viewer"}
                />
              </div>
            </div>
          </div>
          <Divider />
          <div className="px-4 py-5 sm:px-6">
            <div className="space-y-3 sm:flex sm:items-center sm:justify-between sm:space-x-16 sm:space-y-0">
              <div className="space-y-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold">Submission storage duration</h4>
                  {!hasAccess("Submission storage duration") && (
                    <UpgradeBadge />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Choose how long Formbox stores your form submissions.
                </p>
              </div>
              <div>
                <Select
                  value={form?.submissionStorageDuration}
                  onValueChange={handleStorageDurationChange}
                  disabled={
                    userRole?.role === "viewer" ||
                    !hasAccess("Submission storage duration")
                  }
                >
                  <SelectGroup>
                    <SelectTrigger className="sm:w-[400px]">
                      <SelectValue placeholder="Choose a duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectLabel>Choose a duration</SelectLabel>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="365">365 Days</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </SelectGroup>
                </Select>
              </div>
            </div>
          </div>
          <Divider />
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold">Remove Formbox branding</h4>
                  {!hasAccess("Remove Formbox branding") && <UpgradeBadge />}
                </div>
                <p className="text-sm text-gray-600">
                  Remove &quot;Powered by Formbox&quot; branding on your form.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.removeFormboxBranding}
                  onCheckedChange={handleRemoveFormboxBrandingChange}
                  disabled={
                    userRole?.role === "viewer" ||
                    !hasAccess("Remove Formbox branding")
                  }
                />
              </div>
            </div>
          </div>
          <Divider />
          <div className="px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold">Delete form</h4>
                <p className="text-sm text-gray-600">
                  Terminate your form with all of its submissions and data.
                </p>
              </div>
              <div>
                <Button
                  variant="outline"
                  leftIcon={<IconTrash size={16} className="text-red-600" />}
                  onClick={deleteModalHandler.open}
                  disabled={userRole?.role === "viewer"}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </div>

      <div className="mt-5">
        <Paper>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Email notifications</h3>
            </div>
          </div>

          <Divider />

          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <h4 className="font-semibold">Self email notifications</h4>
                <p className="text-sm text-gray-600">
                  Get an email for you and your team on new submissions.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.sendEmailNotifications}
                  onCheckedChange={handleEmailNotificationChange}
                  disabled={userRole?.role === "viewer"}
                />
              </div>
            </div>

            {form?.sendEmailNotifications && (
              <div className="mt-4">
                <Input
                  label="Emails to notify"
                  description='Separate emails with a comma ","'
                  placeholder="e.g. email@example.com, email2@example.com"
                  defaultValue={getEmailsToNotify(form?.emailsToNotify || [""])}
                  onChange={handleEmailsToNotifyChange}
                  disabled={userRole?.role === "viewer"}
                />
              </div>
            )}
          </div>

          <Divider />

          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold">
                    Respondent email notifications
                  </h4>
                  {!hasAccess("Auto responses") && <UpgradeBadge />}
                </div>

                <p className="text-sm text-gray-600">
                  Send a customized email to respondents after a successful form
                  submission.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.sendRespondantEmailNotifications}
                  onCheckedChange={handleRespondantEmailNotificationChange}
                  disabled={
                    !hasAccess("Auto responses") || userRole?.role === "viewer"
                  }
                />
              </div>
            </div>

            {form?.sendRespondantEmailNotifications && (
              <>
                <Divider className="mt-4" />

                <div className="mt-4 flex items-center justify-between space-x-16">
                  <div className="space-y-1">
                    <h4 className="font-semibold">
                      Auto response email template
                    </h4>
                    <p className="text-sm text-gray-600">
                      Customize your respondent email notification template.
                    </p>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      onClick={respondantEmailModalHandler.open}
                      disabled={
                        !hasAccess("Auto responses") ||
                        userRole?.role === "viewer"
                      }
                    >
                      Edit template
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Paper>
      </div>

      <div className="mt-5">
        <Paper>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-semibold">Access</h3>
              </div>
            </div>
          </div>
          <Divider />
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <h4 className="font-semibold">Close form</h4>
                <p className="text-sm text-gray-600">
                  People won&apos;t be able to respond to this form anymore.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.isClosed}
                  onCheckedChange={handleCloseFormChange}
                  disabled={userRole?.role === "viewer"}
                />
              </div>
            </div>
          </div>

          <Divider />

          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <h4 className="font-semibold">
                  Limit the number of submissions
                </h4>
                <p className="text-sm text-gray-600">
                  Set how many submissions this form can receive in total.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.limitResponses}
                  onCheckedChange={handleLimitResponsesChange}
                  disabled={userRole?.role === "viewer"}
                />
              </div>
            </div>

            {form?.limitResponses && (
              <div className="mt-4">
                <Input
                  placeholder="Max submissions"
                  type="number"
                  defaultValue={form?.maxResponses || Infinity}
                  onChange={handleMaxResponsesChange}
                  disabled={userRole?.role === "viewer"}
                />
              </div>
            )}
          </div>

          {form?.type === "hosted" && (
            <>
              <Divider />

              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between space-x-16">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Closed form message</h4>
                    <p className="text-sm text-gray-600">
                      This is what your recipients will see if you close the
                      form with one of the options above.
                    </p>
                  </div>
                  <div>
                    <Switch
                      checked={form?.showCustomClosedMessage}
                      onCheckedChange={handleCloseMessageChange}
                    />
                  </div>
                </div>

                {form?.showCustomClosedMessage && (
                  <div className="mt-4 space-y-3">
                    <Input
                      placeholder="Title"
                      defaultValue={form?.closeMessageTitle}
                      onChange={handleCloseMessageTitleChange}
                    />
                    <Textarea
                      placeholder="Description"
                      rows={3}
                      defaultValue={form?.closeMessageDescription}
                      onChange={handleCloseMessageDescriptionChange}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </Paper>
      </div>

      <div className="mt-5">
        <Paper>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-semibold">Custom redirect</h3>
                {!hasAccess("Custom redirect") && <UpgradeBadge />}
              </div>
            </div>
          </div>
          <Divider />
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <h4 className="font-semibold">Use custom redirect</h4>
                <p className="text-sm text-gray-600">
                  Users will be redirected to your custom success or fail
                  URL&apos;s.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.useCustomRedirect}
                  onCheckedChange={handleUseCustomRedirectChange}
                  disabled={
                    !hasAccess("Custom redirect") || userRole?.role === "viewer"
                  }
                />
              </div>
            </div>

            {form?.useCustomRedirect && (
              <>
                <Divider className="mt-4" />

                <div className="mt-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Custom redirect URL</h4>
                    <p className="text-sm text-gray-600">
                      Users will be redirected to your custom URL on successful
                      submission.
                    </p>
                  </div>
                  <div>
                    <Input
                      className="mt-4"
                      placeholder="https://example.com/thanks"
                      defaultValue={form?.customSuccessUrl}
                      onChange={handleSuccessUrlChange}
                      disabled={
                        !hasAccess("Custom redirect") ||
                        userRole?.role === "viewer"
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </Paper>
      </div>

      {form?.type === "endpoint" && (
        <div className="mt-5">
          <Paper>
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-xl font-semibold">
                    Custom thank you page
                  </h3>
                  {!hasAccess("Custom redirect") && <UpgradeBadge />}
                </div>
              </div>
            </div>
            <Divider />
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between space-x-16">
                <div className="space-y-1">
                  <h4 className="font-semibold">Use custom thank you page</h4>
                  <p className="text-sm text-gray-600">
                    Customize the thank you page, or use the default thank you
                    page.
                  </p>
                </div>
                <div>
                  <Switch
                    checked={form?.useCustomThankYouPage}
                    onCheckedChange={handleUseCustomThankYouPageChange}
                    disabled={
                      !hasAccess("Custom redirect") ||
                      userRole?.role === "viewer"
                    }
                  />
                </div>
              </div>

              {form?.useCustomThankYouPage && (
                <>
                  <Divider className="mt-4" />

                  <div className="mt-4 flex items-center justify-between space-x-16">
                    <div className="space-y-1">
                      <h4 className="font-semibold">Thank you page</h4>
                      <p className="text-sm text-gray-600">
                        Customize the default Formbox thank you page.
                      </p>
                    </div>
                    <div>
                      <Link
                        href={`/success/${formId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          disabled={
                            !hasAccess("Customize thank you page") ||
                            userRole?.role === "viewer"
                          }
                        >
                          View preview
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="space-y-4">
                      <Input
                        label="Heading"
                        value={form?.tpHeader}
                        onChange={handleTPHeaderChange}
                        placeholder=""
                      />
                      <Textarea
                        label="Message"
                        value={form?.tpMessage}
                        onChange={handleTPMessageChange}
                      />
                      <div className="w-full items-center justify-between space-y-4 md:flex md:space-x-4 md:space-y-0">
                        <div className="w-full">
                          <Input
                            label="Button text"
                            value={form?.tpButtonText}
                            onChange={handleTPButtonTextChange}
                          />
                        </div>
                        <div className="w-full">
                          <Input
                            label="Button URL"
                            value={form?.tpButtonUrl}
                            onChange={handleTPButtonUrlChange}
                          />
                        </div>
                      </div>
                      <div className="w-full items-center justify-between space-y-4 md:flex md:space-x-4 md:space-y-0">
                        <div className="flex w-full place-items-end space-x-4">
                          <div className="w-full flex-grow">
                            <Input
                              label="Button text color"
                              className="w-full"
                              value={form?.tpButtonColor}
                              onChange={handleTPButtonTextColorChange}
                            />
                          </div>
                          <div className="w-full flex-1">
                            <ColorPicker
                              color={form?.tpButtonColor || "#030712"}
                              className="h-[36px] w-[80px]"
                              colorClassName="w-full h-6"
                              onColorChange={(color) =>
                                setForm({
                                  ...form,
                                  tpButtonColor: color.hex,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="flex w-full place-items-end space-x-4">
                          <div className="w-full flex-grow ">
                            <Input
                              label="Button background color"
                              className="w-full"
                              value={form?.tpButtonBackgroundColor}
                              onChange={handleTPButtonBackgroundColorChange}
                            />
                          </div>
                          <div className="w-full flex-1">
                            <ColorPicker
                              color={form?.tpButtonBackgroundColor || "#f3f4f6"}
                              className="h-[36px] w-[80px]"
                              colorClassName="w-full h-6"
                              onColorChange={(color) =>
                                setForm({
                                  ...form,
                                  tpButtonBackgroundColor: color.hex,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="w-full items-center justify-between space-y-4 md:flex md:space-x-4 md:space-y-0">
                        <div className="flex w-full place-items-end space-x-4">
                          <div className="w-full flex-grow ">
                            <Input
                              label="Page text color"
                              className="w-full"
                              value={form?.tpTextColor}
                              onChange={handleTPTextColorChange}
                            />
                          </div>
                          <div className="w-full flex-1">
                            <ColorPicker
                              color={form?.tpTextColor || "#030712"}
                              className="h-[36px] w-[80px]"
                              colorClassName="w-full h-6"
                              onColorChange={(color) =>
                                setForm({
                                  ...form,
                                  tpTextColor: color.hex,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="flex w-full place-items-end space-x-4">
                          <div className="w-full flex-grow">
                            <Input
                              label="Page background color"
                              className="w-full"
                              value={form?.tpBackgroundColor}
                              onChange={handleTPBackgroundColorChange}
                            />
                          </div>
                          <div className="w-full flex-1">
                            <ColorPicker
                              color={form?.tpBackgroundColor || "#ffffff"}
                              className="h-[36px] w-[80px]"
                              colorClassName="w-full h-6"
                              onColorChange={(color) =>
                                setForm({
                                  ...form,
                                  tpBackgroundColor: color.hex,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Paper>
        </div>
      )}

      <div className="mt-5">
        <Paper>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-semibold">Security</h3>
              </div>
            </div>
          </div>

          <Divider />
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold">Allowed domains</h4>
                  {!hasAccess("Domain restrictions") && <UpgradeBadge />}
                </div>
                <p className="text-sm text-gray-600">
                  Restrict form submissions to specific domains.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <Input
                placeholder="e.g. example.com, blog.example.com"
                defaultValue={form?.allowedDomains}
                onChange={handleAllowedDomainsChange}
                disabled={!hasAccess("Domain restrictions")}
              />
            </div>
          </div>

          <Divider />
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold">Custom honeypot</h4>
                  {!hasAccess("Custom honeypot") && <UpgradeBadge />}
                </div>
                <p className="text-sm text-gray-600">
                  The hidden honeypot field (&quot;_gotcha&quot;) can be used in
                  conjunction with our supported spam filtering methods, and
                  using a custom name makes it work even better.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <Input
                placeholder="_botvortex"
                defaultValue={form?.customHoneypot}
                onChange={handleCustomHoneypotChange}
                disabled={
                  !hasAccess("Custom honeypot") || userRole?.role === "viewer"
                }
              />
            </div>
          </div>

          <Divider />
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <h4 className="font-semibold">Google reCAPTCHA enabled</h4>
                <p className="text-sm text-gray-600">
                  Protect your form with google reCAPTCHA.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.googleRecaptchaEnabled}
                  onCheckedChange={handleGoogleRecaptchaChange}
                  disabled={userRole?.role === "viewer"}
                />
              </div>
            </div>

            {form?.googleRecaptchaEnabled && (
              <>
                <Divider className="mt-4" />

                <div className="mt-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold">
                      Google reCAPTCHA secret key
                    </h4>
                    <p className="text-sm text-gray-600">
                      Paste your Google reCAPTCHA Secret Key to protect your
                      form.
                    </p>
                  </div>
                  <div>
                    <Input
                      className="mt-4"
                      defaultValue={form?.googleRecaptchaSecretKey}
                      onChange={handleGoogleRecaptchaKeyChange}
                      disabled={userRole?.role === "viewer"}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </Paper>
      </div>

      <div className="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white py-5">
        <MaxWidthWrapper>
          <Button
            leftIcon={<IconDeviceFloppy size={16} />}
            loading={updateMutation.isPending}
            disabled={isEqual(formData, form) || userRole?.role === "viewer"}
            onClick={() => handleSettingsSave()}
            className="disabled:bg-gray-200 disabled:text-gray-500"
          >
            Save changes
          </Button>
        </MaxWidthWrapper>
      </div>

      <FormRespondantEmailTemplateDialog
        open={respondantEmailModal}
        onClose={respondantEmailModalHandler.close}
        submit={handleSettingsSave}
        form={form as FormOutput}
      />

      <FormDeleteDialog
        title={form?.name}
        open={deleteModal}
        onClose={deleteModalHandler.close}
        onDelete={handleDeleteForm}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

function UpgradeBadge() {
  return <Badge variant="blue">Upgrade</Badge>;
}
