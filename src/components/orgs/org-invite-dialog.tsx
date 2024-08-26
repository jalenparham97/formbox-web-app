import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  type DialogProps,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z
    .string({ required_error: "Email is a required field." })
    .email({ message: "Please enter a valid email." }),
});

interface Props extends DialogProps {
  submit: (email: string) => Promise<void | never>;
  onClose: () => void;
}

export function OrgInviteDialog({ submit, onClose, open }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: { email: string }) => {
    await submit(data.email);
    closeModal();
  };

  const closeModal = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Invite a member to join your orgnaization. Invitations will be valid
          for 7 days.
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Email"
              {...register("email")}
              error={errors.email !== undefined}
              errorMessage={errors?.email?.message}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              className="mt-2 sm:mt-0"
              onClick={closeModal}
              type="button"
            >
              Close
            </Button>
            <Button loading={isSubmitting} type="submit">
              Send member invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
