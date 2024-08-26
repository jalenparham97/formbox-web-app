import { type FormUpdateData, type FormOutput } from "@/types/form.types";
import {
  Dialog,
  DialogTitle,
  type DialogProps,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RichTextEditor } from "../ui/rich-text-editor";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { IconPaperclip } from "@tabler/icons-react";

const schema = z.object({
  respondantEmailFromName: z.string().min(1, "From name is a required field."),
  respondantEmailSubject: z.string().min(1, "Subject is a required field."),
  respondantEmailMessageHTML: z.string().min(8, "Message is a required field."),
});

interface Props extends DialogProps {
  form: FormOutput;
  onClose: () => void;
  submit: (data: FormUpdateData) => Promise<void>;
}

export function FormRespondantEmailTemplateDialog({
  open,
  onClose,
  form,
  submit,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormUpdateData>({
    resolver: zodResolver(schema),
    defaultValues: {
      respondantEmailMessageHTML: form?.respondantEmailMessageHTML,
    },
  });

  function closeModal() {
    reset();
    onClose();
  }

  async function onSubmit(data: FormUpdateData) {
    await submit({ ...data });
    closeModal();
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        className="sm:max-w-[700px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Respondent email notification</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Recipients will get this email automatically after submitting your
          form if your form has an email input.
        </DialogDescription>

        <div className="mt-2">
          <div className="space-y-3">
            <Input
              label="From name"
              defaultValue={form?.respondantEmailFromName}
              {...register("respondantEmailFromName")}
              error={errors.respondantEmailFromName !== undefined}
              errorMessage={errors?.respondantEmailFromName?.message}
            />
            <Input
              label="Subject"
              defaultValue={form?.respondantEmailSubject}
              {...register("respondantEmailSubject")}
              error={errors.respondantEmailSubject !== undefined}
              errorMessage={errors?.respondantEmailSubject?.message}
            />
            <div>
              {form && (
                <Controller
                  name="respondantEmailMessageHTML"
                  control={control}
                  defaultValue={form.respondantEmailMessageHTML}
                  render={({ field }) => (
                    <RichTextEditor
                      label="Message"
                      defaultContent={form.respondantEmailMessageHTML}
                      onContentUpdate={(content) => field.onChange(content)}
                      error={errors.respondantEmailMessageHTML !== undefined}
                      errorMessage={"Message is a required field."}
                    />
                  )}
                />
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            {/* <Button type="button" variant="outline" onClick={closeModal}>
              Close
            </Button> */}
            {/* <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-9 w-9"
            >
              <IconPaperclip size={16} />
            </Button> */}
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              loading={isSubmitting}
            >
              Save changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
