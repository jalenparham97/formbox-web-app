import { Button } from "@/components/ui/button";
import {
  type DialogProps,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props extends DialogProps {
  onDelete: () => Promise<void>;
  onClose: () => void;
  title?: string | null | undefined;
  loading?: boolean;
}

export function OrgDeleteDialog({
  onClose,
  open,
  title,
  onDelete,
  loading,
}: Props) {
  function closeModal() {
    onClose();
  }

  async function handleDelete() {
    try {
      await onDelete();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Delete Organization</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete this organization{" "}
          <strong>{title}</strong>? You’ll lose all the forms and submissions
          you have collected.
        </p>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={closeModal}
            className="mt-2 w-full sm:mt-0"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            loading={loading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
