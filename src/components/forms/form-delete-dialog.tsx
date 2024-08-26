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

export function FormDeleteDialog({
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
          <DialogTitle>Delete form</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete form{" "}
          <span className="font-semibold">{title}</span>? You’ll lose all the
          submissions you have collected.
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
